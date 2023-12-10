//GameBoard object

function gameBoard(){
    const rows = 3
    const columns = 3
    const board = []

    //Create 2d array that store cells 
    for(var i = 0; i< rows; i++){
        board[i] = []
        for(var j = 0; j < columns; j++){
            board[i].push(Cell())
        }
    }

    //Function to get the board, for UI rendering
    const getBoard = () => board

    //Function to fill cells
    const fillCell = (row,column,playerToken) => {
        //Check if targeted cell is available
        if(board[row][column].getValue() !== ''){
            console.log('Cannot fill here!')
            return
        }else{
            board[row][column].addValue(playerToken)
        }
    }

    //Function to print the board
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

//Define cell to store value of the game
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
    const board = gameBoard()
    //Player storage
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

    //Active player 
    let activePlayer = players[0]

    //Function to get active player
    const getActivePlayer = () => activePlayer

    //Function to switch turn
    const switchTurn = () =>{
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }

    //Function to print new round
    const printNewRound = () =>{
        board.printBoard()
        console.log(`${getActivePlayer().name}'s turn`)
    }

    //Function to check winning or tie
    const checkWinning = () => {
        // const winPattern = [
        //     [[0,0],[0,1],[0,2]],
        //     [[1,0],[1,1],[1,2]],
        //     [[2,0],[2,1],[2,2]],
        //     [[0,0],[1,0],[2,0]],
        //     [[0,1],[1,1],[2,1]],
        //     [[0,2],[1,2],[2,2]],
        //     [[0,0],[1,1],[2,2]],
        //     [[0,2],[1,1],[2,0]],
        // ]
        if(
            board.getBoard()[0][0].getValue() === board.getBoard()[0][1].getValue() === board.getBoard()[0][2].getValue() !== ''
            ||
            board.getBoard()[1][0].getValue() === board.getBoard()[1][1].getValue() === board.getBoard()[1][2].getValue() !== ''
            ||
            board.getBoard()[2][0].getValue() === board.getBoard()[2][1].getValue() === board.getBoard()[2][2].getValue() !== ''
            ||
            board.getBoard()[0][0].getValue() === board.getBoard()[1][0].getValue() === board.getBoard()[2][0].getValue() !== ''
            ||
            board.getBoard()[0][1].getValue() === board.getBoard()[1][1].getValue() === board.getBoard()[2][1].getValue() !== ''
            ||
            board.getBoard()[0][2].getValue() === board.getBoard()[1][2].getValue() === board.getBoard()[2][2].getValue() !== ''
            ||
            board.getBoard()[0][0].getValue() === board.getBoard()[1][1].getValue() === board.getBoard()[2][2].getValue() !== ''
            ||
            board.getBoard()[0][2].getValue() === board.getBoard()[1][1].getValue() === board.getBoard()[2][0].getValue() !== ''    
        ){
            return 'win'
        }else{
            return 'unknown'
        }
    }

    //Function to play a round
    const playRound = (row, col) => {
        console.log(`${getActivePlayer().name} is filling selected cell...`)
        board.fillCell(row,col,getActivePlayer().playerToken)

        //check winning
        const status = checkWinning()
        console.log(status)
        if(status === 'win'){
            console.log(`${getActivePlayer.name} won the game!`)
        }else{
            //get empty cells to check tie
            const emptyCells = board.getBoard().map((row) => row.map((cell) => cell.getValue() === '')) 
            if(emptyCells.length === 0){
                console.log('Its a tie!')
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