<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Мафия Онлайн | Браузерная игра от 4 до 30 человек</title>
    <style>
        * {
            box-sizing: border-box;
            user-select: none;
        }

        body {
            background: linear-gradient(145deg, #0a1a1f 0%, #071217 100%);
            font-family: 'Segoe UI', 'Poppins', 'Roboto', system-ui, -apple-system, BlinkMacSystemFont, 'Montserrat', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
        }

        /* основной контейнер игры */
        .game-container {
            max-width: 1400px;
            width: 100%;
            background: rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(2px);
            border-radius: 3rem;
            padding: 1.2rem;
            box-shadow: 0 25px 45px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 215, 150, 0.3);
        }

        /* шапка */
        .game-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            flex-wrap: wrap;
            margin-bottom: 1.5rem;
            gap: 12px;
            background: #0f2129cc;
            padding: 0.8rem 1.5rem;
            border-radius: 2.5rem;
            backdrop-filter: blur(4px);
        }

        h1 {
            margin: 0;
            font-size: 1.8rem;
            background: linear-gradient(135deg, #FFE6B0, #D4AF37);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            letter-spacing: 1px;
            text-shadow: 0 2px 3px rgba(0,0,0,0.3);
        }

        .stats-panel {
            display: flex;
            gap: 1.2rem;
            background: #00000066;
            padding: 6px 18px;
            border-radius: 60px;
            font-weight: bold;
        }

        .stat {
            color: #FFD966;
            font-size: 1rem;
        }

        .stat span {
            color: white;
            font-size: 1.3rem;
            font-weight: 800;
            margin-left: 6px;
        }

        /* панель управления */
        .control-bar {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin-bottom: 25px;
            background: #03101670;
            padding: 12px 20px;
            border-radius: 60px;
        }

        button {
            background: #2c3e2f;
            border: none;
            font-weight: bold;
            padding: 8px 20px;
            border-radius: 40px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: 0.2s;
            color: #f5f0e0;
            font-family: inherit;
            box-shadow: 0 2px 5px black;
            border-bottom: 2px solid #1e2a1a;
        }

        button:active {
            transform: scale(0.96);
        }

        button.primary {
            background: #b8860b;
            color: #fff3cf;
            border-bottom-color: #6b4c1a;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }

        button.danger {
            background: #6d2e2e;
            border-bottom-color: #3f1a1a;
        }

        button.warning {
            background: #c97e2c;
        }

        select, input {
            background: #1f2e2c;
            border: 1px solid #c9a03d;
            border-radius: 2rem;
            padding: 8px 15px;
            color: white;
            font-weight: bold;
            font-family: monospace;
            font-size: 1rem;
        }

        /* сетка игроков */
        .players-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
            gap: 1rem;
            margin: 1.5rem 0;
        }

        .player-card {
            background: linear-gradient(145deg, #1e2e2a, #0f1e1b);
            border-radius: 1.8rem;
            padding: 0.9rem;
            transition: all 0.2s;
            border-left: 6px solid #9e7b3e;
            box-shadow: 0 5px 12px black;
            cursor: pointer;
            position: relative;
        }

        .player-card.selected {
            background: #2c423a;
            border-left: 6px solid #ffb347;
            transform: scale(1.01);
            box-shadow: 0 0 0 2px #ffd96666;
        }

        .player-name {
            font-weight: bold;
            font-size: 1.25rem;
            display: flex;
            justify-content: space-between;
            color: #f7e9c3;
        }

        .player-role {
            font-size: 0.75rem;
            padding: 4px 8px;
            border-radius: 20px;
            background: #00000099;
            display: inline-block;
            margin-top: 5px;
        }

        .role-mafia { color: #ff8a7a; background: #3a1a1a; }
        .role-citizen { color: #b3e4c5; background: #1a3a2a; }
        .role-sheriff { color: #c9e9ff; background: #1a2f4a; }
        .role-dead { opacity: 0.5; filter: grayscale(0.3); text-decoration: line-through; background: #1a1a1a;}

        .player-status {
            font-size: 0.7rem;
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
        }

        .vote-badge {
            background: #af6d2c;
            border-radius: 30px;
            padding: 2px 8px;
            font-weight: bold;
        }

        .action-log {
            background: #030c0ed9;
            border-radius: 2rem;
            padding: 12px 18px;
            max-height: 180px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 0.8rem;
            margin-top: 20px;
            color: #ece3c9;
        }

        .phase-indicator {
            font-size: 1.5rem;
            font-weight: bold;
            text-align: center;
            background: #000000aa;
            padding: 6px;
            border-radius: 3rem;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }

        .inline-group {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
        }

        footer {
            font-size: 0.7rem;
            text-align: center;
            margin-top: 20px;
            color: #7c6e4a;
        }

        @media (max-width: 700px) {
            .players-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
            .player-name { font-size: 1rem; }
        }
    </style>
</head>
<body>
<div class="game-container" id="mafiaGameApp">
    <div class="game-header">
        <h1>🃏 МАФИЯ • Ночная схватка</h1>
        <div class="stats-panel">
            <div class="stat">👥 Игроки: <span id="playerCount">0</span></div>
            <div class="stat">⚖️ Фаза: <span id="phaseDisplay">Лобби</span></div>
        </div>
    </div>

    <div class="control-bar" id="lobbyControls">
        <div class="inline-group">
            <label>👤 Кол-во игроков:</label>
            <input type="number" id="playersAmount" min="4" max="30" value="6" step="1" style="width:75px">
            <button id="setupGameBtn" class="primary">🎲 НАБОР ИГРОКОВ</button>
            <button id="startGameBtn" class="primary" style="background:#1f5f2a;">🌙 СТАРТ ИГРЫ</button>
        </div>
        <button id="resetGameBtn" class="danger">🔄 Сброс игры</button>
    </div>

    <div id="gamePhasePanel" class="phase-indicator" style="display: none;">🌑 НОЧЬ | Мафия просыпается</div>
    
    <div class="players-grid" id="playersGrid"></div>

    <div id="actionArea" style="display: flex; justify-content: center; gap: 15px; margin: 10px 0; flex-wrap: wrap;">
        <!-- динамические кнопки для голосования / действий -->
    </div>

    <div id="logArea" class="action-log">
        📜 Журнал событий: <br>
        ➕ Добро пожаловать! Настройте игру (4-30 чел) и нажмите СТАРТ.
    </div>
    <footer>🎭 Игровой процесс: день — голосование за исключение, ночь — мафия убивает, шериф проверяет. Победа мафии или мирных жителей.</footer>
</div>

<script>
    // ---------- Игровое состояние ----------
    let gameActive = false;      // идет ли игра (после старта)
    let players = [];            // массив объектов игрока
    let phase = "lobby";         // lobby, night, day
    let currentNightAction = null;  // "mafia" или "sheriff" ожидание действий
    let nightVotes = new Map();   // для мафии: key = ID цели, value = голос мафиози (на самом деле просто мафия выбирает цель)
    let sheriffTarget = null;
    let dayVotes = new Map();     // голоса за исключение (playerId -> количество голосов)
    let votedPlayers = new Set();  // кто уже проголосовал днём (для ограничения одного голоса)
    let selectedPlayerId = null;   // выбранный в интерфейсе игрок для действий
    
    let turnOrder = null;          // не используется напрямую, но важно
    let gameLogs = [];

    function addLog(msg) {
        gameLogs.unshift(`🕒 ${new Date().toLocaleTimeString().slice(0,5)} ${msg}`);
        if (gameLogs.length > 22) gameLogs.pop();
        const logDiv = document.getElementById("logArea");
        if (logDiv) logDiv.innerHTML = `📜 Журнал событий: <br> ➕ ${gameLogs.join('<br> ➕ ')}`;
    }

    // Роли: мафия, мирный, шериф
    const ROLES = {
        MAFIA: "mafia",
        CITIZEN: "citizen",
        SHERIFF: "sheriff"
    };

    // Функция распределения ролей (от 4 до 30)
    function assignRoles(playersCount) {
        let rolesList = [];
        // кол-во мафии: от 1 до ~ 30% игроков, минимум 1, максимум ~9 при 30
        let mafiaCount = Math.max(1, Math.floor(playersCount / 4));
        if (playersCount >= 10) mafiaCount = Math.min(8, Math.floor(playersCount / 3.5));
        if (playersCount <= 5) mafiaCount = 1;
        let sheriffCount = 1;
        let citizenCount = playersCount - mafiaCount - sheriffCount;
        for (let i = 0; i < mafiaCount; i++) rolesList.push(ROLES.MAFIA);
        for (let i = 0; i < sheriffCount; i++) rolesList.push(ROLES.SHERIFF);
        for (let i = 0; i < citizenCount; i++) rolesList.push(ROLES.CITIZEN);
        // тасование Фишера-Йетса
        for (let i = rolesList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rolesList[i], rolesList[j]] = [rolesList[j], rolesList[i]];
        }
        return rolesList;
    }

    // инициализация игроков (именование)
    function setupPlayers(amount) {
        const roles = assignRoles(amount);
        let newPlayers = [];
        for (let i = 0; i < amount; i++) {
            newPlayers.push({
                id: i,
                name: `Игрок ${i+1}`,
                role: roles[i],
                isAlive: true,
                isRevealed: false,   // для отображения роли только после смерти/конца?
                nightActionDone: false, // сделал ли действие ночью
                votedFor: null,
            });
        }
        return newPlayers;
    }

    // перезапуск состояния игры
    function resetGame(keepPlayerCount = true) {
        gameActive = false;
        phase = "lobby";
        nightVotes.clear();
        sheriffTarget = null;
        dayVotes.clear();
        votedPlayers.clear();
        selectedPlayerId = null;
        const amountInput = document.getElementById("playersAmount");
        let count = keepPlayerCount ? parseInt(amountInput.value) : 6;
        if (isNaN(count)) count = 6;
        count = Math.min(30, Math.max(4, count));
        players = setupPlayers(count);
        document.getElementById("playerCount").innerText = players.length;
        document.getElementById("phaseDisplay").innerText = "Лобби";
        document.getElementById("gamePhasePanel").style.display = "none";
        document.getElementById("actionArea").innerHTML = "";
        addLog(`🔄 Игра сброшена. Набрано игроков: ${players.length}. Нажмите СТАРТ.`);
        renderPlayers();
        gameActive = false;
        enableLobbyControls(true);
    }

    function enableLobbyControls(enable) {
        const setupBtn = document.getElementById("setupGameBtn");
        const startBtn = document.getElementById("startGameBtn");
        const resetBtn = document.getElementById("resetGameBtn");
        const playersAmountInput = document.getElementById("playersAmount");
        setupBtn.disabled = !enable;
        startBtn.disabled = !enable;
        playersAmountInput.disabled = !enable;
        if(enable && !gameActive) {
            // на всякий
        }
        if(!enable && gameActive){
            setupBtn.disabled = true;
            startBtn.disabled = true;
        }
    }

    // начало игры: распределение ролей, переход в ночь
    function startGame() {
        if (gameActive) {
            addLog("⚠️ Игра уже идёт! Сбросьте сначала.");
            return;
        }
        const alivePlayers = players.filter(p => p.isAlive).length;
        if (alivePlayers < 4) {
            addLog(`❌ Недостаточно живых игроков (${alivePlayers}). Нужно минимум 4 живых. Используйте 'Набор игроков' чтобы увеличить.`);
            return;
        }
        // перераспределяем роли со стартом
        const rolesNew = assignRoles(players.length);
        for (let i = 0; i < players.length; i++) {
            players[i].role = rolesNew[i];
            players[i].isAlive = true;
            players[i].isRevealed = false;
            players[i].nightActionDone = false;
            players[i].votedFor = null;
        }
        gameActive = true;
        phase = "night";
        document.getElementById("phaseDisplay").innerText = "🌙 НОЧЬ";
        document.getElementById("gamePhasePanel").style.display = "block";
        document.getElementById("gamePhasePanel").innerHTML = "🌑 НОЧЬ | Мафия, выберите жертву";
        enableLobbyControls(false);
        
        // сброс ночных голосов
        nightVotes.clear();
        sheriffTarget = null;
        dayVotes.clear();
        votedPlayers.clear();
        for(let p of players) p.nightActionDone = false;
        
        currentNightAction = "mafia"; // сначала мафия голосует
        addLog(`🌙 НАЧАЛО НОЧИ. Мафия просыпается и выбирает жертву! (шериф пока ждет)`);
        renderPlayers();
        updateActionButtons();
    }

    // обрабатываем голосование мафии (клик по игроку)
    function selectMafiaTarget(playerId) {
        if (!gameActive || phase !== "night" || currentNightAction !== "mafia") return false;
        const targetPlayer = players.find(p => p.id === playerId);
        if (!targetPlayer || !targetPlayer.isAlive) {
            addLog(`Нельзя выбрать мёртвого игрока.`);
            return false;
        }
        // мафия не может убить себя и не может убить мафию? по классике - может любого кроме себя
        const currentMafia = players.filter(p => p.role === ROLES.MAFIA && p.isAlive);
        if (currentMafia.length === 0) {
            addLog(`Нет живых мафиози! Автопереход.`);
            finishNightPhase();
            return false;
        }
        // Сохраняем цель (единый консенсус - последний клик мафиози, или голосуем большинством? упростим: ведущий (игрок интерфейс) но мафия коллективно выбирает через ведущего. для браузера - любой живой нажавший на цель - установит цель для мафии)
        nightVotes.set("mafia_consensus", playerId);
        addLog(`🔪 Мафия выбрала цель: ${targetPlayer.name}. Ожидание подтверждения (Шериф затем) или нажмите "Завершить ночь"`);
        // можно дать кнопку завершения ночи после выбора мафии
        renderPlayers();
        updateActionButtons();
        return true;
    }

    // шериф выбирает проверку
    function selectSheriffTarget(playerId) {
        if (!gameActive || phase !== "night" || currentNightAction !== "sheriff") return false;
        const sheriffAlive = players.find(p => p.role === ROLES.SHERIFF && p.isAlive);
        if (!sheriffAlive) {
            addLog(`Шериф мёртв, пропускаем его действие.`);
            finishNightPhase();
            return false;
        }
        const target = players.find(p => p.id === playerId && p.isAlive);
        if (!target) return false;
        sheriffTarget = playerId;
        addLog(`🕵️ Шериф проверил игрока ${target.name}. Результат будет объявлен утром.`);
        // отмечаем что шериф сделал
        sheriffAlive.nightActionDone = true;
        finishNightPhase(); // после выбора шерифа завершаем ночь
        return true;
    }

    function finishNightPhase() {
        if (!gameActive || phase !== "night") return;
        // применяем убийство от мафии
        const mafiaKillId = nightVotes.get("mafia_consensus");
        let killedPlayer = null;
        if (mafiaKillId !== undefined) {
            const victim = players.find(p => p.id === mafiaKillId);
            if (victim && victim.isAlive) {
                victim.isAlive = false;
                victim.isRevealed = true;
                killedPlayer = victim;
                addLog(`💀 СОВЕРШЕНО УБИЙСТВО: ${victim.name} погибает этой ночью. Роль: ${getRoleName(victim.role)}`);
            } else {
                addLog(`❗ Мафия не выбрала цель или жертва недоступна, ночь прошла без убийства.`);
            }
        } else {
            addLog(`😴 Мафия спала, убийства не случилось.`);
        }

        // проверка шерифа
        if (sheriffTarget !== null) {
            const checked = players.find(p => p.id === sheriffTarget);
            if (checked && checked.isAlive) {
                const roleResult = (checked.role === ROLES.MAFIA) ? "МАФИЯ" : "МИРНЫЙ";
                addLog(`🔎 Шериф узнал, что ${checked.name} — ${roleResult}.`);
            } else if (checked && !checked.isAlive){
                addLog(`🔎 Шериф пытался проверить убитого, правда скрыта во тьме...`);
            }
        } else {
            addLog(`🕊️ Шериф не провёл проверку.`);
        }

        // сброс ночных флагов
        for(let p of players) p.nightActionDone = false;
        // переход в день
        phase = "day";
        document.getElementById("phaseDisplay").innerText = "☀️ ДЕНЬ";
        document.getElementById("gamePhasePanel").innerHTML = "☀️ ДЕНЬ | Обсуждение и голосование";
        addLog(`☀️ Наступил ДЕНЬ. Все просыпаются! Голосуйте за подозреваемого.`);
        dayVotes.clear();
        votedPlayers.clear();
        selectedPlayerId = null;
        renderPlayers();
        updateActionButtons();
        checkWinCondition(); // после убийства проверяем победу
        if(gameActive) prepareDayVote();
    }

    function prepareDayVote() {
        // выставляем кнопки голосования
        updateActionButtons();
    }

    function voteForPlayer(voterId, targetId) {
        if (!gameActive || phase !== "day") return false;
        if (votedPlayers.has(voterId)) {
            addLog(`⚠️ Игрок уже проголосовал сегодня!`);
            return false;
        }
        const voter = players.find(p => p.id === voterId);
        if (!voter || !voter.isAlive) return false;
        const target = players.find(p => p.id === targetId);
        if (!target || !target.isAlive) return false;
        votedPlayers.add(voterId);
        let current = dayVotes.get(targetId) || 0;
        dayVotes.set(targetId, current + 1);
        addLog(`🗳️ ${voter.name} проголосовал за исключение ${target.name}.`);
        renderPlayers();
        updateActionButtons();
        // проверка, все ли живые проголосовали
        const aliveIds = players.filter(p => p.isAlive).map(p => p.id);
        const allVoted = aliveIds.every(id => votedPlayers.has(id));
        if (allVoted && aliveIds.length > 0) {
            executeElimination();
        }
        return true;
    }

    function executeElimination() {
        if (phase !== "day") return;
        let maxVotes = -1;
        let eliminated = null;
        for (let [pid, votes] of dayVotes.entries()) {
            if (votes > maxVotes) {
                maxVotes = votes;
                eliminated = players.find(p => p.id === pid);
            } else if (votes === maxVotes) {
                eliminated = null; // ничья
            }
        }
        if (eliminated && maxVotes > 0) {
            eliminated.isAlive = false;
            eliminated.isRevealed = true;
            addLog(`⚖️ ПО ИТОГАМ ГОЛОСОВАНИЯ: ${eliminated.name} (${getRoleName(eliminated.role)}) изгнан из города!`);
        } else {
            addLog(`🤝 Ничья или никто не набрал голосов. Сегодня никто не казнён.`);
        }
        // переход в ночь
        phase = "night";
        document.getElementById("phaseDisplay").innerText = "🌙 НОЧЬ";
        document.getElementById("gamePhasePanel").innerHTML = "🌑 НОЧЬ | Мафия выбирает жертву";
        addLog(`🌙 Город засыпает. Наступает ночь.`);
        nightVotes.clear();
        sheriffTarget = null;
        votedPlayers.clear();
        dayVotes.clear();
        for(let p of players) p.nightActionDone = false;
        currentNightAction = "mafia";
        renderPlayers();
        updateActionButtons();
        checkWinCondition();
        if(gameActive && phase === "night") {
            // если после проверки игра активна — даём кнопки ночи
            updateActionButtons();
        }
    }

    function checkWinCondition() {
        let aliveMafia = players.filter(p => p.isAlive && p.role === ROLES.MAFIA).length;
        let aliveCitizens = players.filter(p => p.isAlive && (p.role === ROLES.CITIZEN || p.role === ROLES.SHERIFF)).length;
        if (aliveMafia === 0) {
            addLog(`🏆 ПОБЕДА МИРНЫХ ЖИТЕЛЕЙ! Мафия уничтожена. 🎉`);
            endGame("Мирные жители победили!");
            return true;
        }
        if (aliveMafia >= aliveCitizens) {
            addLog(`🔪 ПОБЕДА МАФИИ! Они захватили власть.`);
            endGame("Мафия победила!");
            return true;
        }
        return false;
    }

    function endGame(message) {
        gameActive = false;
        phase = "lobby";
        document.getElementById("phaseDisplay").innerText = "Игра завершена";
        document.getElementById("gamePhasePanel").style.display = "none";
        addLog(`🏁 ${message}`);
        for(let p of players) p.isRevealed = true; // показать роли
        renderPlayers();
        enableLobbyControls(true);
        document.getElementById("actionArea").innerHTML = `<button class="primary" id="resetAfterEnd">🔄 Новая игра</button>`;
        const resetBtn = document.getElementById("resetAfterEnd");
        if(resetBtn) resetBtn.onclick = () => resetGame(true);
    }

    function getRoleName(role) {
        if(role === ROLES.MAFIA) return "Мафия";
        if(role === ROLES.SHERIFF) return "Шериф";
        return "Мирный";
    }

    function renderPlayers() {
        const grid = document.getElementById("playersGrid");
        if (!grid) return;
        grid.innerHTML = "";
        for (let p of players) {
            const card = document.createElement("div");
            card.className = `player-card ${selectedPlayerId === p.id ? 'selected' : ''} ${!p.isAlive ? 'role-dead' : ''}`;
            let roleText = "";
            if (!p.isAlive || !gameActive || (phase === "lobby")) {
                if (!p.isAlive || (phase === "lobby")) roleText = p.isAlive ? "?" : `💀 ${getRoleName(p.role)}`;
                else if (gameActive && !p.isAlive) roleText = `💀 ${getRoleName(p.role)}`;
                else roleText = "???";
            } else {
                if(p.role === ROLES.MAFIA && phase === "night" && currentNightAction==="mafia") roleText = "🔪 Мафия (ваша команда)";
                else if(p.role === ROLES.SHERIFF && phase === "night" && currentNightAction==="sheriff") roleText = "👮 Шериф";
                else roleText = "❓ Скрыто";
            }
            const voteCount = dayVotes.get(p.id) || 0;
            card.innerHTML = `
                <div class="player-name">
                    ${p.name} ${!p.isAlive ? '⚰️' : '🟢'}
                </div>
                <div class="player-role ${!p.isAlive ? 'role-dead' : (p.role===ROLES.MAFIA?'role-mafia':(p.role===ROLES.SHERIFF?'role-sheriff':'role-citizen'))}">
                    ${roleText}
                </div>
                <div class="player-status">
                    <span>❤️ ${p.isAlive ? 'Жив' : 'Убит'}</span>
                    ${phase==='day' && p.isAlive ? `<span class="vote-badge">🗳️ голосов: ${voteCount}</span>` : ''}
                </div>
            `;
            card.onclick = (function(player) { return function() { selectPlayerForAction(player.id); }; })(p);
            grid.appendChild(card);
        }
        document.getElementById("playerCount").innerText = players.filter(p=>p.isAlive).length;
    }

    function selectPlayerForAction(playerId) {
        if (!gameActive) return;
        const target = players.find(p=>p.id===playerId);
        if(!target || !target.isAlive) return;
        selectedPlayerId = playerId;
        renderPlayers();
        updateActionButtons();
    }

    function updateActionButtons() {
        const actionDiv = document.getElementById("actionArea");
        if (!actionDiv) return;
        actionDiv.innerHTML = "";
        if (!gameActive) return;
        if (phase === "night") {
            if (currentNightAction === "mafia") {
                const isMafiaAlive = players.some(p=>p.role===ROLES.MAFIA && p.isAlive);
                if(isMafiaAlive && selectedPlayerId !== null) {
                    actionDiv.innerHTML += `<button id="mafiaKillBtn" class="warning">🔪 Убить выбранного (мафия)</button>`;
                    document.getElementById("mafiaKillBtn")?.addEventListener("click", ()=>{
                        if(selectedPlayerId !== null) selectMafiaTarget(selectedPlayerId);
                    });
                } else if(!isMafiaAlive) actionDiv.innerHTML += `<button disabled>Мафия мертва</button>`;
                actionDiv.innerHTML += `<button id="forceNightBtn">🌙 Завершить ночь (если мафия сделала выбор)</button>`;
                document.getElementById("forceNightBtn")?.addEventListener("click", ()=>{
                    if(phase==="night") finishNightPhase();
                });
            } 
            else if (currentNightAction === "sheriff") {
                const sheriff = players.find(p=>p.role===ROLES.SHERIFF && p.isAlive);
                if(sheriff && selectedPlayerId!==null) {
                    actionDiv.innerHTML += `<button id="sheriffCheckBtn" class="primary">🕵️ Проверить выбранного (Шериф)</button>`;
                    document.getElementById("sheriffCheckBtn")?.addEventListener("click", ()=> selectSheriffTarget(selectedPlayerId));
                } else if(!sheriff) finishNightPhase();
            }
        }
        else if (phase === "day") {
            const currentPlayerId = 0; // визуально у нас нет текущего юзера, но каждый может голосовать за выбранного. В браузерной все играют за ведущего. Используем для демо любой живой голосовать может, но эмуляция: при клике голосуем за выбранного "от лица всех". Упростим: любой нажавший голосует за выбранного. Но нужна личность? Реализуем "я голосую" выбирая живого игрока.
            const aliveList = players.filter(p=>p.isAlive);
            if(aliveList.length === 0) return;
            // добавим выбор "голосую за выделенного игрока" от текущего "ведущего" ID. Возьмём первого живого.
            const someVoter = aliveList[0];
            if(selectedPlayerId !== null && !votedPlayers.has(someVoter.id)) {
                actionDiv.innerHTML += `<button id="voteDayBtn" class="primary">🗳️ Проголосовать за выделенного (от ${someVoter.name})</button>`;
                document.getElementById("voteDayBtn")?.addEventListener("click", ()=>{
                    if(phase === "day" && selectedPlayerId !== null && !votedPlayers.has(someVoter.id)){
                        voteForPlayer(someVoter.id, selectedPlayerId);
                    } else { addLog("Нельзя голосовать повторно или фаза не день");}
                });
            }
            actionDiv.innerHTML += `<button id="forceDayEnd">⚖️ Принудительно завершить день (голосование)</button>`;
            document.getElementById("forceDayEnd")?.addEventListener("click", ()=>{
                if(phase === "day") executeElimination();
            });
        }
    }

    // обработчики ui
    document.getElementById("setupGameBtn")?.addEventListener("click", () => {
        if(gameActive) { addLog("Сначала сбросьте игру"); return; }
        let amt = parseInt(document.getElementById("playersAmount").value);
        amt = Math.min(30,Math.max(4,amt));
        players = setupPlayers(amt);
        renderPlayers();
        addLog(`✅ Набрано ${amt} игроков. Готовы стартовать!`);
    });
    document.getElementById("startGameBtn")?.addEventListener("click", startGame);
    document.getElementById("resetGameBtn")?.addEventListener("click", () => resetGame(true));
    
    resetGame(true);
</script>
</body>
</html>
