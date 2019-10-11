var resetButton = document.getElementById('resetButton');
var winCpuIcon = document.getElementById('winCpu');
var winPlayerIcon = document.getElementById('winPlayer');
var winText = document.getElementById('winText');
var drawText = document.getElementById('draw');
var playerScore = document.getElementById("playerScore");
var cpuScore = document.getElementById("cpuScore");
document.documentElement.addEventListener('mousedown', onMousedown, false);


var elements = []
var skipMoves = []
var di = -1;
var dj = -1;
var colors = { 'player': '#ED3542', 'cpu': '#2c7db9' }
const freeColor = '#747474'
var plays = 0
var playerCounter = 0
var rows = []
var currentPlayer = 'player'
var players = ['player', 'cpu']
var cpuLastPlay = -1
var playerWin = 0;
var cpuWin = 0

const defect = (window.innerWidth) / 2 - 156
var haveWinner = false
var falling = false
function onMousedown(e) {
    const id =e.target.id 
    if (!haveWinner && id && !falling) {
        x = id[1];
        y = id[0];
        if (rows[x] < 6) {
            dj = 5 - rows[x]
            rows[x]++
            di = x
            var figura = elements[x][dj];
            figura.color = colors[currentPlayer]
            figura.owner = currentPlayer
            playerCounter++
            currentPlayer = players[playerCounter % 2]
            drawChange(x,dj,figura.color,() => {
                    var ret = checkWinner(elements)
                    var winner = ret['owner']
                    var winArr = ret['winArr']
                    if (!winner) {
                        plays++
                        if(plays==36){
                            draw()
                        }else{
                            cpuPlays()
                        }
                    }
                    else {
                        showWinner('player',winArr)
                    }
                })
        }
    }
}


function drawChange(i,j,color,callBack){
    falling = true
    showFalling(i,0,color,j,callBack)
}

function showFalling(i,j,color,stop,callBack){
    var interval = setInterval(function() {
        if(j==0){
            changeColor(i,j,color)
        }
        else if(j <=stop){
            changeColor(i,j-1,freeColor)
            changeColor(i,j,color)
        }else{
            falling = false
            callBack()
            clearInterval(interval)
        }
        j++;

     }, 1000/12);
}
function cpuPlays() {
    var now = new Date()
    var move = findBestMove()
    cpuLastPlay = move
    dj = 5 - rows[move]
    rows[move]++
    var figura = elements[move][dj];
    figura.color = colors[currentPlayer]
    figura.owner = currentPlayer
    playerCounter++
    currentPlayer = players[playerCounter % 2]
    drawChange(move,dj,figura.color,() => {
            var ret = checkWinner(elements)
            var winner = ret['owner']
            var winArr = ret['winArr']
            if (winner == 'cpu') {
                showWinner('cpu',winArr)
            }else{
                plays++
                if(plays==36){
                    draw()
                }
            }
        }
    )
}
function findBestMove() {
    var predictArr = []
    var barepossibleMoves = []
    var barepossibleDepth3Moves = []
    var dangerousMove = {}
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
            figura.owner = trtCurrentPlayer
            figura.color = colors[trtCurrentPlayer]
            data.rows = trtRows
            data.currentPlayer = trtCurrentPlayer
            data.elements = trtElements
            data.moves = [i]
            data.playerCounter = trtPlayerCounter
            data.root = i
            data.depth = 1
            var ret = checkWinner(trtElements)
            var winner = ret['owner']
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
    var fasterWin = -1
    var foundWinIn3Moves = false
    var currentDepth = -1
    var possibleMoves = JSON.parse(JSON.stringify(barepossibleMoves))
    var disabledMoves= []
    while (predictArr.length && returnFound) {
        var currentMove = predictArr.shift()
        var finisDepth = false
        if (currentMove.depth != currentDepth) {
            currentDepth = currentMove.depth
            finisDepth = true
        }
        if (finisDepth && fasterWin != -1 && currentMove.depth != 3) {
            const keys = Object.keys(dangerousMove)
            if (keys.length > 0 ) {
                var max = -1
                var value = -1
                for (var i = 0; i < keys.length; i++) {
                    const key = keys[i]
                    if (dangerousMove[key] > 29 && dangerousMove[key]>max && !disabledMoves.includes(parseInt(key))) { //Predustroznost
                        max = dangerousMove[key]
                        value = parseInt(key)
                    }
                }
                if(value != -1)
                    return value
            }
            if(possibleMoves.includes(fasterWin.position)){
                return fasterWin.position
            }
        }
        if (currentMove.depth == 5) {
            const dj = cpuLastPlay != -1 ? rows[cpuLastPlay] : -1
            var longestThird = []
            var keys = Object.keys(possibleDepth3Moves)
            for(var i =0;i<keys.length;i++){
                const arr = possibleDepth3Moves[keys[i]]
                if(arr.length > longestThird.length){
                    longestThird = arr
                }
            }
            if (cpuLastPlay != -1 && possibleMoves.includes(cpuLastPlay) && elements[cpuLastPlay][5 - dj].owner == 'cpu' && 6 - dj > 2) { //Vraca isto kao prosli potez
                returnFound = false
                return cpuLastPlay
            } else if (longestThird.length > 0) { // Vraca random od poteza koji nece izgubiti u 2. potezu
                cpuLastPlay = longestThird[Math.floor(Math.random() * (longestThird.length-1))]; 
                returnFound = false
                return cpuLastPlay
            } else if (possibleMoves.length > 1) { // Return random
                cpuLastPlay = possibleMoves[Math.floor(Math.random() * (possibleMoves.length-1))];
                const dj = cpuLastPlay != -1 ? rows[cpuLastPlay] : -1
                if (dj != -1 && elements[cpuLastPlay][5 - dj].owner == 'cpu' && 6 - dj > 2) {
                    returnFound = false
                    return cpuLastPlay
                } else { // Return random
                    const index = possibleMoves.indexOf(cpuLastPlay)
                    cpuLastPlay = possibleMoves[(index + 1) % possibleMoves.length];
                    returnFound = false

                    return cpuLastPlay
                }

            } else if (possibleMoves.length == 1) {
                returnFound = false
                return possibleMoves[0]
            } else { //Return bas random random
                cpuLastPlay = barePossibleMoves[Math.floor(Math.random() * (barePossibleMoves.length-1))];
                returnFound = false
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
                figura.owner = trtCurrentPlayer
                figura.color = colors[trtCurrentPlayer]
                var ret = checkWinner(trtElements)
                var winner = ret['owner']
                if (winner) {
                    if (winner == 'cpu') {
                        //nasao resenje za cpu
                        if (fasterWin != -1) {
                            const fj = trtRows[fasterWin.position]
                            const cj = trtRows[currentMove.root]
                            if (cj < fj) {
                                fasterWin = { 'position': currentMove.root, 'depth': currentMove.depth }
                            }
                        } else {
                            fasterWin = { 'position': currentMove.root, 'depth': currentMove.depth }
                        }
                    } else { //user winner
                        if (currentMove.depth == 1) {
                            if (i == currentMove.root) {
                                for (var tt = 0; tt < possibleMoves.length; tt++) {
                                    if (possibleMoves[tt] == currentMove.root) {
                                        possibleMoves.splice(tt, 1);
                                    }
                                }
                                disabledMoves.push(i)
                            } else {
                                returnFound = false
                                return i
                            }
                        } else if (currentMove.depth == 3) {
                            foundWinIn3Moves = true
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
        if (fasterWin != -1 && (currentMove.depth == 4 && !foundWinIn3Moves)) {
            return fasterWin.position
        }
    }
    const random = Math.random()
    cpuLastPlay = barePossibleMoves[Math.floor(random * (barePossibleMoves.length-1))];
    returnFound = false
    return cpuLastPlay
}

function showWinner(winner,winArr){
    for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
            var figura = elements[i][j]
            figura.id.style.opacity=0.4
        }
    }
    for(var i =0;i<winArr.length;i++){
        document.getElementById(winArr[i]).style.opacity = 1
    }
    if(winner == 'cpu'){
        winCpuIcon.style.display = "inline-block";
        cpuWin++
        cpuScore.innerHTML = ''+cpuWin
    }else{
        playerWin++
        winPlayerIcon.style.display = "inline-block";
        playerScore.innerHTML = ''+playerWin
    }
    haveWinner=true;
    resetButton.style.display = "block";
    winText.style.display = "inline-block";
}
function draw(){
    resetButton.style.display = "block";
    drawText.style.display = "inline-block";
}

function init() {
    plays = 0
    resetButton.style.display = "none";
    winCpuIcon.style.display = "none";
    winPlayerIcon.style.display = "none";
    winText.style.display = "none";
    drawText.style.display = "none";
    di = -1;
    dj = -1;
    playerCounter = Math.floor(Math.random() * 2); 
    rows = []
    currentPlayer = players[playerCounter]
    
    haveWinner =false
    elements=[]
    for (var i = 0; i < 6; i++) {
        var row = []
        rows[i] = 0;
        for (var j = 0; j < 6; j++) {
            var figura = {}
            figura.owner = 'free'
            figura.color = freeColor
            figura.id = document.getElementById(''+j+i);
            figura.id.style.backgroundColor=freeColor
            figura.id.style.opacity=1
            row.push(figura)
        }
        elements.push(row)
        row = []
    }
    if(playerCounter==1){
        cpuPlays()
    }
}
function changeColor(i,j,color){
    var figura = elements[i][j]
    figura.id.style.backgroundColor = color
}
init();