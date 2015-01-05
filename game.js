$(document).ready(function(){
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var canvasWidth = $("#canvas").width();
	var canvasHeight = $("#canvas").height();
	var cw = 15;
	var direction = "right";
	var score = 0;
	var snake = new Snake();
	var food = new Food();
	var isPlaying = false;
	var fps = 10; // frame per second
	

	//shim layer with a setTimeout fallback
	var requestAnimFrame = window.requestAnimFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        function(callback) {
                            window.setTimeout(callback, 1000 / 60);
                        };

    init();

	function init()	{
		document.addEventListener("keydown", function(e) {checkKey(e, true)}, false);
    	document.addEventListener("keyup", function(e) {checkKey(e, false)}, false);
		begin();
	}

	function begin() {
		isPlaying = true;
		requestAnimFrame(loop);
	}

	function update() {
		clearCtx(ctx);
    	snake.update();
    	food.update();
	}

	function draw() {
		snake.draw();
		food.draw();

	}

	function loop() {
		setTimeout(function() {
			if(isPlaying) {
				update();
				draw();
				requestAnimFrame(loop);
			}
		}, 1000/fps);
	}

	function clearCtx(ctx) {
    	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	}

	// Snake Class & methods
	function Snake() {
		this.length = 5;
		this.isUpKey = false;
    	this.isDownKey = false;
   		this.isRightKey = false;
    	this.isLeftKey = false;
    	this.snakeArray = [];
    	this.foodCollision = false;
		for(var i = this.length-1; i>=0; i--){
			this.snakeArray.push({x: i, y:0});
		};
		this.curX = this.snakeArray[0].x;
		this.curY = this.snakeArray[0].y;
	}

	Snake.prototype.draw = function() {
		for(var i = 0; i < this.snakeArray.length; i++)	{
			var c = this.snakeArray[i];			
			paintCell(c.x,c.y);
		}
	};

	Snake.prototype.update = function() {
		this.checkDirection();
	};

	Snake.prototype.checkDirection = function() {
		var newX = this.curX;
		var newY = this.curY;
		//penser à virer isMoving et à revoir ce code car le snake doit avancer tout seul

		if (this.isUpKey) {
	        this.direction = "up";
	    } else if (this.isDownKey) {
	        this.direction = "down";
	    } else if (this.isRightKey) {
	        this.direction = "right";
	    } else if (this.isLeftKey) {
	        this.direction = "left";
	    }

	    if (this.direction == "up") {
	        newY --;
	    } else if (this.direction == "down") {
	        newY ++;
	    } else if (this.direction == "right") {
	        newX ++;
	    } else if (this.direction == "left") {
	        newX --;
	    }

	    this.foodCollision = this.checkFoodCollision(newX, newY);
	    this.curX = newX;
	    this.curY = newY;

	    if (this.foodCollision) {
	    	var tail = {x: newX, y: newY};
	    } else {
	    	var tail = this.snakeArray.pop();
		    tail.x = newX;
		    tail.y = newY;
	    }

	    this.snakeArray.unshift(tail);
	};

	Snake.prototype.checkFoodCollision = function(newX, newY) {
		console.log(newX);
		if (newX === food.x && newY === food.y) {
			return true;
		} else {
			return false;
		}
	};


	// Food Class & methods
	function Food() {
		this.x = Math.round(Math.random()*(canvasWidth-cw)/cw);
		this.y = Math.round(Math.random()*(canvasHeight-cw)/cw);
	}

	Food.prototype.draw = function() {
		paintCell(this.x, this.y);
	};

	Food.prototype.update = function() {
		if (snake.foodCollision) {
			food = new Food();
		}
	};


	// Global functions
	function paintCell(x,y){
		ctx.fillStyle="green";
		ctx.fillRect(x*cw,y*cw,cw,cw);
		ctx.strokeStyle="white";
		ctx.strokeRect(x*cw,y*cw,cw,cw);
	}

	function checkKey(e, value) {
	    var keyID = e.keyCode || e.which;
	    if (keyID === 38) { //Up arrow
	        snake.isUpKey = value;
	        e.preventDefault();
	    }
	    if (keyID === 39) { //Right arrow
	        snake.isRightKey = value;
	        e.preventDefault();
	    }
	    if (keyID === 40) { //Down arrow
	        snake.isDownKey = value;
	        e.preventDefault();
	    }
	    if (keyID === 37) { //Left arrow
	        snake.isLeftKey = value;
	        e.preventDefault();
	    }
	}

	console.log(snake);
	console.log(food);
});