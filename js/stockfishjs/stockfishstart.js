// code credit to netreal.de

var wait_for_script;
      var newGame = function (){};
      
      /// We can load Stockfish.js via Web Workers or directly via a <script> tag.
      /// Web Workers are better since they don't block the UI, but they are not always avaiable.
      (function fix_workers()
      {
        var script_tag;
        /// Does the environment support web workers?  If not, include stockfish.js directly.
        ///NOTE: Since web workers don't work when a page is loaded from the local system, we have to fake it there too. (Take that security measures!)
        if (!Worker || (location && location.protocol === "file:")) {
          var script_tag  = document.createElement("script");
          script_tag.type ="text/javascript";
          script_tag.src  = "stockfish.js";
          script_tag.onload = init;
          document.getElementsByTagName("head")[0].appendChild(script_tag);
          wait_for_script = true;
        }
      }());
      
      function init()
      {
        var game = engineGame();
    
        newGame = function newGame() {
            var baseTime = 1
            var inc = 2
            var skill = 10
            game.reset();
            game.setTime(baseTime, inc);
            game.setSkillLevel(skill);
            game.setPlayerColor($('#color-white').hasClass('active') ? 'white' : 'black');
            game.setDisplayScore($('#showScore').is(':checked'));
            game.start();
        }
        
        game.setSkillLevel;
        
        // document.getElementById("skillLevel").addEventListener("change", function ()
        // {
        //     game.setSkillLevel(parseInt(this.value, 10));
        // });
    
        newGame();
      }
      
      /// If we load Stockfish.js via a <script> tag, we need to wait until it loads.
      if (!wait_for_script) {
        document.addEventListener("DOMContentLoaded", init);
      }