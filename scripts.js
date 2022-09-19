const GameBoardFactory = (board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]) => {
    const getBoard = () => {
        let copy = new Array(3)
        for(let i = 0; i< 3; i++){
            copy[i] = board[i].slice(0)
        }
        return copy
    }
    const setBoardItem = (x, y, value) => {
        if (board[x][y] == null) {
            board[x][y] = value
            return true
        }
        return false
    }
    const boardFull = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == null) return false
            }
        }
        return true
    }
    const resetBoard = () => {
        board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ] 
    }

    const checkWinner = () => {
        let winner = _winnerInARow(board) || _winnerInAColumn(board) || _winnerOnLRDiagonal(board) || _winnerOnRLDiagonal(board)
        if (winner) {
            return winner
        }
        return false
    }

    let _winnerInARow = (board) => {
        for (let i = 0; i < 3; i++) {
            let potentialWinner = board[i][0];
            if (potentialWinner == null) break
            //potentialWinner is not the Winner
            let isNotWinner = false
            for (let j = 1; j < 3; j++) {
                if (board[i][j] != potentialWinner) isNotWinner = true
            }
            if (!isNotWinner) {
                return potentialWinner
            }
        }
        return false
    }

    let _winnerInAColumn = (board) => {
        for (let i = 0; i < 3; i++) {
            let potentialWinner = board[0][i];
            if (potentialWinner == null) break
            let isNotWinner = false
            for (let j = 1; j < 3; j++) {
                if (board[j][i] != potentialWinner) isNotWinner = true
            }
            if (!isNotWinner) {
                return potentialWinner
            }
        }
        return false
    }

    let _winnerOnLRDiagonal = (board) => {
        let potentialWinner = board[0][0]
        if (potentialWinner == null) return false
        let isNotWinner = false
        for (let i = 0; i < 3; i++) {
            if (board[i][i] != potentialWinner) isNotWinner = true
        }
        if (!isNotWinner) {
            return potentialWinner
        }
        return false
    }

    let _winnerOnRLDiagonal = (board) => {
        let potentialWinner = board[0][2]
        if (potentialWinner == null) return false
        let isNotWinner = false
        for (let i = 0; i < 3; i++) {
            if (board[i][2 - i] != potentialWinner) isNotWinner = true
        }
        if (!isNotWinner) {
            return potentialWinner
        }
        return false
    }
    return { setBoardItem, getBoard, boardFull, resetBoard, checkWinner}
}

const GameBoard = GameBoardFactory()

const PlayerFactory = (id, sign, picture) => {
    return { id, sign, picture }
}


const Controller = (() => {
    const player1 = PlayerFactory(0, 'X', `assets/X.jpg`)
    const player2 = PlayerFactory(1, 'O', `assets/O.jpg`)
    let gameWinner = false
    let turn = player1

    const getWinner = () => gameWinner
    const getTurn = () => turn

    const takeTurn = (x, y) => {
        //already a winner?
        if (gameWinner) return false;
        // setting value worked?
        if (GameBoard.setBoardItem(x, y, turn.sign)) {
            gameWinner = GameBoard.checkWinner()
            turn == player1 ? turn = player2 : turn = player1
            return true
        }
        return false
    }

    const restartGame = () => {
        GameBoard.resetBoard()
        gameWinner = null
        turn = player1 
    }

    return { takeTurn, getWinner, getTurn, restartGame }
})()

// an welcher stelle wurde letztens welches symbol hinzugefügt
const nodeFactory = (id, x = null, y = null, symbol = null) => {
    let children = new Array
    let getId = () => id
    let getX = () => x
    let getY = () => y 
    let getSymbol = () => symbol
    let getChildren = () => children
    let addChild = (child) => {
        if(!children.includes(child)) children.push(child)
    }
    let searchIdInChildren = (searchId) =>{
        if(children.length == 0){
            return false
        }
        for(let key in children){
            if(children[key].getId() == searchId){
                return children[key]
            }
        }
        for(let key in children){
            return children[key].searchIdInChildren(searchId)
        }
    }
    return {getId, addChild, getChildren, searchIdInChildren, getX, getY, getSymbol}
}

const minimax = (() => {
    // const rate = (node) => {
    //     let children = parentNode.getChildren()
    //     let sumValue = children.reduce((prev, currChild) => prev + currChild.value, 0)
    //     return sumValue/
    // }
    const maximisingPlayer = 'x'
    const minimisingPlayer = 'o'
    const deepest = 7
    const minimax = (node, depth, isMaximisingPlayer) => {
        //escape
        if(node.getId().checkWinner() == maximisingPlayer){
            return {value: depth, node: node}
        }
        if(node.getId().checkWinner() == minimisingPlayer){
            return {value: -depth, node: node}
        }
        if(node.getId().boardFull()){
            return {value: 0, node: node}
        }

        if(isMaximisingPlayer){
            let value = {value: Number.MIN_SAFE_INTEGER, node: node}
            for(let key in node.getChildren()){
                let childValue = {value : minimax(node.getChildren()[key], depth - 1, false).value, node : node.getChildren()[key]}
                let potentialNode = [value, childValue]
                value = potentialNode.reduce((prev, curr) => prev.value > curr.value ? prev : curr)
            }
            return value
        } else {
            let value = {value: Number.MAX_SAFE_INTEGER, node: node}
            for(let key in node.getChildren()){
                let childValue = {value : minimax(node.getChildren()[key], depth - 1, false).value, node : node.getChildren()[key]}
                let potentialNode = [value, childValue]
                value = potentialNode.reduce((prev, curr) => prev.value < curr.value ? prev : curr)
            }
            return {value: value.value, node: node}
        }
    }

    const buildNode = (board, isMaximisingPlayerNext, x=null, y=null, symbol=null) => {
        const originNode = nodeFactory(board, x, y, symbol)
        const nextPlayer = isMaximisingPlayerNext ? maximisingPlayer : minimisingPlayer
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                const childBoard = GameBoardFactory(board.getBoard())
                if(childBoard.setBoardItem(i, j, nextPlayer)){
                    const childNode = buildNode(childBoard, !isMaximisingPlayerNext, i, j, nextPlayer)
                    originNode.addChild(childNode)
                }
            }
        }
        return originNode
    }

    const algo = () => {
        const orgNode = buildNode(GameBoardFactory([['o', null, null],[null, 'o', null], [null, null, null]]), true)
        return minimax(orgNode, 7, true)
    }
    return {buildNode, minimax, algo}
})()


const displayController = (() => {
    const takeTurnGUI = (e) => {
        const gameStatus = document.querySelector(".game-status")
        const currentPlayer = Controller.getTurn()
        const x = e.target.getAttribute('id_x')
        const y = e.target.getAttribute('id_y')

        if (Controller.takeTurn(x, y)) {
            e.target.style.backgroundImage =`url("${currentPlayer.picture}")`
            if (Controller.getWinner()) {
                gameStatus.innerHTML = `<h2>Player ${Controller.getWinner()} wins</h2>`
            } else {
                (GameBoard.boardFull()) ? gameStatus.innerHTML = `<h2>No one wins</h2>` : gameStatus.textContent = `Player ${Controller.getTurn().sign} is next`
            }
        }
    }

    const setUp = () => {
        const board = document.querySelector(".board")
        board.innerHTML = ""
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let field = document.createElement('div')
                field.setAttribute('id_x', i)
                field.setAttribute('id_y', j)
                field.classList.add('field')
                field.addEventListener('click', takeTurnGUI)
                board.appendChild(field)
            }
        }
        const gameStatus = document.querySelector(".game-status")
        gameStatus.textContent = `Player ${Controller.getTurn().sign} starts`
    }

    const restartGame = () => {
        Controller.restartGame()
        setUp()
    }
    return { setUp, takeTurnGUI, restartGame }
})()

displayController.setUp()