function Board(){
	
	this.squaresPerBoard = 32;
	this.canvasW = this.canvasH = 512;
	this.isPlaying = false;

	this.onFillColor = "#f99";
	this.activateTileColor = "#fbb";
	this.deactivateTileColor = "#fdd";

	this.crosshairTileLength = 15;

	this.stepDelay = 128;
	this.stepInterval = null;

	this.tiles = new Array(this.squaresPerBoard);
	this.nexttiles = new Array(this.squaresPerBoard);
	this.ctx = document.getElementById("game-of-life").getContext("2d");


	this.init = function(){
		this.initTiles(this.squaresPerBoard);
		this.drawGridLines();
	}

	this.initTiles = function(tilesW){
		var y, x;
		this.tiles = new Array(tilesW);
		this.nexttiles = new Array(tilesW);
	  for (y = 0; y < tilesW; y+=1)
	  {
	  	this.tiles[y] = new Array(tilesW);
	  	this.nexttiles[y] = new Array(tilesW);
	  	for (x = 0; x < tilesW; x+=1)
	 	 	{
	  		this.tiles[y][x] = 0;
	  		this.nexttiles[y][x] = 0;
	  	}
	  }
	}

	//Draw the omnipresent grid lines. 
	this.drawGridLines = function() {
		var i;
		this.ctx.strokeStyle="#fff";

	  for (i = 0.5; i < this.canvasW; i+= (this.canvasW/this.squaresPerBoard))
	  {
			this.ctx.moveTo(i,0);//draw vertical line
			this.ctx.lineTo(i,this.canvasH);
			this.ctx.stroke();

			this.ctx.moveTo(0,i);//horizontal line
			this.ctx.lineTo(this.canvasW,i);
			this.ctx.stroke();
	  }
	}

	//Draw a single tile. Fill the rect
	this.drawTile = function (x, y, color) {

		this.ctx.beginPath();
		this.ctx.fillStyle=color;
		this.ctx.rect(x*(this.canvasW/this.squaresPerBoard), y*(this.canvasW/this.squaresPerBoard),
								(this.canvasW/this.squaresPerBoard), (this.canvasH/this.squaresPerBoard));
		this.ctx.fill();
	}

	// User is hovering over the board. 
	// if the square under is blank, hover like a new square will be placed
	// else, hover like the square will be subtracted
	this.drawHoverTile = function (x, y){

		// debugger;
		if(this.tiles[y][x] > 0)
		{
			this.drawTile(x, y, this.deactivateTileColor);
		}else
		{
			this.drawTile(x, y, this.activateTileColor);
		}
	}

	// Clear all tiles from the board
	this.clearTiles = function (){

		this.loopDo(function(x, y){
	  	this.tiles[y][x] = 0;
	  	this.nexttiles[y][x] = 0;
	  });
	}

	this.clearNexttiles = function (){

		this.loopDo(function(x, y){
	  	this.nexttiles[y][x] = 0;
	  });
	}

	this.swapTiles = function (){

		this.loopDo(function(x, y){
	  	this.tiles[y][x] = this.nexttiles[y][x];
	  	this.nexttiles[y][x] = 0;
	  });
	}

	//Clear board, draw grid, then draw tiles
	this.drawBoard = function () {

		this.clearBoard();
		this.drawGridLines();

		this.loopDo(function(x, y){
  		if(this.tiles[y][x] == 1)
  		{
  			this.drawTile(x, y, this.onFillColor);
  		}
	  });
	}//drawBoard()

	this.loopDo = function(execute){

		var y, x;
		for (y = 0; y < this.squaresPerBoard; y+=1)
	  {
	  	for (x = 0; x < this.squaresPerBoard; x+=1)
	 	 	{
	  		execute.call(this, x, y);
	  	}
	  }
	}

	this.clearBoard = function () {

		this.ctx.clearRect(0, 0, this.canvasW, this.canvasH);
	}

	this.determineNewBoard = function (){

		var y, x, neighbours;
		for (y = 0; y < this.squaresPerBoard; y+=1)
	  {
	  	for (x = 0; x < this.squaresPerBoard; x+=1)
	 	 	{

	 	 		neighbours = 0;
	 	 		//left side
	  		if(y-1 >= 0 && x-1 >= 0)
	  		{
	  			neighbours += this.tiles[y-1][x-1];
	  		}
	  		if(x-1 >= 0)
	  		{
	  			neighbours += this.tiles[y][x-1];
	  		}
	  		if(y+1 < this.squaresPerBoard-1 && x-1 >= 0)
	  		{
	  			neighbours += this.tiles[y+1][x-1];
	  		}
	  		//right side
	  		if(y-1 >= 0 && x+1 < this.squaresPerBoard-1)
	  		{
	  			neighbours += this.tiles[y-1][x+1];
	  		}
	  		if(x+1 < this.squaresPerBoard-1)
	  		{
	  			neighbours += this.tiles[y][x+1];
	  		}
	  		if(y+1 < this.squaresPerBoard && x+1 < this.squaresPerBoard-1)
	  		{
	  			neighbours += this.tiles[y+1][x+1];
	  		}
	  		//top middle
	  		if(y-1 >= 0)
	  		{
	  			neighbours += this.tiles[y-1][x];
	  		}
	  		//bottom middle
	  		if(y+1 < this.squaresPerBoard-1)
	  		{
	  			neighbours += this.tiles[y+1][x];
	  		}

	  		if(neighbours < 2 || neighbours > 3)
	  		{
	  			this.nexttiles[y][x] = 0;
	  			// console.log('cell '+x+','+y+' dies');
	  		}else{
	  			if(neighbours == 3) 
	  			{
	  				this.nexttiles[y][x] = 1;
	  				// console.log('cell '+x+','+y+' lives');
	  			}else if(this.tiles[y][x] == 1 && neighbours == 2) 
	  			{
	  				this.nexttiles[y][x] = 1;
	  				// console.log('cell '+x+','+y+' lives');
	  			}
	  		}

	  	}//for X
	  }//for Y

	  if(this.tiles == this.nexttiles)
	  {
	  	//we got stuck...
	  	console.log("got stuck");
	  	this.stopPlayback();
	  }
	  this.swapTiles();
	}//determineNewBoard()

	this.clickedCanvas = function(event) {

		this.isPlaying = false;//stop playback when clicked

		//translate x/y to square coordinates
		var realX = Math.floor((event.layerX)/(this.canvasW/this.squaresPerBoard));
		var realY = Math.floor((event.layerY)/(this.canvasW/this.squaresPerBoard));
		// console.log("Square "+realX+", "+realY);

		this.tiles[realY][realX] = (this.tiles[realY][realX] + 1)%2;//switch between 0 & 1

		this.ctx.beginPath();
		if(this.tiles[realY][realX] == 1)
		{
			this.ctx.fillStyle=this.onFillColor;
		}else{
			this.ctx.fillStyle="#FFF";//erase the marker
		}
		this.ctx.rect(realX*(this.canvasW/this.squaresPerBoard), realY*(this.canvasW/this.squaresPerBoard), (this.canvasW/this.squaresPerBoard), (this.canvasH/this.squaresPerBoard));
		this.ctx.fill();
	}

	this.mouseOverCanvas = function(event) {

		//return a grid number like 0-31
		var realX = Math.floor((event.layerX)/(this.canvasW/this.squaresPerBoard));
		var realY = Math.floor((event.layerY)/(this.canvasW/this.squaresPerBoard));

		this.drawBoard();//redraw the board to clear any old hover-markers

		this.drawCrosshairs(realX, realY);

		this.drawHoverTile(realX, realY);
	}

	this.drawCrosshairs = function(xTile, yTile){

		//draw faint gridlines surrounding the mouse-hover, like:
		// __|_|__
		// __|X|__
		//   | |

		var delta = this.crosshairTileLength/2;

		//draw x gradient |-->|
		var grad= this.ctx.createLinearGradient(	(xTile+0.5-delta)*(this.canvasW/this.squaresPerBoard)-0.5, 0, 
																							(xTile+0.5+delta)*(this.canvasW/this.squaresPerBoard)-0.5, 0);
		grad.addColorStop(0, "white");
		grad.addColorStop(0.5, "#bbb");
		grad.addColorStop(1, "white");

		//draw horizontal grid lines
		this.ctx.strokeStyle = grad;
		this.ctx.beginPath();
		this.ctx.moveTo((xTile+0.5-delta)*(this.canvasW/this.squaresPerBoard)-0.5, 
										 yTile   *(this.canvasW/this.squaresPerBoard)-0.5);
		this.ctx.lineTo((xTile+0.5+delta)*(this.canvasW/this.squaresPerBoard)-0.5,
										 yTile   *(this.canvasW/this.squaresPerBoard)-0.5);
		
		this.ctx.moveTo((xTile+0.5-delta)*(this.canvasW/this.squaresPerBoard)-0.5, 
										(yTile+1)*(this.canvasW/this.squaresPerBoard)-0.5);
		this.ctx.lineTo((xTile+0.5+delta)*(this.canvasW/this.squaresPerBoard)-0.5,
										(yTile+1)*(this.canvasW/this.squaresPerBoard)-0.5);
		this.ctx.stroke();


		grad= this.ctx.createLinearGradient(0, (yTile+0.5-delta)*(this.canvasW/this.squaresPerBoard)-0.5, 
																				0, (yTile+0.5+delta)*(this.canvasW/this.squaresPerBoard)-0.5);
		grad.addColorStop(0, "white");
		grad.addColorStop(0.5, "#bbb");
		grad.addColorStop(1, "white");

		//draw horizontal grid lines
		this.ctx.strokeStyle = grad;
		this.ctx.beginPath();
		this.ctx.moveTo((xTile)  *(this.canvasW/this.squaresPerBoard)-0.5, 
										(yTile+0.5-delta)*(this.canvasW/this.squaresPerBoard)-0.5);
		this.ctx.lineTo((xTile)  *(this.canvasW/this.squaresPerBoard)-0.5,
										(yTile+0.5+delta)*(this.canvasW/this.squaresPerBoard)-0.5);
		
		this.ctx.moveTo((xTile+1)*(this.canvasW/this.squaresPerBoard)-0.5, 
										(yTile+0.5-delta)*(this.canvasW/this.squaresPerBoard)-0.5);
		this.ctx.lineTo((xTile+1)*(this.canvasW/this.squaresPerBoard)-0.5,
										(yTile+0.5+delta)*(this.canvasW/this.squaresPerBoard)-0.5);
		this.ctx.stroke();

	}


	this.redrawBoard = function(){

		if(this.isPlaying == false)
		{
			clearInterval(this.stepInterval);
			return false;
		}
		// debugger;
		this.drawBoard();
	}

	this.stopPlayback = function() {
			this.isPlaying = false;
			document.getElementById("playpause").innerHTML = "Play";
			clearInterval(this.stepInterval);
	}

	this.clickedPlayPause = function() {

		// debugger;
		//redraw tiles over and over. 
		if(this.isPlaying)
		{
			this.stopPlayback();
		}else
		{
			this.isPlaying = true;
			document.getElementById("playpause").innerHTML = "Pause";
			//start timer
			this.restartTimer();
		}
	}

	this.restartTimer = function(){

		clearInterval(this.stepInterval);
		this.stepInterval = setInterval( 
			(function(self) {			//Self-Executing-Anonymous-Function
     		return function() {   //Return a function in the context of 'self'

					self.determineNewBoard();
        	self.redrawBoard(); //Thing you wanted to run as non-window 'this'
     		}
 			}
 		)(this), this.stepDelay);

	}

	this.clickedClear = function(){
		
		this.stopPlayback();
		this.clearTiles();
		this.clearBoard();
		this.drawGridLines();
	}
	this.clickedFaster = function(){
		
		if(this.stepDelay >= 32)
		{
			this.stepDelay /= 2;
			this.restartTimer();
		}
		// console.log("clickedFaster; now at "+this.stepDelay);
	}
	this.clickedSlower = function(){
		
		if(this.stepDelay <= 2048)
		{
			this.stepDelay *= 2;
			this.restartTimer();
		}
		// console.log("clickedSlower; now at "+this.stepDelay);
	}
	this.clickedZoomOut = function(){
		
		console.log("clickedZoomOut");
	}
	this.clickedZoomIn = function(){
		
		console.log("clickedZoomIn");
	}

	this.init();
}//Board


(function () {
  'use strict';	

	function main () {

		var board = new Board();

		document.getElementById("game-of-life").addEventListener("mousemove", function(event){board.mouseOverCanvas(event);}, false);
		document.getElementById("game-of-life").addEventListener(	"click", 		function(event){board.clickedCanvas(event);}, false);
		document.getElementById("playpause").addEventListener(		"click", 		function(event){board.clickedPlayPause(event);}, false);
		document.getElementById("clear").addEventListener(				"click", 		function(event){board.clickedClear(event);}, false);
		document.getElementById("faster").addEventListener(				"click", 		function(event){board.clickedFaster(event);}, false);
		document.getElementById("slower").addEventListener(				"click", 		function(event){board.clickedSlower(event);}, false);
		document.getElementById("zoom-out").addEventListener(			"click", 		function(event){board.clickedZoomOut(event);}, false);
		document.getElementById("zoom-in").addEventListener(			"click", 		function(event){board.clickedZoomIn(event);}, false);
	}

  window.onload = main;

}());