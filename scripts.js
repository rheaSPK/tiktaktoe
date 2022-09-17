const GameBoard = (() => {
    let board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]
    const getBoard = () => board
    const setBoardItem = (x, y, value) => {
        if (board[x][y] === null){
            board[x][y] = value
            return true
        }
        return false
    }
    return {setBoardItem, getBoard}
})()

/*
controller
- player registrieren
- takeTurn(position)
- isWinner?
let board = [
        [2, null, null],
        [null, null, 4],
        [null, 3, null]
    ]
*/
const PlayerFactory = (id, sign) => {
    return {id, sign}
}


let Controller = (() => {
    const player1 = PlayerFactory(0, 'X')
    const player2 = PlayerFactory(1, 'O')

    let gameWinner = null
    let turn = player1

    const checkWinner = () => {
        let board = GameBoard.getBoard()
        let winner = _winnerInARow(board) || _winnerInAColumn(board) || _winnerOnLRDiagonal(board) || _winnerOnRLDiagonal(board)
        if(winner) {
            gameWinner = winner
            return true
        }
        return false
    }

    let _winnerInARow = (board) => {
        for(let i = 0; i < 3; i++){
            let potentialWinner = board[i][0];
            if (potentialWinner == null) break
            //potentialWinner is not the Winner
            let isNotWinner = false
            for(let j = 1; j < 3; j++){
                if(board[i][j] != potentialWinner) isNotWinner = true
            }
            if(!isNotWinner){
                return potentialWinner
            }
        }
        return false
    }

    let _winnerInAColumn = (board) => {
        for(let i = 0; i < 3; i++){
            let potentialWinner = board[0][i];
            if (potentialWinner == null) break
            let isNotWinner = false 
            for(let j = 1; j < 3; j++){
                if(board[j][i] != potentialWinner) isNotWinner = true
            }
            if(!isNotWinner){
                return potentialWinner
            }
        }
        return false
    }

    let _winnerOnLRDiagonal = (board) => {
        let potentialWinner = board[0][0]
        if(potentialWinner == null) return false
        let isNotWinner = false
        for(let i = 0; i < 3; i++){
            if(board[i][i] != potentialWinner) isNotWinner = true
        }
        if(!isNotWinner){
            return potentialWinner
        }
        return false
    }

    let _winnerOnRLDiagonal = (board) => {
        let potentialWinner = board[0][2]
        if(potentialWinner == null) return false
        let isNotWinner = false
        for(let i = 0; i < 3; i++){
            if(board[i][2 - i] != potentialWinner) isNotWinner = true
        }
        if(!isNotWinner){
            return potentialWinner
        }
        return false
    }

    const takeTurn = (x, y) => {
        //already a winner?
        if(gameWinner != null) return false;
        // setting value worked?
        if(GameBoard.setBoardItem(x, y, turn.sign)){
            checkWinner()
            turn == player1 ? turn = player2 : turn = player1
            return true
        }
        return false
    }

    return {takeTurn, checkWinner, gameWinner}
})()


function setUpGUI(){
    const board = document.querySelector(".board")
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            let field = document.createElement('div')
            field.setAttribute('id_x', i)
            field.setAttribute('id_y', j)
            field.classList.add('field')
            field.addEventListener('click', takeTurnGUI)
            board.appendChild(field)
        }
    }
}

function takeTurnGUI(){
    Controller.takeTurn()
}

setUpGUI()