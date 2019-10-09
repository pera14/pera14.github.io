var canvas = document.getElementById("gameTable");
var ctx = canvas.getContext("2d");
var resetButton = document.getElementById('resetButton');
var winCpuIcon = document.getElementById('winCpu');
var winUserIcon = document.getElementById('winUser');
var winText = document.getElementById('pobedioText');
var drawText = document.getElementById('draw');

ctx.clearRect(0, 0, canvas.width, canvas.height);
var radius = 20;
var cellSize = 52
var elements = []
var skipMoves = []
var di = -1;
var dj = -1;
var colors = { 'user': '#ED3542', 'cpu': '#2c7db9' }
var plays = 0
var playerCounter = 0
var rows = []
var currentPlayer = 'user'
var players = ['user', 'cpu']
var cpuLastPlay = -1
var userLastPlay
var userWin = 0;
var cpuWin = 0
var scoreText = document.getElementById("score");
const defect = (window.innerWidth) / 2 - 156
var haveWinner = false
function onMousedown(e) {
    if (!haveWinner) {
        x = e.pageX - defect;
        y = e.pageY;
        di = Math.floor((x - 9) / cellSize);
        if (rows[di] < 6) {
            userLastPlay = di
            dj = 5 - rows[di]
            rows[di]++
            elements = JSON.parse(JSON.stringify(elements))
            var figura = elements[di][dj];
            figura.color = colors[currentPlayer]
            figura.owner = currentPlayer
            elements = JSON.parse(JSON.stringify(elements))
            playerCounter++
            currentPlayer = players[playerCounter % 2]
            
            drawTable().then(
                () => {
                    const winner = checkWinner(elements)
                    if (!winner) {
                        plays++
                        if(plays==36){
                            draw()
                        }
                        cpuPlays()
                    }
                    else {
                        console.log('POBDEDIO JE USER');
                        showWinner('user')
                    }
                })

        }
    }


}

function cpuPlays() {
    var now = new Date()
    var move = findBestMove()
    console.log('Time:', ((new Date()) - now) / 1000);
    cpuLastPlay = move
    dj = 5 - rows[move]
    rows[move]++
    var figura = elements[move][dj];
    figura.color = colors[currentPlayer]
    figura.owner = currentPlayer
    playerCounter++
    currentPlayer = players[playerCounter % 2]
    
    drawTable().then(
        () => {
            const winner = checkWinner(elements)
            if (winner == 'cpu') {
                showWinner('cpu')
            }else{
                plays++
                if(plays==36){
                    draw()
                }
            }

        }
    )
}
function removeUselessSkip() {
    var trtArr = []
    for (var i = 0; i < skipMoves.length; i++) {
        console.log(skipMoves[i][0], cpuLastPlay.toString());

        if (skipMoves[i][0] == cpuLastPlay.toString()) {
            console.log('Proslo');

            trtArr.push(skipMoves[i])
        }

    }
    skipMoves = JSON.parse(JSON.stringify(trtArr))
    // console.log('SkipMoves', skipMoves);

}
function findBestMove() {
    var predictArr = []
    var barepossibleMoves = []
    var barepossibleDepth3Moves = []
    var dangerousMove = {}
    const currSkipArr = skipMoves
    skipMoves = []
    var barePossibleMoves = []
    if (playerCounter == 1) {
        if (di == 3)
            return 2
        return 3
    }
    var singleMoves = [cpuLastPlay]
    if (cpuLastPlay - 1 >= 0)
        singleMoves.push(cpuLastPlay - 1)
    if (cpuLastPlay + 1 <= 5)
        singleMoves.push(cpuLastPlay + 1)
    for (let i = 0; i < 6; i++) {
        if (!singleMoves.includes(i))
            singleMoves.push(i)
    }
    for (let j = 0; j < 6; j++) {
        var i = singleMoves[j]
        if (rows[i] < 6) {
            barepossibleMoves.push(i)
            barepossibleDepth3Moves.push(i)
            barePossibleMoves.push(i)
            let data = {}
            var trtElements = JSON.parse(JSON.stringify(elements))
            var trtRows = JSON.parse(JSON.stringify(rows))
            var trtCurrentPlayer = currentPlayer
            var trtPlayerCounter = parseInt(playerCounter.toString(), 10)
            var dj = 5 - trtRows[i]
            trtRows[i]++
            var figura = trtElements[i][dj];
            // trtPlayerCounter++
            // var trtCurrentPlayer = players[trtPlayerCounter % 2]
            figura.owner = trtCurrentPlayer
            figura.color = colors[trtCurrentPlayer]
            // drawTable();
            data.rows = trtRows
            data.currentPlayer = trtCurrentPlayer
            data.elements = trtElements
            data.moves = [i]
            data.playerCounter = trtPlayerCounter
            data.root = i
            data.depth = 1
            const winner = checkWinner(trtElements)
            if (winner) {
                return i //Nasao resenje
            } else {
                predictArr.push(data)
            }
        }
    }
    var possibleDepth3Moves={}
    for(var i=0;i<barePossibleMoves.length;i++){
        possibleDepth3Moves[barePossibleMoves[i].toString()] = barePossibleMoves[i]
    }
    var returnFound = true
    var loser = -1
    var fasterWin = -1
    var foundWinIn3Moves = false
    var currentDepth = -1
    var possibleMoves = JSON.parse(JSON.stringify(barepossibleMoves))
    while (predictArr.length && returnFound) {
        var currentMove = predictArr.shift()
        // var possibleDepth3Moves = JSON.parse(JSON.stringify(barepossibleDepth3Moves))
        var finisDepth = false
        if (currentMove.depth != currentDepth) {
            currentDepth = currentMove.depth
            finisDepth = true
        }
        if (finisDepth && fasterWin != -1 && currentMove.depth != 3) {

            console.log('fasterWin', i, currentMove.depth, foundWinIn3Moves, fasterWin);
            console.log('DangeousMoves', dangerousMove,possibleMoves);
            const keys = Object.keys(dangerousMove)
            if (keys.length > 0 ) {
                for (var i = 0; i < keys.length; i++) {
                    const key = keys[i]
                    if (dangerousMove[key] > 30 && possibleMoves.includes(parseInt(key))) {
                        console.log('Predustroznost ');
                        return parseInt(key)
                    }
                }
            }
            if(possibleMoves.includes(fasterWin.position)){
                return fasterWin.position
            }
        }
        // if(possibleMoves.length==1){
        //     return possibleMoves[0]
        // }
        // console.log(currentMove.currentPlayer,currentMove.depth);
        if (currentMove.depth == 5) {
            const dj = cpuLastPlay != -1 ? rows[cpuLastPlay] : -1
            console.log('Possible depth 1 length', possibleMoves.length);
            console.log('Possible depth 3 length', possibleDepth3Moves);
            var longestThird = []
            var keys = Object.keys(possibleDepth3Moves)
            for(var i =0;i<keys.length;i++){
                const arr = possibleDepth3Moves[keys[i]]
                if(arr.length > longestThird.length){
                    longestThird = arr
                }
            }
            if (cpuLastPlay != -1 && possibleMoves.includes(cpuLastPlay) && elements[cpuLastPlay][5 - dj].owner == 'cpu' && 6 - dj > 2) {
                returnFound = false
                console.log("Return same");

                return cpuLastPlay
            } else if (longestThird.length > 0) {
                cpuLastPlay = longestThird[Math.floor(Math.random() * longestThird.length)];
                returnFound = false
                console.log('Return  random depth 3', currentMove.depth);
                return cpuLastPlay
            } else if (possibleMoves.length > 1) {
                cpuLastPlay = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                const dj = cpuLastPlay != -1 ? rows[cpuLastPlay] : -1
                if (dj != -1 && elements[cpuLastPlay][5 - dj].owner == 'cpu' && 6 - dj > 2) {
                    returnFound = false
                    console.log('Return random');

                    return cpuLastPlay
                } else {
                    console.log('Return random but changed');
                    const index = possibleMoves.indexOf(cpuLastPlay)
                    cpuLastPlay = possibleMoves[index + 1 % possibleMoves.length];
                    returnFound = false

                    return cpuLastPlay
                }

            } else if (possibleMoves.length == 1) {
                returnFound = false
                console.log('Return length 1');

                return possibleMoves[0]
            } else if (loser != -1) {
                console.log('Returning loser');
                returnFound = false
                return loser.position
            } else {
                cpuLastPlay = barePossibleMoves[Math.floor(Math.random() * barePossibleMoves.length)];
                returnFound = false
                console.log('Return  bare random');
                return cpuLastPlay
            }

        }

        for (var i = 0; i < 6; i++) {
            var data = {}
            var trtElements = JSON.parse(JSON.stringify(currentMove.elements))
            var trtRows = JSON.parse(JSON.stringify(currentMove.rows))
            var trtPlayerCounter = parseInt(currentMove.playerCounter.toString(), 10)
            var trtDepth = parseInt(currentMove.depth.toString(), 10)
            data.moves = JSON.parse(JSON.stringify(currentMove.moves))
            if (trtRows[i] < 6) {
                dj = 5 - trtRows[i]
                trtRows[i]++
                var figura = trtElements[i][dj];
                trtPlayerCounter++
                var trtCurrentPlayer = players[trtPlayerCounter % 2]
                // console.log('Trenutni user: ', trtCurrentPlayer, currentMove.depth);
                
                figura.owner = trtCurrentPlayer
                figura.color = colors[trtCurrentPlayer]
                const winner = checkWinner(trtElements)
                if (winner) {
                    // console.log(winner);
                    if (winner == 'cpu') {
                        //nasao resenje za cpu
                        // console.log('Retur winner position:', currentMove.root,'Depth:',currentMove.depth,'Moves:',currentMove.moves,trtElements);
                        if (fasterWin != -1) {

                            const fj = trtRows[fasterWin.position]
                            const cj = trtRows[currentMove.root]
                            // console.log(fj,cj);

                            if (cj < fj) {
                                fasterWin = { 'position': currentMove.root, 'depth': currentMove.depth }
                            }
                        } else {
                            fasterWin = { 'position': currentMove.root, 'depth': currentMove.depth }
                        }
                    } else { //user winner
                        if (currentMove.depth == 1) {
                            if (i == currentMove.root) {
                                console.log('Nasao je kad ce iz sledeceg poteza biti gubitak',i);

                                for (var tt = 0; tt < possibleMoves.length; tt++) {
                                    if (possibleMoves[tt] == currentMove.root) {
                                        possibleMoves.splice(tt, 1);
                                    }
                                }
                            } else {
                                console.log('Forced');
                                returnFound = false
                                return i
                            }
                        } else if (currentMove.depth == 3) {
                            foundWinIn3Moves = true
                            // dangerousMove = i
                            // console.log('Iz 3. ce izgubiti', i);
                            if(i!=currentMove.root){
                                if (i.toString() in dangerousMove) {
                                    dangerousMove[i]++
                                } else {
                                    dangerousMove[i + ''] = 1;
                                }
                            }
                            for (var tt = 0; tt < possibleDepth3Moves[currentMove.root].length; tt++) {
                                if (possibleDepth3Moves[currentMove.root][tt] == currentMove.root) {
                                    possibleDepth3Moves[currentMove.root].splice(tt, 1);
                                }
                            }
                        }
                    }
                } else {
                    data.rows = trtRows
                    data.currentPlayer = trtCurrentPlayer
                    data.elements = trtElements
                    data.playerCounter = trtPlayerCounter
                    data.root = currentMove.root
                    data.moves.push(i)
                    data.depth = trtDepth + 1
                    predictArr.push(data)
                }
            }
        }
        if (fasterWin != -1 && (currentMove.depth == 3 && !foundWinIn3Moves)) {
            console.log('fasterWin in 3', fasterWin);

            return fasterWin.position
        }
    }

    cpuLastPlay = barePossibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    returnFound = false
    console.log('Return  bare random');
    return cpuLastPlay
}
function showWinner(winner){
    if(winner == 'cpu'){
        winCpuIcon.style.display = "inline-block";
        cpuWin++
    }else{
        userWin++
        winUserIcon.style.display = "inline-block";
    }
    haveWinner=true;
    scoreText.innerHTML = 'User ' + userWin + '-' + cpuWin + ' CPU'
    resetButton.style.display = "block";
    winText.style.display = "inline-block";
}
function draw(){
    resetButton.style.display = "block";
    drawText.style.display = "inline-block";
}

function init() {
    // modalWin.style.display = "block";
    plays = 0
    resetButton.style.display = "none";
    winCpuIcon.style.display = "none";
    winUserIcon.style.display = "none";
    winText.style.display = "none";
    drawText.style.display = "none";
    di = -1;
    dj = -1;
    colors = { 'user': '#ED3542', 'cpu': '#2c7db9' }
    playerCounter = Math.floor(Math.random() * 2); 
    rows = []
    currentPlayer = players[playerCounter]
    // canvas.addEventListener('mousemove', onMousemove, false);
    canvas.addEventListener('mousedown', onMousedown, false);
    drawMatix();
    haveWinner =false
    elements=[]
    for (var i = 0; i < 6; i++) {
        var row = []
        rows[i] = 0;

        for (var j = 0; j < 6; j++) {
            var figura = {}
            figura.owner = 'free'
            figura.color = '#747474'
            row.push(figura)
        }
        elements.push(row)
        row = []
    }
    drawTable();
    if(playerCounter==1){
        cpuPlays()
    }
}
function drawMatix() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    for (var i = 0; i < 7; i++) {
        // ctx.fillStyle = '#000';
        ctx.moveTo(i * cellSize, 0)
        ctx.lineTo(i * cellSize, 6 * cellSize)
        ctx.moveTo(0, i * cellSize)
        ctx.lineTo(6 * cellSize, i * cellSize)
        // ctx.moveTo(50, 50); 
        // ctx.lineTo(450, 50); 
        ctx.strokeStyle = "#666";
        ctx.stroke();
        
    }
    ctx.closePath();
}
async function drawTable() {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            var figura = elements[i][j]
            drawCircle(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, figura.color)
        }
    }
    ctx.fill();
    ctx.closePath();
}
function drawCircle(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}
init();