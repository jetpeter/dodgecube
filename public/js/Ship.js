/*
 * Ship class. Defines the ship
 */

 var Ship = function(startX, startY) {
 	var x = startX;
 	var y = startY;
 	var size = 10;
 	var velocityX = 0;
 	var velocityY = 0;
 	var rotation = 0;
 	var damper = .05;
 	var thrust = .5;
 	var rotationRate = .2;

 	    //Update the speed of the ship and the rotation
    function update(keys, width, height) {
        if (keys.left) rotation = rotation - rotationRate;
        if (keys.right) rotation = rotation + rotationRate;
        if (keys.up) {
            accelerate();
        } else {
            decelerate();
        }
        x += velocityX;
        y += velocityY;
        //Move the ship to the opposite side of the map
        if (x > width) x = 0;
        if (x < 0) x = width;
        if (y > height) y = 0;
        if (y < 0) y = height;
    }

    function draw(ctx) {
        //Get the 3 points of the ship
        var shape = getTriangle();
        var top = shape.top;
        var bottom = shape.bottom;
        var front = shape.front;
        ctx.strokeStyle = "black";
        ctx.lineWidth   = 2;
        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(bottom.x, bottom.y);
        ctx.lineTo(front.x, front.y);
        ctx.lineTo(top.x, top.y);
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    }

    function getTriangle() {
        var sHight = size;
        var sWidth = size*1.6;
        var top = {"x": x - sWidth, "y": y + sHight};
        var bottom = {"x": x - sWidth, "y": y - sHight};
        var front = {"x": x + sWidth,"y": y};
        var center = {"x": x, "y": y};
        return {
            "top":rotatePoint(top, center, rotation),
            "bottom":rotatePoint(bottom, center, rotation),
            "front": rotatePoint(front, center, rotation)
        };
    }

    function rotatePoint(point, origin, theta) {
        var Xoffset = point.x - origin.x;
        var Yoffset = point.y - origin.y;
        var newX = Xoffset * Math.cos(theta) - Yoffset*Math.sin(theta) + origin.x;
        var newY = Xoffset * Math.sin(theta) + Yoffset*Math.cos(theta) + origin.y;
        return {"x": newX, "y": newY};
    }

    function accelerate() {
        velocityX += thrust*Math.cos(rotation);
        velocityY += thrust*Math.sin(rotation);
    }

    function decelerate() {
        if (velocityX !=  0) {
        	velocityX -=  damper * velocityX;
        }
        if (velocityY != 0 ) {
        	velocityY -= damper * velocityY;
		}
    }

    function overlaps(target) {
        var maxDist = target.size + size;
        var minDist = target.size;
        var xDif = Math.abs(x - target.x);
        var yDif = Math.abs(y - target.y);
        var centerDist = yDif*yDif + xDif*xDif;
        if (centerDist > maxDist * maxDist) {
            return false;
        } else if (centerDist < minDist*minDist) {
            return true;
        } else {
            var triangle = getTriangle();
            return hasCollided(triangle.top, target) || hasCollided(triangle.bottom, target) || hasCollided(triangle.front, target)
        }
    }

    function hasCollided(point, target) {
        var size = target.size/2;
        var inX = (point.x > target.x - size && point.x < target.x + size);
        var inY = (point.y > target.y - size && point.y < target.y + size);
        return inX && inY;
    }

    function fireMissle() {    
        var tip = rotatePoint({"x": x+(size*2), "y": y},{"x" :x, "y": y}, rotation)
        return new Missile(tip.x, tip.y, velocityX, velocityY, rotation);
    }

    function stop() {
        velocityY = 0;
        velocityX = 0;
    }

    return {
    	update: update,
    	draw: draw,
        overlaps: overlaps,
        fireMissle: fireMissle,
        stop: stop,
    }

 }