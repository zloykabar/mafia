const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

// Игровые комнаты
const rooms = {};

function getRoleName(role) {
    if (role === 'mafia') return 'Мафия';
    if (role === 'sheriff') return 'Шериф';
    return 'Мирный';
}

function assignRoles(playerCount) {
    let roles = [];
    let mafiaCount = Math.max(1, Math.floor(playerCount / 4));
    if (playerCount >= 10) mafiaCount = Math.min(8, Math.floor(playerCount / 3.5));
    if (playerCount <= 5) mafiaCount = 1;
    for (let i = 0; i < mafiaCount; i++) roles.push('mafia');
    roles.push('sheriff');
    for (let i = roles.length; i < playerCount; i++) roles.push('citizen');
    for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
    }
    return roles;
}

io.on('connection', (socket) => {
    console.log('Игрок подключился:', socket.id);

    // Создать комнату
    socket.on('createRoom', ({ roomId, playerName }) => {
        if (rooms[roomId]) {
            socket.emit('error', 'Комната уже существует');
            return;
        }
        rooms[roomId] = {
            players: [],
            phase: 'lobby',
            nightAction: null,
            nightVote: null,
            sheriffTarget: null,
            dayVotes: {},
            votedPlayers: [],
            gameActive: false
        };
        socket.join(roomId);
        rooms[roomId].players.push({ id: socket.id, name: playerName, role: null, isAlive: true, isRevealed: false });
        socket.emit('roomCreated', { roomId });
        io.to(roomId).emit('updatePlayers', rooms[roomId].players);
    });

    // Подключиться к комнате
    socket.on('joinRoom', ({ roomId, playerName }) => {
        if (!rooms[roomId]) {
            socket.emit('error', 'Комната не найдена');
            return;
        }
        if (rooms[roomId].players.length >= 30) {
            socket.emit('error', 'Комната полна');
            return;
        }
        socket.join(roomId);
        rooms[roomId].players.push({ id: socket.id, name: playerName, role: null, isAlive: true, isRevealed: false });
        io.to(roomId).emit('updatePlayers', rooms[roomId].players);
    });

    // Старт игры
    socket.on('startGame', ({ roomId }) => {
        const room = rooms[roomId];
        if (!room || room.gameActive) return;
        const roles = assignRoles(room.players.length);
        room.players.forEach((p, idx) => {
            p.role = roles[idx];
            p.isAlive = true;
            p.isRevealed = false;
        });
        room.gameActive = true;
        room.phase = 'night';
        room.nightAction = 'mafia';
        room.nightVote = null;
        room.sheriffTarget = null;
        room.dayVotes = {};
        room.votedPlayers = [];
        
        io.to(roomId).emit('gameStarted', { players: room.players, phase: room.phase });
        io.to(roomId).emit('updatePlayers', room.players);
    });

    // Действия ночью (мафия/шериф)
    socket.on('nightAction', ({ roomId, targetId, actionType }) => {
        const room = rooms[roomId];
        if (!room || !room.gameActive || room.phase !== 'night') return;
        
        if (actionType === 'mafia') {
            room.nightVote = targetId;
            io.to(roomId).emit('log', '🔪 Мафия выбрала жертву');
        } else if (actionType === 'sheriff') {
            room.sheriffTarget = targetId;
            io.to(roomId).emit('log', '🕵️ Шериф провёл проверку');
            finishNight(roomId);
        }
    });

    function finishNight(roomId) {
        const room = rooms[roomId];
        if (!room || room.phase !== 'night') return;
        
        if (room.nightVote) {
            const victim = room.players.find(p => p.id === room.nightVote);
            if (victim && victim.isAlive) {
                victim.isAlive = false;
                victim.isRevealed = true;
                io.to(roomId).emit('log', `💀 Убит: ${victim.name} (${getRoleName(victim.role)})`);
            }
        }
        
        if (room.sheriffTarget) {
            const checked = room.players.find(p => p.id === room.sheriffTarget);
            if (checked && checked.isAlive) {
                const result = checked.role === 'mafia' ? 'МАФИЯ' : 'МИРНЫЙ';
                io.to(roomId).emit('sheriffResult', { targetName: checked.name, result });
            }
        }
        
        room.phase = 'day';
        room.dayVotes = {};
        room.votedPlayers = [];
        io.to(roomId).emit('phaseChange', { phase: 'day' });
        io.to(roomId).emit('updatePlayers', room.players);
        checkWin(roomId);
    }

    // Дневное голосование
    socket.on('dayVote', ({ roomId, targetId }) => {
        const room = rooms[roomId];
        if (!room || !room.gameActive || room.phase !== 'day') return;
        if (room.votedPlayers.includes(socket.id)) return;
        
        const voter = room.players.find(p => p.id === socket.id);
        if (!voter || !voter.isAlive) return;
        
        room.votedPlayers.push(socket.id);
        room.dayVotes[targetId] = (room.dayVotes[targetId] || 0) + 1;
        
        const target = room.players.find(p => p.id === targetId);
        io.to(roomId).emit('log', `🗳️ ${voter.name} проголосовал за ${target?.name}`);
        
        const aliveCount = room.players.filter(p => p.isAlive).length;
        if (room.votedPlayers.length >= aliveCount) {
            executeElimination(roomId);
        }
    });

    function executeElimination(roomId) {
        const room = rooms[roomId];
        let maxVotes = -1;
        let eliminated = null;
        for (let [pid, votes] of Object.entries(room.dayVotes)) {
            if (votes > maxVotes) {
                maxVotes = votes;
                eliminated = room.players.find(p => p.id === pid);
            } else if (votes === maxVotes) {
                eliminated = null;
            }
        }
        
        if (eliminated && maxVotes > 0) {
            eliminated.isAlive = false;
            eliminated.isRevealed = true;
            io.to(roomId).emit('log', `⚖️ ИЗГНАН: ${eliminated.name} (${getRoleName(eliminated.role)})`);
        } else {
            io.to(roomId).emit('log', `🤝 Ничья, никто не казнён`);
        }
        
        room.phase = 'night';
        room.nightAction = 'mafia';
        room.nightVote = null;
        room.sheriffTarget = null;
        room.votedPlayers = [];
        room.dayVotes = {};
        
        io.to(roomId).emit('phaseChange', { phase: 'night' });
        io.to(roomId).emit('updatePlayers', room.players);
        checkWin(roomId);
    }

    function checkWin(roomId) {
        const room = rooms[roomId];
        const aliveMafia = room.players.filter(p => p.isAlive && p.role === 'mafia').length;
        const aliveGood = room.players.filter(p => p.isAlive && (p.role === 'citizen' || p.role === 'sheriff')).length;
        
        if (aliveMafia === 0) {
            io.to(roomId).emit('gameOver', { winner: 'Мирные жители победили!' });
            room.gameActive = false;
        } else if (aliveMafia >= aliveGood) {
            io.to(roomId).emit('gameOver', { winner: 'Мафия победила!' });
            room.gameActive = false;
        }
    }

    socket.on('disconnect', () => {
        console.log('Игрок отключился:', socket.id);
        for (let roomId in rooms) {
            const room = rooms[roomId];
            const idx = room.players.findIndex(p => p.id === socket.id);
            if (idx !== -1) {
                room.players.splice(idx, 1);
                io.to(roomId).emit('updatePlayers', room.players);
                if (room.players.length === 0) delete rooms[roomId];
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
