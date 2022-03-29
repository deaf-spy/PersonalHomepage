class Stockfish extends Component {
    static propTypes = { children: PropTypes.func };
  
    state = { fen: "start" };
  
    componentDidMount() {
      this.setState({ fen: game.fen() });
  
      this.engineGame().prepareMove();
    }
  
    onDragStart (source, piece, position, orientation) {
  
      if (game.game_over()) {
        game.reset();
        board.start();
      }
  
      if ((orientation === 'white' && piece.search(/^w/) === -1) ||
          (orientation === 'black' && piece.search(/^b/) === -1)) {
        return false
      }
  
    }
  
    onSnapEnd () {
      board.position(game.fen())
    }
  
    onDrop () {
  
      var move = game.move({
  
        from: source,
        to: target,
        promotion: 'q'
      });
  
      if (move === null) return 'snapback';
  
      return new Promise(resolve => {
        this.setState({ fen: game.fen() });
        resolve();
      }).then(() => this.engineGame().prepareMove());
    
  
      // AiPlayer();
  
    }
  
    engineGame = options => {
      options = options || {};
  
      /// We can load Stockfish via Web Workers or via STOCKFISH() if loaded from a <script> tag.
      let engine =
        typeof STOCKFISH === "function"
          ? STOCKFISH()
          : new Worker(options.stockfishjs || "stockfish.js");
      let evaler =
        typeof STOCKFISH === "function"
          ? STOCKFISH()
          : new Worker(options.stockfishjs || "stockfish.js");
      let engineStatus = {};
      let time = { wtime: 3000, btime: 3000, winc: 1500, binc: 1500 };
      let playerColor = "black";
      let clockTimeoutID = null;
      // let isEngineRunning = false;
      let announced_game_over;
      // do not pick up pieces if the game is over
      // only pick up pieces for White
  
      setInterval(function() {
        if (announced_game_over) {
          return;
        }
  
        if (game.game_over()) {
          announced_game_over = true;
        }
      }, 500);
  
      function uciCmd(cmd, which) {
        // console.log('UCI: ' + cmd);
  
        (which || engine).postMessage(cmd);
      }
      uciCmd("uci");
      function clockTick() {
        let t =
          (time.clockColor === "white" ? time.wtime : time.btime) +
          time.startTime -
          Date.now();
        let timeToNextSecond = (t % 1000) + 1;
        clockTimeoutID = setTimeout(clockTick, timeToNextSecond);
      }
  
      function stopClock() {
        if (clockTimeoutID !== null) {
          clearTimeout(clockTimeoutID);
          clockTimeoutID = null;
        }
        if (time.startTime > 0) {
          let elapsed = Date.now() - time.startTime;
          time.startTime = null;
          if (time.clockColor === "white") {
            time.wtime = Math.max(0, time.wtime - elapsed);
          } else {
            time.btime = Math.max(0, time.btime - elapsed);
          }
        }
      }
  
      function startClock() {
        if (game.turn() === "w") {
          time.wtime += time.winc;
          time.clockColor = "white";
        } else {
          time.btime += time.binc;
          time.clockColor = "black";
        }
        time.startTime = Date.now();
        clockTick();
      }
  
      function get_moves() {
        let moves = "";
        let history = game.history({ verbose: true });
  
        for (let i = 0; i < history.length; ++i) {
          let move = history[i];
          moves +=
            " " + move.from + move.to + (move.promotion ? move.promotion : "");
        }
  
        return moves;
      }
  
      const prepareMove = () => {
        stopClock();
        // this.setState({ fen: game.fen() });
        let turn = game.turn() === "w" ? "white" : "black";
        if (!game.game_over()) {
          // if (turn === playerColor) {
          if (turn !== playerColor) {
            // playerColor = playerColor === 'white' ? 'black' : 'white';
            uciCmd("position startpos moves" + get_moves());
            uciCmd("position startpos moves" + get_moves(), evaler);
            uciCmd("eval", evaler);
  
            if (time && time.wtime) {
              uciCmd(
                "go " +
                  (time.depth ? "depth " + time.depth : "") +
                  " wtime " +
                  time.wtime +
                  " winc " +
                  time.winc +
                  " btime " +
                  time.btime +
                  " binc " +
                  time.binc
              );
            } else {
              uciCmd("go " + (time.depth ? "depth " + time.depth : ""));
            }
            // isEngineRunning = true;
          }
          if (game.history().length >= 2 && !time.depth && !time.nodes) {
            startClock();
          }
        }
      };
  
      evaler.onmessage = function(event) {
        let line;
  
        if (event && typeof event === "object") {
          line = event.data;
        } else {
          line = event;
        }
  
        // console.log('evaler: ' + line);
  
        /// Ignore some output.
        if (
          line === "uciok" ||
          line === "readyok" ||
          line.substr(0, 11) === "option name"
        ) {
          return;
        }
      };
  
      engine.onmessage = event => {
        let line;
  
        if (event && typeof event === "object") {
          line = event.data;
        } else {
          line = event;
        }
        // console.log('Reply: ' + line);
        if (line === "uciok") {
          engineStatus.engineLoaded = true;
        } else if (line === "readyok") {
          engineStatus.engineReady = true;
        } else {
          let match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
          /// Did the AI move?
          if (match) {
            // isEngineRunning = false;
            game.move({ from: match[1], to: match[2], promotion: match[3] });
            this.setState({ fen: game.fen() });
            prepareMove();
            uciCmd("eval", evaler);
            //uciCmd("eval");
            /// Is it sending feedback?
          } else if (
            (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/))
          ) {
            engineStatus.search = "Depth: " + match[1] + " Nps: " + match[2];
          }
  
          /// Is it sending feed back with a score?
          if ((match = line.match(/^info .*\bscore (\w+) (-?\d+)/))) {
            let score = parseInt(match[2], 10) * (game.turn() === "w" ? 1 : -1);
            /// Is it measuring in centipawns?
            if (match[1] === "cp") {
              engineStatus.score = (score / 100.0).toFixed(2);
              /// Did it find a mate?
            } else if (match[1] === "mate") {
              engineStatus.score = "Mate in " + Math.abs(score);
            }
  
            /// Is the score bounded?
            if ((match = line.match(/\b(upper|lower)bound\b/))) {
              engineStatus.score =
                ((match[1] === "upper") === (game.turn() === "w")
                  ? "<= "
                  : ">= ") + engineStatus.score;
            }
          }
        }
        // displayStatus();
      };
  
      return {
        start: function() {
          uciCmd("ucinewgame");
          uciCmd("isready");
          engineStatus.engineReady = false;
          engineStatus.search = null;
          prepareMove();
          announced_game_over = false;
        },
        prepareMove: function() {
          prepareMove();
        }
      };
    };
  
    render() {
      const { fen } = this.state;
      return this.props.children({ position: fen, onDrop: this.onDrop });
    }
  }
  
  // export default Stockfish;

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

var aiPlaying = 1;
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



engine.onmessage = function (event) {
  // console.log('thinking');
  // console.log(event.data);

  onMessage(event);
};

function onMessage(event) {
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
      
      // $(document).keypress(function (event) {
        
      //   if (cheatcode_cache.indexOf("h") != -1) {

      //     cheatcode_cache = "";
      //     game.move({
      //       from: match2[1],
      //       to: match2[2],
      //       promotion: match2[3]
      //     });

      //   }

      // });
    }

  }
}




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
          // console.log("this is the: " + currentIndex);
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
    enginegame1();
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

// player();



var playerInterval;

function aiPlayer() {
  // board = Chessboard('board1');
  uciCmd('uci');
  uciCmd('isready');
  uciCmd('ucinewgame');
  

  var skilllevel = Math.floor(Math.random()*20)
  uciCmd('setoption name Skill Level value' + skilllevel);

  playerInterval = setInterval(enginegame1, 1000);

}

aiPlayer();

function enginegame1() {
  // stockfish.postMessage('setoption name Skill Level Maximum Error value 600');
  // stockfish.postMessage('setoption name Skill Level Probability value 128');
  

  uciCmd('position fen ' + game.fen());
  window.setTimeout(function() {uciCmd('go depth 10')}, 500);
  // console.log(game.game_over());
  if (clicked1 || game.game_over()) {
    // console.log('somethign');
    clearInterval(playerInterval);
  }

  // console.log("hi");
}



var hitbox = document.querySelector(".chessboard1");

hitbox.addEventListener('click', playAi);


function uciCmd(cmd, which) {
  // console.log("UCI: " + cmd);

  (engine).postMessage(cmd);
}


function playAi() {
  if (started1) {
    return;
  }
  if (!clicked1) {
    started1 = 1;
    clicked1 = 1;
    
    gameRunning = 0;
    hiddenGate = 1;
    game.reset();
    board = Chessboard('board1', aiConfig);
    $('.myname').addClass('hidden');

    // engineGame();
    if (engine) {

      uciCmd('uci');
      uciCmd('isready');
      uciCmd('ucinewgame');
      uciCmd('setoption name Skill Level value 20');
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
  // console.log('next: ' + halfMoveIndex);
  return gameHistory[halfMoveIndex];
  
  
}

function clearRest() {

  if (game.fen() != gameHistory[halfMoveIndex]) {
    for (let i = halfMoveIndex+1; i < gameHistory.length; i++) {
      gameHistory.pop();
    }
    currentIndex = halfMoveIndex;
    // console.log("current index: " + currentIndex);
    // console.log(currentIndex);
    // console.log(gameHistory);
  }

  
}