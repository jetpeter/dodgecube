
var Target = function(width, height) {
	
	var targetCount = 5;
    var matureTime = 25;
    var warningTime = 500;
    var expandTime = 575;
    var explodeTime = 600;
    var defaultColor = "orange";
    var x = width * Math.random();
    var y = height * Math.random();
    var size = 10*Math.random() + 10;
    var age = 0;
    var exploded = false;
    var explosion = [];

    function draw(ctx, inGame) {
    	if (exploded) {
    		drawExplosion(ctx, inGame);
    	} else {
    		drawTarget(ctx, inGame);
    	}
    }

    function drawTarget(ctx, inGame) {
        var offset = size / 2;
        var color = defaultColor;
        if (!isMature()) {
            color = "grey";
        } else if (inGame && age > expandTime && (age % 2) == 0) {
            color = "orange";
            size++;
        } else if (age > warningTime || exploded) {
            color = "red";
        } 
        ctx.fillStyle = color;
        ctx.fillRect(x - offset, y - offset, size, size);
    }

    function drawExplosion(ctx, inGame) {
        for (var j = 0; j < explosion.length; j++) {
            var partical = explosion[j];
            partical.x += partical.velocityX;
            partical.y += partical.velocityY;
            // Check if the explosion partical if off the screen
            if (partical.x > width || partical.x < 0 || partical.y > height || partical.y < 0) {
                //Remove the partical
                explosion.splice(j, 1);
            } else {
                ctx.fillStyle = "red";
                var size = partical.size;
                var offset = size / 2;
        		ctx.fillRect(partical.x - offset, partical.y - offset, size, size);
            }
        }
    }

    function checkForExplosionReaction(targets) {
        for (var j = 0; j < explosion.length; j++) {
            var partical = explosion[j];
            for (var k = 0; k < targets.length; k++) {
                var victim = targets[k];
                if (!victim.hasExploded() && hasCollided(partical, victim)) {
                	victim.explode();
                }
            }
        }
    }

    function hasCollided(point, target) {
        var size = target.size/2;
        var inX = (point.x > target.x - size && point.x < target.x + size);
        var inY = (point.y > target.y - size && point.y < target.y + size);
        return inX && inY;
    }

    function isMature() {
    	return age > matureTime;
    }

    function shouldExplode() {
    	return age > explodeTime;
    }

    function explode() {
        for (var j = 0; j < size; j++) {
            explosion.push({
                "x" : x,
                "y" : y,
                "velocityX" : (Math.random() - .5) * 10,
                "velocityY" : (Math.random() - .5) * 10,
                "size" :  Math.random() * (size / 2)
            });
        }
        exploded = true;
    }

    function incromentAge() {
    	return age++;
    }

    function hasExploded() {
    	return exploded;
    }

    return {
    	x: x,
    	y: y,
    	size: size,
    	draw: draw,
    	explode: explode,
        isMature: isMature,
    	hasExploded: hasExploded,
    	incromentAge: incromentAge,
    	shouldExplode: shouldExplode,
    	checkForExplosionReaction: checkForExplosionReaction
    };

}