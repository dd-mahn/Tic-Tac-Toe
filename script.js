//GameBoard
function gameBoard(){
    const rows = 3
    const columns = 3
    const board = []

    for(var i = 0; i< rows; i++){
        board[i] = []
        for(var j = 0; j < columns; j++){
            board[i].push(Cell())
        }
    }

    const getBoard = () => board

    const fillCell = (row,column,playerToken) => {
        board[row][column].addValue(playerToken)
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
        //rows
        for(let i = 0; i< rows; i++)winPattern.push(Array.from({length: columns}, (_,j) => ([i,j])))
        //columns
        for(let i = 0; i< columns; i++)winPattern.push(Array.from({length: rows}, (_,j) => ([j,i])))
        if(rows === columns){
            //diagonal left to right
            winPattern.push(Array.from({length:rows}, (_,i) => ([i,i])))
            //diagonal right to left
            winPattern.push(Array.from({length:rows}, (_,i) => ([i,columns - 1 - i])))
        }
        return winPattern
    }

    const getRandomIndex = () => {
        return [Math.round(Math.random(0,rows)), Math.round(Math.random(0,columns))]
    }

    setDomBoard()
    return {
        getBoard,
        fillCell,
        getRandomIndex,
        generatePattern,
        resetBoard,
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
    let activePlayer = players[0]

    const changePlayerName = (player1, player2) => {
        players[0].name = player1
        players[1].name = player2
    }
 
    const getActivePlayer = () => activePlayer

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
        console.log(winPatterns)

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
            const emptyCells = game_board.printBoard().map((row) => row.map((cell) => cell === ''))
            let count = 0
            let max = 0
            
            for(let row of emptyCells){
                for(let cell of row){
                    max += 1
                    if(cell === false){
                        count += 1
                    }
                }
            }
            if(count === max){
                return 'tie'
            }
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
        let botIndex = game_board.getRandomIndex()
        while(game_board.getBoard()[botIndex[0]][botIndex[1]].getValue()){
            botIndex = game_board.getRandomIndex()
        }
        game_board.fillCell(botIndex[0], botIndex[1], getActivePlayer().playerToken)
        const status = checkWinning()

            if(status !== 'win' && status !== 'tie'){
                switchTurn()
                printNewRound()
        }  
    }
    
    return{
        getBoard: game_board.getBoard,
        resetBoard: game_board.resetBoard,
        changePlayerName,
        playRound,
        botPlayRound,
        checkWinning,
        getActivePlayer
    }
}

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
    const playerRadio = document.querySelectorAll('.mode__input')  
    const player1Input = playerForm.querySelector('#player1')
    const player2Input = playerForm.querySelector('#player2')
    const playerInput = botForm.querySelector('#player')

    const getStatus = () => game.checkWinning()

    let gameStarted = false
    
    const updateScreen = () => {
        if(!gameStarted){
            exitBtn.style.display = 'none'
            restartBtn.style.display = 'none'
            startBtn.style.display = 'block'

            player1Input.value = ''
            player2Input.value = ''
            playerInput.value = ''

            mode__form.style.display = 'flex'
            turnDiv.style.display = 'none'
            boardDiv.style.display = 'none'

            if(checkMode() === 'player'){
                playerForm.style.display = 'flex'
                botForm.style.display = 'none'
            }else{
                playerForm.style.display = 'none'
                botForm.style.display = 'block'
            }
        }else{
            startBtn.style.display = 'none'
            exitBtn.style.display = 'block'
            
            const activePlayer = game.getActivePlayer()
            const board = game.getBoard()
            const status = getStatus()
            boardDiv.textContent = ''
            
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


            }else{
                turnDiv.textContent = `${activePlayer.name}'s turn: ${status}`
                turnDiv.style.color = 'green'
                boardDiv.classList.add('d-off')
                restartBtn.style.display = 'block'
            }
        }
    }

    const checkMode = () => {
        let currentMode = ''
        playerRadio.forEach(radio => {
            if(radio.checked){
                currentMode = radio.value
            }else{
                radio.addEventListener('click', () => {
                    console.log(currentMode)
                    currentMode = radio.value
                    updateScreen()
                })
            }
        })

        return currentMode
    }

    const startGame = () => {
        gameStarted = true
        const currentMode = checkMode()
        if(currentMode === 'player'){
            if(!player1Input.value || !player2Input.value){
                return alert('Please fill all the fields')
            }

            game.changePlayerName(player1Input.value, player2Input.value)
            updateScreen()
        }else if(currentMode === 'bot'){
            if(!playerInput.value){
                return alert('Please fill all the fields')
            }

            game.changePlayerName(playerInput.value, 'bot')
            updateScreen()
        }
    }

    function clickHandlerBoard(e){
        const targetColumn = e.target.dataset.column
        const targetRow = e.target.dataset.row
        const status = getStatus()
        const currentMode = checkMode()

        if(!targetColumn || !targetRow)return

        if(status !== 'win' && status !== 'tie'){
            game.playRound(targetRow, targetColumn)
            updateScreen()
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
        updateScreen()
    }

    startBtn.addEventListener('click', startGame)
    exitBtn.addEventListener('click', exit)
    restartBtn.addEventListener('click', restart)
    boardDiv.addEventListener('click', clickHandlerBoard)
    updateScreen()
}

ScreenController()

/* todo : 
- Bot autoplay
- Style radio
- Clean code */
