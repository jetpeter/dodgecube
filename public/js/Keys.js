/*
 * Keep track of what keys have been pressed
 */
var Keys = function(up, left, right, space) {
	var up = up || false,
		left = left || false,
		right = right || false,
		space = space || false;
		
	var onKeyDown = function(e) {
		var that = this,
			c = e.keyCode;
		switch (c) {
			case 37: // Left
				that.left = true;
				break;
			case 38: // Up
				that.up = true;
				break;
			case 39: // Right
				that.right = true;
				break;
			case 32: // Space
				that.space = true;
				break;
		};
	};
	
	var onKeyUp = function(e) {
		var that = this,
			c = e.keyCode;
		switch (c) {
			case 37: // Left
				that.left = false;
				break;
			case 38: // Up
				that.up = false;
				break;
			case 39: // Right
				that.right = false;
				break;
			case 32: // Space
				that.space = false;
				break;
		};
	};

	return {
		up: up,
		left: left,
		right: right,
		space: space,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp
	};
};