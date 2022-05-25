// global vars
var board_state =  [["", "", ""],
                    ["", "", ""],
                    ["", "", ""]]

var game

// will be replaced by user object
var user = {
    "uId": 1,
    "username": "blair",
    "wins": 0,
    "losses": 0
}

document.addEventListener("DOMContentLoaded", async function(e) {
    game = JSON.parse(localStorage.getItem('game'));
    console.log("Get game from local")
    console.log(game)
    if (game == null) {
        await gameStartHandshake(user.uId)
    } else {
        await getGame(game.gId)
    }
    rechangeButtons()
    updateTurn()
})

//places shape duhh!
async function placeShape(ele) {
    if (ele.innerHTML == "" && game != null && game.currentPlayer == user.uId) {
        if (game.xPlayer == user.uId) {
            ele.innerHTML = "X"
        } else {
            ele.innerHTML = "O"
        }
        await updateBoardHTML(ele)
    }
}

//updates board when you click a square
async function updateBoardHTML(ele) {
    board_state[ele.getAttribute("data-row")][ele.getAttribute("data-col")] = ele.innerHTML;
    gameWin = checkVictory(ele.getAttribute("data-row"), ele.getAttribute("data-col"));

    await updateDatabase(gameWin)

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
    updateBoardFromArray()
}

//updates other players screen from database 
function updateBoardFromArray() {
    const eles = document.getElementsByClassName("cell")
    let elesArray = eles
    for (let i=0; i<elesArray.length; i++) {
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
async function startGame() {
    let x_player_id = user.uId;
    let o_player_id = document.getElementById("player-name").value;
    board_state =  [["", "", ""],
                    ["", "", ""],
                    ["", "", ""]]
    updateBoardFromArray()

    let newGame = {
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
        body: JSON.stringify(newGame)
    });

    const body = await httpResponse.json();
    
    if (body) {
        game = body
        console.log(game)
        localStorage.setItem('game', JSON.stringify(game));
        
        updateTurn()
        rechangeButtons()
        console.log("Game Started!")
    } else {
        console.log("Game did not start :(")
    }
}

async function gameStartHandshake(player_id){
    const httpResponse = await fetch(`http://localhost:5000/games/users/${player_id}`)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else if(response.status === 404) {
                return Promise.reject('error 404')
            } else {
                return Promise.reject('some other error: ' + response.status)
            }
        })
        .then(body => {
            game = body
            localStorage.setItem('game', JSON.stringify(game));
            console.log(game)
    
            board_string = game.gameState
            buildBoardState(board_string)
        })
        .catch(error => {
            game = null
            localStorage.setItem('game', null);
            console.log('error is', error)
        })
}

async function getGame(gId) {
    const httpResponse = await fetch(`http://localhost:5000/games/${gId}`)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else if(response.status === 404) {
                return Promise.reject('error 404')
            } else {
                return Promise.reject('some other error: ' + response.status)
            }
        })
        .then(body => {
            if (body.isFinished) {
                game = null
                localStorage.setItem('game', null);
            }
            game = body
            localStorage.setItem('game', JSON.stringify(game));
            console.log("Get game from server")
            console.log(game)

            board_string = game.gameState
            buildBoardState(board_string)
        })
        .catch(error => {
            game = null
            localStorage.setItem('game', null);
            console.log('error is', error)
        })
}

// Patches the database after a player places a shape
async function updateDatabase(gameWin){
    const winner = (gameWin) ? game.currentPlayer : null

    if (game.currentPlayer == game.xPlayer) {
        game.currentPlayer = game.oPlayer
    }
    else {
        game.currentPlayer = game.xPlayer
    }

    updateTurn()

    var gameUpdate = {
        "gameState": board_state.toString(),
        "isFinished": gameWin,
        "winner": winner,
        "currentPlayer": game.currentPlayer
    }

    // update end point
    const httpResponse = await fetch(`http://localhost:5000/games/${game.gId}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameUpdate)
    });

    const body = await httpResponse.json();
    console.log(body);

    if (gameWin) {
        game = null
        localStorage.setItem('game', null);
        board_state =  [["", "", ""],
                        ["", "", ""],
                        ["", "", ""]]
        rechangeButtons()
    }
}

function updateTurn() {
    if (game) {
        const yourTurn = game.currentPlayer == user.uId
        document.getElementById("turn").innerHTML = yourTurn ? "Your Turn" : "Opponent's Turn"
    }
}

function rechangeButtons() {
    if (game) {
        document.getElementById("new-game-btn").classList.add("d-none")
        document.getElementById("forfeit-btn").classList.remove("d-none")
    } else {
        document.getElementById("new-game-btn").classList.remove("d-none")
        document.getElementById("forfeit-btn").classList.add("d-none")
    }
}