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
        if(board[row][column].getValue()){
            console.log('Cannot fill here!')
            return
        }else{
            board[row][column].addValue(playerToken)
        }
    }

    const printBoard = () => {
        const filledBoard = board.map(row => row.map(cell => cell.getValue()))
        return filledBoard
    }

    return {
        getBoard,
        fillCell,
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

    return{
        addValue,
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
        const winPatterns = [
            [[0,0],[0,1],[0,2]],
            [[1,0],[1,1],[1,2]],
            [[2,0],[2,1],[2,2]],
            [[0,0],[1,0],[2,0]],
            [[0,1],[1,1],[2,1]],
            [[0,2],[1,2],[2,2]],
            [[0,0],[1,1],[2,2]],
            [[0,2],[1,1],[2,0]],
        ]

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
        game_board.fillCell(row,col,getActivePlayer().playerToken) 

        const status = checkWinning()

        if(status !== 'win' && status !== 'tie'){
            switchTurn()
            printNewRound()
        }   
    }

    printNewRound()
    
    return{
        getBoard: game_board.getBoard,
        playRound,
        checkWinning,
        getActivePlayer
    }
}

function ScreenController(){
    const game = GameController()
    const turnDiv = document.querySelector('.turn')
    const boardDiv = document.querySelector('.board')

    const getStatus = () => game.checkWinning()
    
    const updateScreen = () => {
        const activePlayer = game.getActivePlayer()
        const board = game.getBoard()
        const status = getStatus()

        boardDiv.textContent = ''
        
        if(status !== 'win' && status !== 'tie'){
            turnDiv.textContent = `${activePlayer.name}'s turn`
            

        }else{
            turnDiv.textContent = `${activePlayer.name}'s turn: ${status}`
            boardDiv.classList.add('d-off')
        }

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

    }

    function clickHandlerBoard(e){
        const targetColumn = e.target.dataset.column
        const targetRow = e.target.dataset.row
        const status = getStatus()

        if(!targetColumn || !targetRow)return

        if(status !== 'win' && status !== 'tie'){
            game.playRound(targetRow, targetColumn)
            updateScreen()
        }else{
            return
        }
        
    }

    boardDiv.addEventListener('click', clickHandlerBoard)
    updateScreen()
}

ScreenController()
