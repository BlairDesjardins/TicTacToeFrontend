board_state =  [["", "", ""],
                ["", "", ""],
                ["", "", ""]]

var name

function placeShape(ele) {
    if (ele.innerHTML == "X") {
        ele.innerHTML = "O"
    } else {
        ele.innerHTML = "X"
    }
    updateBoardHTML(ele)
}

function updateBoardHTML(ele) {
    board_state[ele.getAttribute("data-row")][ele.getAttribute("data-col")] = ele.innerHTML;
    gameWin = checkVictory(ele.getAttribute("data-row"), ele.getAttribute("data-col"));
    console.log(board_state.toString());
    if (gameWin) {
        setTimeout(function() {
            alert(`${ele.innerHTML} has won!`)
        }, 0);
    }
}

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
}

board_state = [['O', '', ''],['X', '', 'X'],['', 'O', '']]
updateBoardFromArray()

function updateBoardFromArray() {
    let eles = document.getElementsByClassName("cell")
    for (let i=0; i<eles.length; i++) {
        console.log(i)
        if (i < 3) {
            eles[i].innerHTML = board_state[0][i]
        } else if (i < 6) {
            eles[i].innerHTML = board_state[1][i-3]
        } else {
            eles[i].innerHTML = board_state[2][i-6]
        }
    }
}

async function startGame(x_player_id, o_player_id) {
    let game = {
        "x_player": x_player_id,
        "o_player": o_player_id,
        "game_state": board_state.toString(),
        "is_finished": false,
        "winner": null
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
        console.log("Game Started!")
    } else {
        console.log("Game did not start :(")
    }
}

