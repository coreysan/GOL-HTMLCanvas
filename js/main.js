

var board;
var canvas_w = 512;
var canvas_h = 512;
var squares_per_canvas = 32;

window.onload = main;

function main() {
	var c = document.getElementById("game-of-life");
	debugger;
	var ctx = c.getContext("2d");


	drawGrid(ctx);
}

function drawGrid(ctx)
{

	ctx.strokeStyle="#ddd";

  for(var i = 0; i < canvas_w; i+= (canvas_w/squares_per_canvas))
  {
		ctx.moveTo(i-0.5,0-0.5);//draw vertical line
		ctx.lineTo(i-0.5,canvas_h-0.5);
		ctx.stroke();

		ctx.moveTo(0-0.5,i-0.5);//horizontal line
		ctx.lineTo(canvas_w-0.5,i-0.5);
		ctx.stroke();
  }
}
