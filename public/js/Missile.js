var Missile = function (startX, startY, startVX, startVY, startRotation) {
	var x = startX;
	var y = startY;
	var velocityX = startVX;
	var velocityY = startVY;
	var rotation = startRotation;
	var thrust = .7;
    var topSpeed = 10;
    var prevX = x;
    var prevY = y;

    function update(width, height) {
        rotation += ((Math.random() - .5) * .1 )
        accelerate();
        prevX = x;
        prevY = y;
        x += velocityX;
        y += velocityY;
        // Return true if the missle is if the missle if off the screen
        return (x > width || x < 0 || y > height || y < 0);
    }

    function accelerate() {
        velocityX += thrust*Math.cos(rotation);
        velocityY += thrust*Math.sin(rotation);
    }


    function checkForHit(targets) {
        for (var j = 0; j < targets.length; j++) {
            if (overlapsTarget(targets[j])) {
                return j;
            }
        }
        return -1;
    }

    function overlapsTarget(target) {
        if (!target.isMature()) {
            return false;
        }
        var prevPt = {"x": prevX, "y": prevY};
        var Pt = {"x": x, "y": y};
        //Calculate the target corners
        var size = target.size/2;
        var topLeft = {"x" : target.x + size, "y" : target.y - size};
        var topRight = {"x" : target.x + size, "y" : target.y + size};
        var bottomLeft = {"x" : target.x - size, "y" : target.y - size};
        var bottomRight = {"x" : target.x - size, "y" : target.y + size};

        var collided = collided || lineIntersectsLine(prevPt, Pt, topLeft, topRight);
        collided = collided || lineIntersectsLine(prevPt, Pt, topLeft, bottomLeft);
        collided = collided || lineIntersectsLine(prevPt, Pt, topRight, bottomRight);
        collided = collided || lineIntersectsLine(prevPt, Pt, bottomRight, bottomLeft);
        collided = collided || hasCollided(prevPt, target) || hasCollided(Pt, target);
        return collided;
    }

    function lineIntersectsLine(l1p1, l1p2, l2p1, l2p2) {
        q = (l1p1.y - l2p1.y) * (l2p2.x - l2p1.x) - (l1p1.x - l2p1.x) * (l2p2.y - l2p1.y);
        d = (l1p2.x - l1p1.x) * (l2p2.y - l2p1.y) - (l1p2.y - l1p1.y) * (l2p2.x - l2p1.x);
        if( d == 0 ) {
            return false;
        }
        r = q / d;
        q = (l1p1.y - l2p1.y) * (l1p2.x - l1p1.x) - (l1p1.x - l2p1.x) * (l1p2.y - l1p1.y);
        s = q / d;
        if( r < 0 || r > 1 || s < 0 || s > 1 ) {
            return false;
        }
        return true;
    }

    function hasCollided(point, target) {
        var size = target.size/2;
        var inX = (point.x > target.x - size && point.x < target.x + size);
        var inY = (point.y > target.y - size && point.y < target.y + size);
        return inX && inY;
    }

    function draw(ctx) {
        var xVector = Math.cos(rotation);
        var yVector = Math.sin(rotation);
        var xTail = x - 15*xVector;
        var yTail = y - 15*yVector;
        var xThrust = x - 19*xVector;
        var yThrust = y - 19*yVector;
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(xTail, yTail);
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = "red"
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(xTail, yTail);
        ctx.lineTo(xThrust, yThrust);
        ctx.stroke();
        ctx.closePath();
    }

    function getLocation() {
        return {"x": x, "y": y};
    }

    return {
    	update: update,
    	draw: draw,
    	checkForHit: checkForHit,
        getLocation: getLocation
    }
}