class Stockfish {
    constructor() {
        this.bestMove = null;
        this.skill = null;
        this.depth = null;
        this.isThinking = false;
        this.engineStatus = {};

        this.stockfish = new Worker('stockfish.js');
        this.stockfish.onmessage = (event) => {
            const line = event && typeof event === 'object' ? event.data : event;

            console.log('Stockfish: ', line);

            if (line === 'uciok') {
                this.engineStatus.engineLoaded = true;
            } else if (line === 'readyok') {
                this.engineStatus.engineReady = true;
            } else {
                const match = line.match('^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?');
                if (match) {
                    console.log(match[1], match[2], match[3]);
                    // this.bestMove = new Move(match[1], match[2], match[3] ? match[3] : null);
                    this.isThinking = false;
                }
            }
        }

        this.stockfish.postMessage('uci');
        this.stockfish.postMessage('isready');
        this.stockfish.postMessage('ucinewgame');
    }

    isEngineLoaded() {
        return this.engineStatus.engineLoaded;
    }

    /**
     * Update engine state to fenCode.
     * @param {string} fenCode
     */
    setFEN(fenCode) {
        if (!this.engineStatus.engineLoaded) {
            throw new Error('Engine not loaded');
        }

        this.stockfish.postMessage(`position fen ${fenCode}`);
    }

    /**
     * Update engine depth
     * @param {number} depth
     */
    // setDepth(depth) {
    //     console.log(depth);
    //     this.depth = _.clamp(depth, 1, 20);
    // }

    /**
     * Update engine skill level
     * @param {number} skill
     */
    // setSkillLevel(skillLevel) {
    //     if (!this.engineStatus.engineLoaded) {
    //         throw new Error('Engine not loaded');
    //     }

    //     skillLevel = _.clamp(skillLevel, 0, 20);
    //     console.log(skillLevel);
    //     this.stockfish.postMessage(`setoption name Skill Level value ${skillLevel}`);

    //     // Stockfish level 20 does not make errors (intentially), so these numbers have no effect on level 20.
    //     // Level 0 starts at 1
    //     const err_prob = Math.round((skillLevel * 6.35) + 1);
    //     // Level 0 starts at 10
    //     const max_err = Math.round((skillLevel * -0.5) + 10);

    //     this.stockfish.postMessage(`setoption name Skill Level Maximum Error value ${max_err}`);
    //     this.stockfish.postMessage(`setoption name Skill Level Probability value ${err_prob}`);

    //     this.skillLevel = skillLevel;
    // }

    /**
     * Start churning for best move.
     * @param {ChessBoardState} chessBoardState
     * @param {number} depth
     */
    searchBestMove(chessBoardState) {
        this.bestMove = null;
        this.isThinking = true;

        this.setFEN(chessBoardState.toFEN());
        this.stockfish.postMessage(`go depth ${this.depth}`);
    }

    /**
     * Returns best move if one has been found.
     */
    getBestMove() {
        return this.isThinking ? null : this.bestMove;
    }
}

export default Stockfish1