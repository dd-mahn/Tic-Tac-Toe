
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
        console.log(game_board.printBoard())
        console.log(`${getActivePlayer().name}'s turn`)
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

        return status
    }

    const playRound = (row, col) => {
        console.log(`${getActivePlayer().name} is filling selected cell...`)
        game_board.fillCell(row,col,getActivePlayer().playerToken)

        const status = checkWinning()
        if(status[status.length-1] === 'win'){
            console.log(`${getActivePlayer().name} won the game!`)
        }else{
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
                console.log('Tie!')
                return
            }else{
                switchTurn()
                printNewRound()
            }
        }
    }

    printNewRound()
    
    return{
        playRound,
        getActivePlayer
    }
}

const game = GameController()

