board_state =  [["", "", ""],
                ["", "", ""],
                ["", "", ""]]


function placeShape(ele) {
    if (ele.innerHTML == "X") {
        ele.innerHTML = "O"
    } else {
        ele.innerHTML = "X"
    }
    updateBoardState(ele)
}

function updateBoardState(ele) {
    board_state[ele.getAttribute("data-row")][ele.getAttribute("data-col")] = ele.innerHTML;
    gameWin = checkVictory(ele.getAttribute("data-row"), ele.getAttribute("data-col"));
    console.log(gameWin);
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