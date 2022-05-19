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
    switch (ele.id) {
        case "cell1":
            board_state[0][0]=ele.innerHTML;
            checkVictory(0, 0);
            break;
        case "cell2":
            board_state[0][1]=ele.innerHTML;
            break;
        case "cell3":
            board_state[0][2]=ele.innerHTML;
            break;
        case "cell4":
            board_state[1][0]=ele.innerHTML;
            break;
        case "cell5":
            board_state[1][1]=ele.innerHTML;
            break;
        case "cell6":
            board_state[1][2]=ele.innerHTML;
            break;
        case "cell7":
            board_state[2][0]=ele.innerHTML;
            break;
        case "cell8":
            board_state[2][1]=ele.innerHTML;
            break;
        case "cell9":
            board_state[2][2]=ele.innerHTML;
            break;
    }

    console.log(board_state);
}

function checkVictory(row, col) {
    
}