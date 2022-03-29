// import Stockfish1 from "./stockfishexport.js";

// const stockfish = new Worker('..js/stockfishjs/stockfish.js');
var engine = new Worker('./js/stockfish.js');

var board = null;
var game = new Chess()
var i = 0;
var prev = 5;
var done = false;
var thing = 0;
var clicked1 = 0;
var started1 = 0;
var my_color = 0;
var gameRunning = 1;
var hiddenGate = 0;
var match1, match2;
var future = [];
var gameHistory = [];
var halfMoveIndex = 0;
var currentIndex = 0;
var startingPos = game.fen();
gameHistory[0] = startingPos;


var changeMade = 0;


cheatcode_cache = "";
board = Chessboard('board1', 'start');
$(window).resize(board.resize)
var aiConfig = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}

//games are too good... need to get worse games
const gamelist = [
  [
    'e4', 'c5', 'Nf3', 'e6', 'c3', 'd5', 'e5', 'Ne7',
    'd4', 'Nec6', 'Bd3', 'b6', 'O-O', 'a5', 'Re1', 'h6',
    'a4', 'Ba6', 'Bb5', 'Bxb5', 'axb5', 'Na7', 'Na3', 'c4',
    'Qc2', 'Bxa3', 'bxa3', 'Nxb5', 'a4', 'Nc7', 'Ba3', 'Nc6',
    'Reb1', 'Rb8', 'Bd6', 'Kd7', 'Rb2', 'Rb7', 'Rab1', 'Na8',
    'Rb5', 'Qg8', 'Qb2', 'Qh7', 'h3', 'g5', 'Qa3', 'Rd8',
    'Bc5', 'Kc7', 'Qb2', 'Rdb8', 'Bd6+', 'Kc8', 'Bxb8', 'Kxb8',
    'Qa3', 'Ka7', 'Qd6', 'Nb8', 'Qd8', 'Qc2', 'Qc8', 'Qxa4',
    'Kh2', 'Na6', 'Nd2', 'N6c7', 'R5b2', 'Qa3', 'Qd7', 'Qxc3',
    'Qxf7', 'Qxd4', 'Nf3', 'Qf4+', 'Qxf4', 'gxf4', 'g4', 'fxg3+',
    'fxg3', 'b5', 'g4', 'b4', 'h4', 'Nb5', 'g5', 'hxg5',
    'Nxg5', 'Nac7', 'h5', 'c3', 'Ra2', 'Kb6', 'h6', 'Rb8',
    'h7', 'Rh8', 'Kg3', 'd4', 'Rh1', 'd3', 'Nf7', 'Rxh7',
    'Rxh7', 'b3', 'Rh1', 'bxa2', 'Nd6', 'Kc5', 'Nc4', 'Kxc4'
  ],
  [
    'e4', 'd6', 'd4', 'Nf6', 'Nc3', 'g6', 'Be3',
    'Bg7', 'Qd2', 'c6', 'f3', 'b5', 'Nge2', 'Nbd7',
    'Bh6', 'Bxh6', 'Qxh6', 'Bb7', 'a3', 'e5', 'O-O-O',
    'Qe7', 'Kb1', 'a6', 'Nc1', 'O-O-O', 'Nb3', 'exd4',
    'Rxd4', 'c5', 'Rd1', 'Nb6', 'g3', 'Kb8', 'Na5',
    'Ba8', 'Bh3', 'd5', 'Qf4+', 'Ka7', 'Rhe1', 'd4',
    'Nd5', 'Nbxd5', 'exd5', 'Qd6', 'Rxd4', 'cxd4', 'Re7+',
    'Kb6', 'Qxd4+', 'Kxa5', 'b4+', 'Ka4', 'Qc3', 'Qxd5',
    'Ra7', 'Bb7', 'Rxb7', 'Qc4', 'Qxf6', 'Kxa3', 'Qxa6+',
    'Kxb4', 'c3+', 'Kxc3', 'Qa1+', 'Kd2', 'Qb2+', 'Kd1',
    'Bf1', 'Rd2', 'Rd7', 'Rxd7', 'Bxc4', 'bxc4', 'Qxh8',
    'Rd3', 'Qa8', 'c3', 'Qa4+', 'Ke1', 'f4', 'f5',
    'Kc1', 'Rd2', 'Qa7'
  ],
  [
    'e4', 'e5', 'Nf3', 'd6',
    'd4', 'Bg4', 'dxe5', 'Bxf3',
    'Qxf3', 'dxe5', 'Bc4', 'Nf6',
    'Qb3', 'Qe7', 'Nc3', 'c6',
    'Bg5', 'b5', 'Nxb5', 'cxb5',
    'Bxb5+', 'Nbd7', 'O-O-O', 'Rd8',
    'Rxd7', 'Rxd7', 'Rd1', 'Qe6',
    'Bxd7+', 'Nxd7', 'Qb8+', 'Nxb8',
    'Rd8#'
  ],
  [
    'Nf3', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'd4',
    'O-O', 'Bf4', 'd5', 'Qb3', 'dxc4', 'Qxc4', 'c6',
    'e4', 'Nbd7', 'Rd1', 'Nb6', 'Qc5', 'Bg4', 'Bg5',
    'Na4', 'Qa3', 'Nxc3', 'bxc3', 'Nxe4', 'Bxe7', 'Qb6',
    'Bc4', 'Nxc3', 'Bc5', 'Rfe8+', 'Kf1', 'Be6', 'Bxb6',
    'Bxc4+', 'Kg1', 'Ne2+', 'Kf1', 'Nxd4+', 'Kg1', 'Ne2+',
    'Kf1', 'Nc3+', 'Kg1', 'axb6', 'Qb4', 'Ra4', 'Qxb6',
    'Nxd1', 'h3', 'Rxa2', 'Kh2', 'Nxf2', 'Re1', 'Rxe1',
    'Qd8+', 'Bf8', 'Nxe1', 'Bd5', 'Nf3', 'Ne4', 'Qb8',
    'b5', 'h4', 'h5', 'Ne5', 'Kg7', 'Kg1', 'Bc5+',
    'Kf1', 'Ng3+', 'Ke1', 'Bb4+', 'Kd1', 'Bb3+', 'Kc1',
    'Ne2+', 'Kb1', 'Nc3+', 'Kc1', 'Rc2#'
  ],
  [
    'd4', 'd5', 'Nf3', 'c6', 'c4', 'dxc4',
    'e4', 'Nf6', 'e5', 'Nd5', 'Bxc4', 'e6',
    'O-O', 'c5', 'Nc3', 'Nb6', 'Bd3', 'cxd4',
    'Nxd4', 'Na6', 'Qg4', 'Nc5', 'Bb5+', 'Bd7',
    'Bg5', 'Qb8', 'f4', 'a6', 'Bxd7+', 'Nbxd7',
    'f5', 'Nxe5', 'Qh3', 'Bd6', 'b4', 'Ncd3',
    'fxe6', 'O-O', 'e7', 'Re8', 'Nd5', 'Nxb4',
    'Nxb4', 'Bxb4', 'Nf5', 'Ng6', 'Bf6', 'Bxe7',
    'Bxg7', 'Qa7+', 'Kh1', 'Bg5', 'Bd4', 'Re4',
    'Bxa7', 'Rxa7', 'Nh6+'
  ],
  [
    'e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'Nc3', 'd6',
    'h3', 'Nf6', 'd3', 'h6', 'O-O', 'Be6', 'Nd5', 'O-O',
    'c3', 'Bb6', 'Be3', 'Re8', 'Re1', 'Bxe3', 'fxe3', 'Na5',
    'Nxf6+', 'Qxf6', 'Bxe6', 'Qxe6', 'b4', 'Nc6', 'a4', 'a5',
    'b5', 'Ne7', 'Nd2', 'd5', 'c4', 'c6', 'exd5', 'cxd5',
    'e4', 'dxc4', 'dxc4', 'b6', 'Qc2', 'Rac8', 'Rac1', 'Rc7',
    'Re3', 'Rec8', 'Rf1', 'Ng6', 'Qd1', 'Nf4', 'h4', 'Rd7',
    'Qc2', 'Rd4', 'Rc1', 'Qg4', 'Nf3', 'Rdxc4', 'Qf2', 'Rxc1+',
    'Kh2', 'R8c2', 'Nd2', 'Qxg2+', 'Qxg2', 'Nxg2', 'Kxg2', 'Rxd2+',
    'Kg3', 'Rdc2', 'Kg4', 'Rc3', 'Re2', 'g6', 'h5', 'Kg7',
    'Rg2', 'Rc4', 'hxg6', 'fxg6', 'Rd2', 'Rxe4+', 'Kf3', 'Rf4+',
    'Kg3', 'Rc3+', 'Kg2', 'Rd4', 'Rxd4', 'exd4', 'Kf2', 'Re3',
    'Kg2', 'Re2+', 'Kf3', 'd3', 'Kg3', 'd2', 'Kf3', 'd1=Q',
    'Kg3', 'Qd3+', 'Kf4', 'Re4#'
  ]
]



function onDragStart(source, piece, position, orientation) {

  if (game.game_over()) {
    game.reset();
    board.start();
  }

  if ((orientation === 'white' && piece.search(/^w/) === -1) ||
    (orientation === 'black' && piece.search(/^b/) === -1)) {
    return false
  }

}

function onSnapEnd() {
  board.position(game.fen())
  $('.myname').addClass('hidden');

  
  halfMoveIndex++;
  currentIndex++;

  if (game.fen() != gameHistory[halfMoveIndex] && gameHistory[halfMoveIndex] != undefined) {
    clearRest();
  } 
  gameHistory[halfMoveIndex] = (game.fen())
  
  enginegame1();

}

function onDrop(source, target) {

  var move = game.move({

    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';




  if (engine) {
    uciCmd('')
  }

}

function enginegame1() {
  // stockfish.postMessage('setoption name Skill Level Maximum Error value 600');
  // stockfish.postMessage('setoption name Skill Level Probability value 128');


  uciCmd('position fen ' + game.fen());
  window.setTimeout(function () {uciCmd('go depth 10')}, 400);


  // console.log("hi");
}

engine.onmessage = function (event) {
  // console.log(event.data);
  var line;

  if (event && typeof event === "object") {
    line = event.data;
  } else {
    line = event;
  }
  if (line.includes('bestmove')) {
    match1 = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
    match2 = line.match(/ponder ([a-h][1-8])([a-h][1-8])([qrbk])?/);


    if (match1) {
      // console.log(match1);
      // console.log(match2);
      

      game.move({
        from: match1[1],
        to: match1[2],
        promotion: match1[3]
      });

      board.position(game.fen());
      // console.log(gameHistory[halfMoveIndex]);
      if (game.fen() != gameHistory[halfMoveIndex] && gameHistory[halfMoveIndex] != undefined) {
        clearRest();
      } 

      halfMoveIndex++;
      currentIndex++;
      gameHistory[halfMoveIndex] = (game.fen());
      
      $(document).keypress(function (event) {
        
        if (cheatcode_cache.indexOf("h") != -1) {
          const coolDown = 5000;
          let lastpress = Date.now() - coolDown;

          function cooldownstarter() {
            
            lastpress = Date.now();
          }
          console.log('lol');
          function checker1() {
            const overornot = (Date.now() - lastpress) < cooldownstarter
            console.log(overornot);
            if (overornot) {
              console.log('spam');
              alert('spam');
            } else {
              return !overornot;
            }
          
          }

          
          if(checker1) {
            cooldownstarter();
            cheatcode_cache = "";
            // console.log('pressing h', match2);

            game.move({
              from: match2[1],
              to: match2[2],
              promotion: match2[3]
            });
            board.position(game.fen());

            window.setTimeout(function () {enginegame1()}, 400);
            // delay(5000);
          }
          

          
        }

      });
    }

  }
};




var current2 = gamelist[0];

// function nothing() {
//   console.log("Hi there!");
//   done = true;
// }

document.onkeydown = function (event) {
  if (gameRunning) {} else {
    
    switch (event.keyCode) {
      
      case 37:
        // console.log(halfMoveIndex);
        // console.log("Left key is pressed.");
        if (halfMoveIndex > 0) {
          game.load(back());
          board.position(game.fen());
        }
        
        break;
      case 39:
        // console.log(halfMoveIndex);
        // console.log("Right key is pressed.");
        if (halfMoveIndex < currentIndex) {
          game.load(next());
          board.position(game.fen());
        }

        break;
    }
    
  }
};

$(document).keypress(function (event) {
  // console.log(event.key);
  cheatcode_cache += 47 < event.which && event.which < 123 ? event.key : "";
  if (cheatcode_cache.indexOf("p") != -1) {
    cheatcode_cache = "";
    //console.log(wow);
    thing = !thing;
    console.log(thing);
  } else if (cheatcode_cache.indexOf("f") != -1) {
    cheatcode_cache = "";
    my_color = !my_color;
    //console.log(wow);
    board.flip();
  }
  // } else if (cheatcode_cache.indexOf("h") != -1) {

  //   cheatcode_cache = "";
  //   game.move({
  //     from: match2[1],
  //     to: match2[2],
  //     promotion: match2[3]
  //   });

  // }

});

function mover(current) {
  if (clicked1) {
    return;
  }
  if (game.game_over() || i == current.length) {
    //alert("game over");
    window.setTimeout(player, 2000);
    return 0;
  }
  game.move(current[i]);
  board.position(game.fen());
  i++;
  //console.log(i);
  window.setTimeout(function () {
    mover(current)
  }, 750);
}

function player() {
  i = 0;
  game.reset();
  board.start();
  var randomint = Math.floor(Math.random() * gamelist.length);
  console.log(randomint);
  const current2 = gamelist[randomint];
  window.setTimeout(function () {
    mover(current2)
  }, 500);

}

player();

var hitbox = document.querySelector(".chessboard1");

hitbox.addEventListener('click', playAi);


function uciCmd(cmd, which) {
  // console.log("UCI: " + cmd);

  (engine).postMessage(cmd);
}
uciCmd('uci');

function playAi() {
  if (started1) {
    return;
  }
  if (!clicked1) {
    started1 = 1;
    clicked1 = 1;
    gameRunning = 0;
    hiddenGate = 1;
    gameHistory = [];
    halfMoveIndex = 0;
    currentIndex = 0;
    game.reset();
    board = Chessboard('board1', aiConfig);
    $('.myname').addClass('hidden');

    // engineGame();
    if (engine) {

      uciCmd('isready');
      uciCmd('ucinewgame');
      uciCmd('setoption name Skill Level value 5');
      // uciCmd('setoption name Skill Level Maximum Error value 600');
      // uciCmd('position fen' + game.fen());
      // uciCmd('go depth 10');
      // console.log("hi");

    }




  } else {
    // clicked1 = 0;
    // player();

  }

}


// UNDO AND REDO UTILITIES

function back() {

  
  halfMoveIndex--;
  // console.log('back: ' + halfMoveIndex);
  changeMade = 1;
  return gameHistory[halfMoveIndex];
  
  
}

function next() {
  
  
  halfMoveIndex++;
  console.log('next: ' + halfMoveIndex);
  return gameHistory[halfMoveIndex];
  
  
}

function clearRest() {

  if (game.fen() != gameHistory[halfMoveIndex]) {
    for (let i = halfMoveIndex+1; i < gameHistory.length; i++) {
      gameHistory.pop();
    }
    currentIndex = currentIndex - gameHistory.length + halfMoveIndex + 1;
    // console.log("current index: " + currentIndex);
    // console.log(currentIndex);
    // console.log(gameHistory);
  }

  
}