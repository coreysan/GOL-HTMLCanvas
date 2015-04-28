(function () {
  'use strict';
	var tiles, nexttiles, isPlaying, canvasW, canvasH, squaresPerBoard, ctx;

	var stepDelay, stepInterval, onFillColor;
  canvasW = canvasH = 512;
	squaresPerBoard = 32;
	isPlaying = false;
	onFillColor = "#f99";
	stepDelay = 30;

	/* Initializes the tiles with the given width/height
	*/
	function populateBoard(tilesW, tilesH)
	{
		var y, x;
		tiles = new Array(tilesH);
		nexttiles = new Array(tilesH);
	  for (y = 0; y < tilesH; y+=1)
	  {
	  	tiles[y] = new Array(tilesW);
	  	nexttiles[y] = new Array(tilesW);
	  	for (x = 0; x < tilesW; x+=1)
	 	 	{
	  		tiles[y][x] = 0;
	  		nexttiles[y][x] = 0;
	  	}
	  }
	}

	function drawGrid() {
		var i;
		ctx.strokeStyle="#eee";

	  for (i = 0.5; i < canvasW; i+= (canvasW/squaresPerBoard))
	  {
			ctx.moveTo(i,0);//draw vertical line
			ctx.lineTo(i,canvasH);
			ctx.stroke();

			ctx.moveTo(0,i);//horizontal line
			ctx.lineTo(canvasW,i);
			ctx.stroke();
	  }
	}

	function drawTile(x, y, color) {

		// debugger;
		ctx.beginPath();
		ctx.fillStyle=color;
		ctx.rect(x*(canvasW/squaresPerBoard), y*(canvasW/squaresPerBoard),
								(canvasW/squaresPerBoard), (canvasH/squaresPerBoard));
		ctx.fill();
	}

	function clearTiles(){
		var y, x;

		for (y = 0; y < squaresPerBoard; y+=1)
	  {
	  	for (x = 0; x < squaresPerBoard; x+=1)
	 	 	{
	  		tiles[y][x] = 0;
	  		nexttiles[y][x] = 0;
	  	}
	  }
	}
	function clearNexttiles(){
		var y, x;

		for (y = 0; y < squaresPerBoard; y+=1)
	  {
	  	for (x = 0; x < squaresPerBoard; x+=1)
	 	 	{
	  		nexttiles[y][x] = 0;
	  	}
	  }
	}
	function swapTiles(){
		var y, x;

		for (y = 0; y < squaresPerBoard; y+=1)
	  {
	  	for (x = 0; x < squaresPerBoard; x+=1)
	 	 	{
	  		tiles[y][x] = nexttiles[y][x];
	  		nexttiles[y][x] = 0;
	  	}
	  }
	}

	function clearBoard () {

		ctx.clearRect(0, 0, canvasW, canvasH);
	}

	function determineNewBoard(){
		var y, x, neighbours;
		for (y = 0; y < squaresPerBoard; y+=1)
	  {
	  	for (x = 0; x < squaresPerBoard; x+=1)
	 	 	{

	 	 		neighbours = 0;
	 	 		//left side
	  		if(y-1 >= 0 && x-1 >= 0)
	  		{
	  			neighbours += tiles[y-1][x-1];
	  		}
	  		if(x-1 >= 0)
	  		{
	  			neighbours += tiles[y][x-1];
	  		}
	  		if(y+1 < squaresPerBoard-1 && x-1 >= 0)
	  		{
	  			neighbours += tiles[y+1][x-1];
	  		}
	  		//right side
	  		if(y-1 >= 0 && x+1 < squaresPerBoard-1)
	  		{
	  			neighbours += tiles[y-1][x+1];
	  		}
	  		if(x+1 < squaresPerBoard-1)
	  		{
	  			neighbours += tiles[y][x+1];
	  		}
	  		if(y+1 < squaresPerBoard && x+1 < squaresPerBoard-1)
	  		{
	  			neighbours += tiles[y+1][x+1];
	  		}
	  		//top middle
	  		if(y-1 >= 0)
	  		{
	  			neighbours += tiles[y-1][x];
	  		}
	  		//bottom middle
	  		if(y+1 < squaresPerBoard-1)
	  		{
	  			neighbours += tiles[y+1][x];
	  		}

	  		if(neighbours < 2 || neighbours > 3)
	  		{
	  			nexttiles[y][x] = 0;
	  			// console.log('cell '+x+','+y+' dies');
	  		}else{
	  			if(neighbours == 3) 
	  			{
	  				nexttiles[y][x] = 1;
	  				// console.log('cell '+x+','+y+' lives');
	  			}else if(tiles[y][x] == 1 && neighbours == 2) 
	  			{
	  				nexttiles[y][x] = 1;
	  				// console.log('cell '+x+','+y+' lives');
	  			}
	  		}

	  	}//for X
	  }//for Y

	  if(tiles == nexttiles)
	  {
	  	//we got stuck...
	  	console.log("got stuck");
	  	stopPlayback();
	  }
	  swapTiles();
	}//determineNewBoard

	function drawBoard() {
		var x, y;

		clearBoard();
		drawGrid();
		determineNewBoard();

	  for (y = 0; y < squaresPerBoard; y+=1)
	  {
	  	for (x = 0; x < squaresPerBoard; x+=1)
	 	 	{
	  		if(tiles[y][x] == 1)
	  		{
	  			drawTile(x, y, onFillColor);
	  		}
	  	}
	  }
	}

	function clickedCanvas (event) {

		isPlaying = false;//stop playback when clicked

		//translate x/y to square coordinates
		var realX = Math.floor((event.layerX)/(canvasW/squaresPerBoard));
		var realY = Math.floor((event.layerY)/(canvasW/squaresPerBoard));
		// console.log("Square "+realX+", "+realY);

		tiles[realY][realX] = (tiles[realY][realX] + 1)%2;//switch between 0 & 1
		// debugger;

		ctx.beginPath();
		if(tiles[realY][realX] == 1)
		{
			ctx.fillStyle=onFillColor;
		}else{
			ctx.fillStyle="#FFF";
		}
		ctx.rect(realX*(canvasW/squaresPerBoard), realY*(canvasW/squaresPerBoard), (canvasW/squaresPerBoard), (canvasH/squaresPerBoard));
		ctx.fill();
	}

	function redrawBoard(){

		if(isPlaying == false)
		{
			clearInterval(stepInterval);
			return false;
		}

		drawBoard();
	}

	function stopPlayback(){
			isPlaying = false;
			document.getElementById("playpause").innerHTML = "Play";
			clearInterval(stepInterval);
	}

	function clickedPlayPause(){

		//redraw tiles over and over. 
		if(isPlaying)
		{
			stopPlayback();
		}else
		{
			isPlaying = true;
			document.getElementById("playpause").innerHTML = "Pause";
			//start timer
			stepInterval = setInterval(redrawBoard, stepDelay);
		}
	}


	function clickedClear(){
		
		stopPlayback();
		clearTiles();
		clearBoard();
		drawGrid();
	}
	function clickedFaster(){
		
		console.log("clickedFaster");
	}
	function clickedSlower(){
		
		console.log("clickedSlower");
	}
	function clickedZoomOut(){
		
		console.log("clickedZoomOut");
	}
	function clickedZoomIn(){
		
		console.log("clickedZoomIn");
	}




	function main () {
		var c; 
		c = document.getElementById("game-of-life");
		ctx = c.getContext("2d");

		populateBoard(squaresPerBoard, squaresPerBoard);
		drawGrid(ctx);

		document.getElementById("game-of-life").addEventListener("click", clickedCanvas, false);
		document.getElementById("playpause").addEventListener("click", clickedPlayPause, false);
		document.getElementById("clear").addEventListener("click", clickedClear, false);
		document.getElementById("faster").addEventListener("click", clickedFaster, false);
		document.getElementById("slower").addEventListener("click", clickedSlower, false);
		document.getElementById("zoom-out").addEventListener("click", clickedZoomOut, false);
		document.getElementById("zoom-in").addEventListener("click", clickedZoomIn, false);
	}

  window.onload = main;

}());