//GameBoard
function gameBoard(){
    const rows = 3
    const columns = 3
    const board = []

    for(let i = 0; i< rows; i++){
        board[i] = []
        for(let j = 0; j < columns; j++){
            board[i].push(Cell())
        }
    }

    const getBoard = () => board

    const fillCell = (row,column,playerToken) => {
        board[row][column].addValue(playerToken)
    }

    function checkEmpty(){
        let emptyCount = 0;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j].getValue() === '') {
                    emptyCount++;
                }
            }
        }

        return emptyCount;
    }

    const resetBoard = () => {
        for(var i = 0; i< rows; i++){
            for(var j = 0; j < columns; j++){
                board[i][j].resetValue()
            }
        }
    }

    const printBoard = () => {
        const filledBoard = board.map(row => row.map(cell => cell.getValue()))
        return filledBoard
    }

    function setDomBoard(){
        const boardDiv = document.querySelector('.board')
        boardDiv.style.gridTemplateRows = `repeat(${rows},1fr)`
        boardDiv.style.gridTemplateColumns = `repeat(${columns},1fr)`
    }

    function generatePattern(){
        const winPattern = []
        for(let i = 0; i< rows; i++)winPattern.push(Array.from({length: columns}, (_,j) => ([i,j])))
        for(let i = 0; i< columns; i++)winPattern.push(Array.from({length: rows}, (_,j) => ([j,i])))
        if(rows === columns){
            winPattern.push(Array.from({length:rows}, (_,i) => ([i,i])))
            winPattern.push(Array.from({length:rows}, (_,i) => ([i,columns - 1 - i])))
        }
        return winPattern
    }

    setDomBoard()
    return {
        getBoard,
        fillCell,
        generatePattern,
        resetBoard,
        checkEmpty,
        printBoard
    }
}
//Cell
function Cell(){
    let value = ''

    const addValue = (playerToken) => {
        value = playerToken
    }

    const getValue = () => value

    const resetValue = () => value = ''

    return{
        addValue,
        resetValue,
        getValue
    }
}
//GameController 
function GameController(
    playerOneName = 'Player1',
    playerTwoName = 'Player2'
){
    const game_board = gameBoard()

    const players = [
        {
            name: playerOneName,
            playerToken: 'x',
            score: 0
        },
        {
            name: playerTwoName,
            playerToken: 'o',
            score: 0
        }
    ]

    const changePlayerName = (player1, player2) => {
        players[0].name = player1
        players[1].name = player2
    }

    let activePlayer = players[0]
 
    const getActivePlayer = () => activePlayer

    const resetActivePlayer = () => activePlayer = players[0]

    const switchTurn = () =>{
        activePlayer = ( activePlayer === players[0] ? players[1] : players[0])
    }

    const printNewRound = () =>{
        game_board.getBoard()
        console.log(`${getActivePlayer().name}'s turn...`)
    }

    const checkWinning = () => {
        const status = []
        const board = game_board.printBoard()

        const winPatterns = game_board.generatePattern()

        for(const pattern of winPatterns){
            const [a, b, c] = pattern
            if(
                board[a[0]][a[1]] === getActivePlayer().playerToken 
                &&
                board[c[0]][c[1]] === getActivePlayer().playerToken  
                &&
                board[b[0]][b[1]] === getActivePlayer().playerToken  
            ){
                status.push('win')
                break
            }else{
                status.push('unknown')
            }
        }

        if(status[status.length-1] === 'win'){
            return 'win'
        }else if(status[status.length-1] !== 'win'){
            if(game_board.checkEmpty() === 0)return 'tie'
        }
        else{
            return 'unknown'
        }
    }

    const playRound = (row, col) => {
        if(game_board.getBoard()[row][col].getValue()){
            return
        }else{
            game_board.fillCell(row,col,getActivePlayer().playerToken) 

            const status = checkWinning()

            if(status !== 'win' && status !== 'tie'){
                switchTurn()
                printNewRound()
            }  
        } 
    }

    const botPlayRound = () => {

        const winPattern = game_board.generatePattern()
        const rows = game_board.getBoard().length
        const columns = game_board.getBoard()[0].length
        const board = game_board.getBoard()

        function findEmpty(pattern){
            for(const [row,col] of pattern){
                if(board[row][col].getValue() === '')return {row,col}            }
        }
        
        function checkOpponent(pattern){
            let cellsValue = pattern.map(([row,col]) => board[row][col].getValue())
            const opponentChance = cellsValue.filter(value => value === 'x')
            if(opponentChance.length === 2 && cellsValue.includes('')){return findEmpty(pattern)}else return null
        }
        
        function checkSelf(pattern){
            let cellsValue = pattern.map(([row,col]) => board[row][col].getValue())
            const myChance = cellsValue.filter(value => value === 'o')
            if(myChance.length === 2 && cellsValue.includes('')){return findEmpty(pattern)}else return null
        }
        
        function playSmart(){
            const row = Math.floor(rows/2)
            const col = Math.floor(columns/2)

            if(board[row][col].getValue() === ''){
                return {row,col}
            }else return null
        }
        
        function playRandom(){
            for(let row = 0; row < rows; row++){
                for(let col = 0; col < columns; col++){
                    if(board[row][col].getValue() === '')return {row,col}
                }
            }
        }
        
        function playRound(){
            let chosenMove = null

            for(const pattern of winPattern){
                const opponent = checkOpponent(pattern)
                const self = checkSelf(pattern)
                const smart = playSmart()
                const random = playRandom()
            
                if(self !== null && self !== undefined){
                    chosenMove = self
                    break
                }else{
                    if(opponent !== null && opponent !== undefined){
                        chosenMove = opponent
                        break
                    }else{
                        if(smart !== null){
                            chosenMove = smart
                        }else{
                            chosenMove = random
                        }
                    }
                }
            }

            if(chosenMove !== null && chosenMove !== undefined)return game_board.fillCell(chosenMove.row, chosenMove.col, getActivePlayer().playerToken)
        }

        playRound()
        const status = checkWinning()
        if(status !== 'win' && status !== 'tie'){
            printNewRound()
            switchTurn()
        } 
    }

    return{
        getBoard: game_board.getBoard,
        resetBoard: game_board.resetBoard,
        checkEmpty: game_board.checkEmpty,
        changePlayerName,
        playRound,
        botPlayRound,
        checkWinning,
        getActivePlayer,
        resetActivePlayer
    }
}
//ScreenController
function ScreenController(){
    const game = GameController()
    const turnDiv = document.querySelector('.turn')
    const boardDiv = document.querySelector('.board')
    const restartBtn = document.querySelector('.restart__btn')
    const startBtn = document.querySelector('.start__btn')
    const exitBtn = document.querySelector('.exit__btn')
    const mode__form = document.querySelector('.mode__form')
    const playerForm = document.querySelector('.mode__player')
    const botForm = document.querySelector('.mode__bot')
    const modeRadio = document.querySelectorAll('.mode__input') 
    const playerLabel = document.querySelector('.mode__lbl-1')
    const botLabel = document.querySelector('.mode__lbl-2')
    const player1Input = playerForm.querySelector('#player1')
    const player2Input = playerForm.querySelector('#player2')
    const playerInput = botForm.querySelector('#player')

    const getStatus = () => game.checkWinning()

    let gameStarted = false
    
    const updateScreen = () => {
        if(!gameStarted){
            player1Input.value = ''
            player2Input.value = ''
            playerInput.value = ''

            exitBtn.style.display = 'none'
            restartBtn.style.display = 'none'
            startBtn.style.display = 'block'
            mode__form.style.display = 'flex'
            turnDiv.style.display = 'none'
            boardDiv.style.display = 'none'


            if(checkMode() === 'player'){
                playerForm.style.display = 'flex'
                botForm.style.display = 'none'
                playerLabel.classList.add('checked')
                botLabel.classList.remove('checked')

            }else{
                playerForm.style.display = 'none'
                botForm.style.display = 'block'
                botLabel.classList.add('checked')
                playerLabel.classList.remove('checked')

            }
        }else{
            const activePlayer = game.getActivePlayer()
            const board = game.getBoard()
            const status = getStatus()

            boardDiv.textContent = ''
            
            startBtn.style.display = 'none'
            exitBtn.style.display = 'block'
            mode__form.style.display = 'none'
            turnDiv.style.display = 'block'
            boardDiv.style.display = 'grid'

            board.forEach((row,rowIndex) => {
                row.forEach((cell,index) => {
                    const cellBtn = document.createElement('button')
                    cellBtn.classList.add('cell')
                    cellBtn.dataset.column = index
                    cellBtn.dataset.row = rowIndex
                    cellBtn.textContent = cell.getValue()
                    boardDiv.appendChild(cellBtn)
                })
            })    

            if(status !== 'win' && status !== 'tie'){
                turnDiv.textContent = `${activePlayer.name}'s turn`
                turnDiv.style.color = 'var(--text-color)'
                boardDiv.classList.remove('d-off')
                turnDiv.classList.remove('result')

            }else{
                turnDiv.classList.add('result')
                if(status === 'win'){
                    turnDiv.textContent = `${activePlayer.name} won the game!`
                    turnDiv.style.color = 'var(--win-color)'
                    boardDiv.classList.add('d-off')
                    restartBtn.style.display = 'block'
                }else{
                    turnDiv.textContent = `It's a tie!`
                    turnDiv.style.color = 'var(--board-color)'
                    boardDiv.classList.add('d-off')
                    restartBtn.style.display = 'block'
                }
            }
        }
    }

    const checkMode = () => {
        let currentMode = ''
        modeRadio.forEach(radio => {
            if(radio.checked){
                currentMode = radio.value
            }else{
                radio.addEventListener('click', () => {
                    currentMode = radio.value
                    updateScreen()
                })
            }
        })

        return currentMode
    }

    const startGame = () => {
        const currentMode = checkMode()
        if(currentMode === 'player'){
            if(!player1Input.value || !player2Input.value){
                return alert('Please fill all the fields')
            }
            
            gameStarted = true
            game.changePlayerName(player1Input.value, player2Input.value)
            updateScreen()
        }else if(currentMode === 'bot'){
            if(!playerInput.value){
                return alert('Please fill all the fields')
            }

            gameStarted = true
            game.changePlayerName(playerInput.value, 'bot')
            updateScreen()
        }
    }

    function clickHandlerBoard(e){
        const targetColumn = e.target.dataset.column
        const targetRow = e.target.dataset.row
        const status = getStatus()
        const currentMode = checkMode()

        function botPLay(){
            game.botPlayRound()
            updateScreen()
        }

        if(!targetColumn || !targetRow)return

        if(status !== 'win' && status !== 'tie'){
            if(currentMode === 'player'){
                game.playRound(targetRow, targetColumn)
                updateScreen()
            }else if(currentMode === 'bot' && game.getActivePlayer().playerToken === 'x'){
                if(game.getBoard()[targetRow][targetColumn].getValue() === ''){
                    game.playRound(targetRow, targetColumn)
                    updateScreen()
                    const newStatus = getStatus()

                    if(game.checkEmpty() !== 0 && newStatus !== 'win'){
                        const botPlay = setTimeout(botPLay, 1000)
                    }
                }
                else return
            }
        }else{
            return
        }
    }

    function exit(){
        gameStarted = false
        game.resetBoard()
        updateScreen()
    }

    function restart(){
        game.resetBoard()
        game.resetActivePlayer()
        gameStarted = true
        updateScreen()
    }

    startBtn.addEventListener('click', startGame)
    exitBtn.addEventListener('click', exit)
    restartBtn.addEventListener('click', restart)
    boardDiv.addEventListener('click', clickHandlerBoard)
    updateScreen()
}

ScreenController()