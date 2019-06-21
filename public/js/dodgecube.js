$(dodgecube).ready(function(){
    //Canvas stuff
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    var width = $("#canvas").width();
    var height = $("#canvas").height();
    var targetCount = 5;
    //Array Of targets
    var targets;
    //Array of visible missles
    var missles;
    //The Ship controlled by the player
    var ship;
    //Keep Track if the player is in the game or the background is just animating
    var inGame = false;
    //Keeps track of the intervol for the game.
    var gameLoop;
    //Keeps track of the current key presses
    var keys;
    var sounds = false;
    var scoreCounter = new flipCounter("score", {auto: false, pace: 500});
    scoreCounter.setValue(0);

    var missleSound = new Audio("sounds/missle.mp3"); // buffers automatically when created

    //Register the click callback for starting a new game.
    $("#new_game").click(
        function() {
            init();
            $('#menu').fadeOut();
            $('#menu').hide();
        }
    );

    function init() {
        ship = new Ship(width / 2, height / 2);
        targets = [];
        missles = [];
        //Add the initial targets
        for (var i = 0; i < targetCount; i++) {
            targets.push(new Target(width, height));
        }
        // Initialise keyboard controls
        keys = new Keys();
        inGame = true;
        if(typeof gameLoop != "undefined") {
            clearInterval(gameLoop);
        }
        gameLoop = setInterval(dodgecube, 60);
    }

    function dodgecube() {
        //Update the ship's Location and rotation
        ship.update(keys, width, height);
        updateBackgroud();
        updatePlayerObjects();
    }

    function updateBackgroud() {
        //Reset the canvas
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, width, height);
        drawTargets();
    }

    function updatePlayerObjects() {
        if (keys.space) {
            fireMissle(ship);
        }
        //Draw the ship on the canvas
        updateMissles(missles);
        ship.draw(ctx);
        //Don't count the initial 5 targets
        scoreCounter.setValue(targets.length - 5);
    }

    function drawTargets() {
        // Loop through in reverse order so the olders targets are drawn last
        for (var i = targets.length-1; i >= 0; i--) {
            var target = targets[i];
            target.incromentAge();
            if (inGame && (target.shouldExplode() || (target.isMature() && ship.overlaps(target)))) {
                ship.stop();
                target.explode();
                gameOver();
            }
            target.draw(ctx, inGame);
            if (target.hasExploded()) {
                target.checkForExplosionReaction(targets);
            }
        }
    }

    function fireMissle() {
        var missle = ship.fireMissle();
        missles.push(missle);
        if (sounds) {
            if (missleSound.currentTime > .09) {
                missleSound.currentTime = 0;
            }
            missleSound.play();
        }
    }

    function updateMissles(missles) {
        for(var i = 0; i < missles.length; i++)  {
            missle = missles[i];
            var prevousPoint = missle.getLocation();
            var offScreen = missle.update(width, height);
            if (offScreen) {
                missles.splice(i,1);
            } else {
                missle.draw(ctx);
                var targetIndex = missle.checkForHit(targets);
                //Only count hits that happoned before the game ended.
                if (targetIndex >= 0 && inGame) {
                    missles.splice(i,1);
                    targets.splice(targetIndex,1);
                    targets.push(new Target(width, height));
                    targets.push(new Target(width, height));
                }
            }
        }
    }

    function gameOver() {
        inGame = false;
        if(typeof gameLoop != "undefined") {
            clearInterval(gameLoop);
        }
        getPlayerAndScore();
        showNewGame();
        gameLoop = setInterval(updateBackgroud, 60);
    }

    function getPlayerAndScore() {
        $("#status").text("game over")
        var name = $('#player_name').val();
        if (name.length == 0) {
            name = 'Guest Pilot';
        }
        postScore(name, targets.length - 5);
    }

    function showNewGame() {
        $('#menu').fadeIn();
        $('#menu').show();
    }

    function postScore(name, score) {
        console.log("Name: " + name + ", score: " + score);
        $.ajax({
            url: "https://dodgecube.com/ps.php",
            type: "POST",
            data: { name: name, score: score },
            dataType: "json",
            success: function (result) {
                addScores(result);
            },
            error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
            }
        });
    }

    function addScores(newScores) {
        var scores = $('.score_list');
        scores.children().remove();
        var index = 0;
        for (var i in newScores) {
            var row = newScores[i];
            index++;
            var entry = '<tr class"score_row text">';
            entry += '<td class="rank">' + index + '.)</td>';
            entry += '<td class="high_score"> ' + row.score + '</td>';
            entry += '<td class="player_name">' + row.name + '</td>';
            entry += '</tr>';
            scores.append(entry);
        }
    }

    $(document).keydown(function(e){
        if (keys) {
            keys.onKeyDown(e);
        }
        return !inGame;
    });

    $(document).keyup(function(e){
        if (keys) {
            keys.onKeyUp(e);
        }
        return !inGame;
    });
})
