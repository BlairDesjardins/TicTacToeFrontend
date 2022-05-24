// global vars
var board_state =  [["", "", ""],
                    ["", "", ""],
                    ["", "", ""]]

var currentPlayer
var gId
// will be replaced by user object
var name


//places shape duhh!
function placeShape(ele) {
    if (ele.innerHTML == "X") {
        ele.innerHTML = "O"
    } else {
        ele.innerHTML = "X"
    }
    updateBoardHTML(ele)
}

//updates board when you click a square
function updateBoardHTML(ele) {
    board_state[ele.getAttribute("data-row")][ele.getAttribute("data-col")] = ele.innerHTML;
    gameWin = checkVictory(ele.getAttribute("data-row"), ele.getAttribute("data-col"));

    updateDatabase(gameWin)
    console.log(board_state.toString());
    if (gameWin) {
        setTimeout(function() {
            alert(`${ele.innerHTML} has won!`)
        }, 0);
    }
}

//checks if you win
function checkVictory(row, col) {
    if (board_state[row][0] == board_state[row][1] && board_state[row][1] == board_state[row][2]) {
        return true;
    }
    else if (board_state[0][col] == board_state[1][col] && board_state[1][col] == board_state[2][col]) {
        return true;
    }

    if (board_state[1][1] != "") {
        if (board_state[0][0] == board_state[1][1] && board_state[1][1] == board_state[2][2]) {
            return true;
        }
        else if (board_state[0][2] == board_state[1][1] && board_state[1][1] == board_state[2][0]) {
            return true;
        }
    }
    return false;
}

//creates matrix from a string
function buildBoardState(board_string) {
    let arr1 = board_string.split(",");
    for (let i=0; i<arr1.length; i++) {
        // index of x is 0, 1, 2 - append to first row
        // 3, 4, 5 - 2nd row
        // 6, 7, 8 - 3rd row
        if (i < 3) {
            board_state[0][i] = arr1[i]
        } else if (i < 6) {
            board_state[1][i-3] = arr1[i]
        } else {
            board_state[2][i-6] = arr1[i]
        }
    }
    console.log(board_state)
    document.addEventListener("DOMContentLoaded", function(e) {updateBoardFromArray()})
}

// board_state = [['O', '', ''],['X', '', 'X'],['', 'O', '']]


//updates other players screen from database 
function updateBoardFromArray() {
    const eles = document.getElementsByClassName("cell")
    let elesArray = eles
    for (let i=0; i<elesArray.length; i++) {
        console.log(i)
        if (i < 3) {
            elesArray[i].innerHTML = board_state[0][i]
        } else if (i < 6) {
            elesArray[i].innerHTML = board_state[1][i-3]
        } else {
            elesArray[i].innerHTML = board_state[2][i-6]
        }
    }
}

//starts game by posting to server
async function startGame(x_player_id, o_player_id) {
    let game = {
        "xPlayer": x_player_id,
        "oPlayer": o_player_id,
        "gameState": board_state.toString(),
        "isFinished": false,
        "winner": null,
        "currentPlayer": x_player_id
    }

    const httpResponse = await fetch(`http://localhost:5000/games`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
    });

    const body = await httpResponse.json();
    console.log(body);
    if (body) {
        body.gID
        console.log("Game Started!")
    } else {
        console.log("Game did not start :(")
    }
}

async function gameStartHandshake(o_player_id){
    const httpResponse = await fetch(`http://localhost:5000/games/users/${o_player_id}`);

    const body = await httpResponse.json();
    console.log(body);

    if (body) {
        board_string = body.gameState
        currentPlayer = body.currentPlayer
        buildBoardState(board_string)
    } else {
        console.log("Failed to update")
    }
}

async function getGame(gID) {
    const httpResponse = await fetch(`http://localhost:5000/games/${gID}`);

    const body = await httpResponse.json();
    console.log(body);

    if (body) {
        board_string = body.gameState
        currentPlayer = body.currentPlayer
        buildBoardState(board_string)
    } else {
        console.log("Failed to update")
    }
}

// Patches the database after a player places a shape
async function updateDatabase(gameWin){
    const winner = (gameWin) ? currentPlayer : null

    if (currentPlayer = x_player_id){
        currentPlayer = o_player_id
    }
    else{
        currentPlayer = x_player_id
    }

    let game = {
        "gameState": board_state.toString(),
        "isFinished": gameWin,
        "winner": null,
        "currentPlayer": currentPlayer
    }

// update end point
    const httpResponse = await fetch(`http://localhost:5000/games`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(game)
    });

    const body = await httpResponse.json();
    console.log(body); 
}