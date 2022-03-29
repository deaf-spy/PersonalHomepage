// the hard part begins

var turn = 2; // 2 means red and 1 means blue
var curr;
var levels = [5, 11, 17, 23, 29, 35, 41];
var levels2 = [0, 6, 12, 18, 24, 30, 36];
const levelsReset = [5, 11, 17, 23, 29, 35, 41];

var stop = 0;

var game1 = 
[
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
]

const gameReset = 
[
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
]

// for (let i = 0; i < levels.length; i++) {
//     // console.log(levels[i]);
    
// }

for (let i = 0; i < 7; i++) {
    var element = 'column'.concat(i);
    //     console.log(element);
    //     console.log(document.getElementById(element));
    document.getElementById(element).addEventListener("click", function () {whenClicked(i)});
    document.getElementById(element).addEventListener("mouseenter", function () {whenHovered(i)});
    document.getElementById(element).addEventListener("mouseleave", function () {whenUnHovered(i)});
    
}


for (let i = 0; i < 7; i++) {
    var element = 'column'.concat(i);
//     console.log(element);
//     console.log(document.getElementById(element));
}


function whenHovered(columnIndex) {
    if (levels[columnIndex] < levels2[columnIndex]) {}
    else {
        curr = '#row'.concat(levels[columnIndex]);
        //console.log(curr);
        $('#column'.concat(columnIndex)).addClass('hover');
        
        
        if (turn == 2) {
            $(curr).addClass('row-red');
        } else {
            $(curr).addClass('row-blue');
        }
    }
    return;
}

function whenUnHovered(columnIndex) {
    if (levels[columnIndex] < levels2[columnIndex]) {}
    else {
        curr = '#row'.concat(levels[columnIndex]);
        //console.log(curr);
        $('#column'.concat(columnIndex)).removeClass('hover');
        for (let i = 0; i < 7; i++) {
            $('#column'.concat(i)).removeClass('hover');
        }
        if (turn == 2) {
            $(curr).removeClass('row-red');
        } else {
            $(curr).removeClass('row-blue');
        }
    }
    return;
}

function whenClicked(columnIndex) {
    // console.log(stop);
    
    if (stop) {

    } else {
        //console.log("hi");
        //console.log(columnIndex);
        if (levels[columnIndex] < levels2[columnIndex]) {}
        else {
        curr = '#row'.concat(levels[columnIndex]);
        //console.log(curr);
        if (turn == 2) {
            $(curr).addClass('row-red');
        } else {
            $(curr).addClass('row-blue');
        }
        $('#column'.concat(columnIndex)).removeClass('hover');
        window.setTimeout(function() {$('#column'.concat(columnIndex)).addClass('hover');}, 250);


        winChecker(columnIndex, levels[columnIndex]-((columnIndex*6)), turn);
        if (turn == 2) {
            turn = 1;
        } else {
            turn = 2;
        }
        levels[columnIndex]--;
        
        }
    }
}

function winChecker(x, y, turn) {
    // console.log(x, y);
    if (turn == 2) {
        game1[y][x] = 2;
    } else {
        game1[y][x] = 1;
    }

    // console.log("============");
    // console.log(game);
    // console.log("============");

    // horizontal
    for (let j = 3; j < 7; j++) {
        //console.log(j, y)
        
        //console.log(game[y][j], game[y][j-1], game[y][j-2], game[y][j-3], turn)
        if ((game1[y][j] == turn && game1[y][j-1] == turn && game1[y][j-2] == turn && game1[y][j-3] == turn)) {
            console.log(`${turn} Wins!`);
            winMessage(turn, 1);
            return 0;
        } 
        
    }

    //vertical
    for (let i = 0; i < 3; i++) {
        if ((game1[i][x] == turn && game1[i+1][x] == turn && game1[i+2][x] == turn && game1[i+3][x] == turn)) {
            console.log(`${turn} Wins!`);
            winMessage(turn, 1);
            return 0;
        } 
        
    }

    //diagonal upleft to downright
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if ((game1[i][j] == turn && game1[i+1][j+1] == turn && game1[i+2][j+2] == turn && game1[i+3][j+3] == turn)) {
                console.log(`${turn} Wins!`);
                winMessage(turn, 1);
                return 0;
            } 
            
        }
        
    }

    //diagonal upright to downleft
    for (let i = 5; i > 2; i--) {
        for (let j = 0; j < 4; j++) {
            if ((game1[i][j] == turn && game1[i-1][j+1] == turn && game1[i-2][j+2] == turn && game1[i-3][j+3] == turn)) {
                console.log(`${turn} Wins!`);
                winMessage(turn, 1);
                return 0;
            } 
            
        }
        
    }
}

function winMessage(turn, enable) {
    // if enable is 1, then show the message. else remove the message
    if (enable) {
        $('#screen').css('z-index', '10');
        $('#everything').addClass('lowopacity');

        if (turn == 2) {
            $('#win-red').removeClass('hidden');
        } else {
            $('#win-blue').removeClass('hidden');
        }
        window.setTimeout(timer, 1000);
    }
    
    
}

function timer() {
    document.getElementById(".connect4").addEventListener("click", messageRemover);
}

function messageRemover() {
    document.getElementById(".connect4").removeEventListener("click", messageRemover);
    console.log(game1);
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 7; j++) {
            game1[i][j] = 0;
        }
    }
    console.log(game1);
    for (let i = 0; i < 7; i++) {
        levels[i] = levels2[i]+5;
        
    }
    $('#screen').css('z-index', '-1');
    $('#everything').removeClass('lowopacity');
    $('#win-red').addClass('hidden');
    $('#win-blue').addClass('hidden');
    
    
    for (let i = 0; i < 42; i++) {
        $('#row'.concat(i)).removeClass('row-blue');
        $('#row'.concat(i)).removeClass('row-red');
    }
    turn = 2;
    
}