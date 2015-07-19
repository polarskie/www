// JavaScript Document
var pol2DObjArray = new Array();

function pol2DObj(offsetX, offsetY, width, height)
{
	this.offsetX=offsetX;
	this.offsetY=offsetY;
	this.width=width;
	this.height=height;
}

function appendPol2DObj(offsetX, offsetY, width, height)
{
	pol2DObjArray.push(new pol2DObj(offsetX, offsetY, width, height));
	return pol2DObjArray.length-1;
}

function writeText(text,xCoord,yCoord)
{
	specialGl.font="15px Georgia";
	var width = specialGl.measureText(text).width;
	var xOff = 0;
	var yOff = 0;
	if(yCoord>gl.viewportHeight - 25) yOff = 45;
	if(xCoord>gl.viewportWidth - width -16) xOff = width + 16;
	var imgData=specialGl.createImageData(specialGl.measureText(text).width + 16,25);
	for (var i=0;i<imgData.data.length;i+=4)
 	{
    	imgData.data[i+0]=0;
  		imgData.data[i+1]=88;
  		imgData.data[i+2]=220;
  		imgData.data[i+3]=222;
  	}
	specialGl.putImageData(imgData,xCoord-xOff,yCoord-yOff);
	specialGl.fillText(text,xCoord-xOff+8,yCoord-yOff+19);
	return appendPol2DObj(xCoord-xOff,yCoord-yOff,width + 16,25);
}

function clearPol2DObj(pol2DObjIndex)
{
	var imgData=specialGl.createImageData(pol2DObjArray[pol2DObjIndex].width,pol2DObjArray[pol2DObjIndex].height);
	for (var i=0;i<imgData.data.length;i+=4)
 	{
    	imgData.data[i+0]=0;
  		imgData.data[i+1]=0;
  		imgData.data[i+2]=0;
  		imgData.data[i+3]=0;
  	}
	specialGl.putImageData(imgData,pol2DObjArray[pol2DObjIndex].offsetX,pol2DObjArray[pol2DObjIndex].offsetY);
	pol2DObjArray.splice(pol2DObjIndex);
}