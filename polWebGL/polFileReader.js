//************************************************************************
//POL is a file type difined by polarskie, which is aimed at finding a bridge between obj file and WebGL. To use this file and //the converting exporter in any conversial field involves RIGHT problem, please contact polarskie before you or your team use //them for any purpose except for learning, also when you have any question or Improvement.
//Email: 944232369@qq.com


var polMeshArray = new Array();
var polObjArray = new Array();

function box()
{
	var xo,xi,yo,yi,zo,zi;
}

function handleLoadedPolFile(data, index) {
        var lines = data.split("\n");
		var vals = lines[0].replace(/^\s+/, "").split(/\s+/);
		polMeshArray[index].renderOp = vals[0];
        var vertexPositions = [];
        var vertexTextureCoords = [];
	  	var vertexNormalDirection = [];
		var vertexColor = [];
	  	var vertexIndex = [];
		//polMeshArray[index].geometryColor = [];
		//polMeshArray[index].textureAddress = [];
        var i=1;
            var vals = lines[i++].replace(/^\s+/, "").split(/\s+/);
			polMeshArray[index].originalBox.xo=vals[0];
			polMeshArray[index].originalBox.xi=vals[0];
			polMeshArray[index].originalBox.yo=vals[1];
			polMeshArray[index].originalBox.yi=vals[1];
			polMeshArray[index].originalBox.zo=vals[2];
			polMeshArray[index].originalBox.zi=vals[2];
            while (vals.length > 1 && vals[0] != "//") {
				if(vals[0]<polMeshArray[index].originalBox.xo)
					polMeshArray[index].originalBox.xo=vals[0];
				if(vals[0]>polMeshArray[index].originalBox.xi)
					polMeshArray[index].originalBox.xi=vals[0];
				if(vals[1]<polMeshArray[index].originalBox.yo)
					polMeshArray[index].originalBox.yo=vals[1];
				if(vals[1]>polMeshArray[index].originalBox.yi)
					polMeshArray[index].originalBox.yi=vals[1];
				if(vals[2]<polMeshArray[index].originalBox.zo)
					polMeshArray[index].originalBox.zo=vals[2];
				if(vals[2]>polMeshArray[index].originalBox.zi)
					polMeshArray[index].originalBox.zi=vals[2];
                // It is a line describing a vertex; get X, Y and Z first
                vertexPositions.push(parseFloat(vals[0]));
                vertexPositions.push(parseFloat(vals[1]));
                vertexPositions.push(parseFloat(vals[2]));
                // And then the texture coords
                vertexTextureCoords.push(parseFloat(vals[3]));
                vertexTextureCoords.push(parseFloat(vals[4]));
		    	// Normal direction now
		    	vertexNormalDirection.push(parseFloat(vals[5]));
                vertexNormalDirection.push(parseFloat(vals[6]));
                vertexNormalDirection.push(parseFloat(vals[7]));
				
				vals = lines[i++].replace(/^\s+/, "").split(/\s+/);
            }
			var geometryNum=0;
			while(i<lines.length-2)
			{
				vals = lines[i++].replace(/^\s+/, "").split(/\s+/);
				polMeshArray[index].textureAddress[geometryNum] = vals[0]
				vals = lines[i++].replace(/^\s+/, "").split(/\s+/);
				polMeshArray[index].geometryColor[geometryNum]=[]
				polMeshArray[index].geometryColor[geometryNum].push(parseFloat(vals[0]));
                polMeshArray[index].geometryColor[geometryNum].push(parseFloat(vals[1]));
                polMeshArray[index].geometryColor[geometryNum].push(parseFloat(vals[2]));
				vals = lines[i++].replace(/^\s+/, "").split(/\s+/);
				vertexIndex[geometryNum]=[];
				while(vals.length == 4 && vals[0] != "//") {
                	// The three indexes of the triangle face
                	vertexIndex[geometryNum].push(parseFloat(vals[0]));
                	vertexIndex[geometryNum].push(parseFloat(vals[1]));
                	vertexIndex[geometryNum].push(parseFloat(vals[2]));
					vals = lines[i++].replace(/^\s+/, "").split(/\s+/);

            	}
				
				++geometryNum;
			}
			polMeshArray[index].geometryNum=geometryNum;
		
		
        //pol["vertexPositionBuffer"] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[index].vertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW);
        polMeshArray[index].vertexPositionBuffer.itemSize = 3;
        polMeshArray[index].vertexPositionBuffer.numItems = vertexPositions.length/3;
		
        //polMeshArray[index].textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[index].textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTextureCoords), gl.STATIC_DRAW);
        polMeshArray[index].textureCoordBuffer.itemSize = 2;
        polMeshArray[index].textureCoordBuffer.numItems = vertexTextureCoords.length/2;
		
		//pol["normalDirectionBuffer"] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[index].normalDirectionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormalDirection), gl.STATIC_DRAW);
        polMeshArray[index].normalDirectionBuffer.itemSize = 3;
        polMeshArray[index].normalDirectionBuffer.numItems = vertexNormalDirection.length/3;
		
        //document.getElementById("loadingtext").textContent = "";
		for(var j in vertexIndex)
		{
			polMeshArray[index].indexReferBuffer[j] = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polMeshArray[index].indexReferBuffer[j]);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndex[j]), gl.STATIC_DRAW);
			polMeshArray[index].indexReferBuffer[j].itemSize = 1;
        	polMeshArray[index].indexReferBuffer[j].numItems = vertexIndex[j].length;
		}
};

function PolMesh(shader)									//object that only describe the shape
{
	this.renderOp;											//render option
	this.geometryColor=[];									//every mesh can include many geometries, their colours
	this.textureAddress=[];									//their textures
	this.vertexPositionBuffer=gl.createBuffer();			//
	this.textureCoordBuffer=gl.createBuffer();
	this.normalDirectionBuffer=gl.createBuffer();
	this.polTexture=new Array();
	
	this.shaderIndex=shader;
	
	this.indexReferBuffer=new Array();
	this.geometryNum=0;
	
	this.originalBox = new box();
}

function polObject(meshIndex, shader)						//object that describe every aspect of our mesh
{
	this.visible=true;
	this.pickable=true;
	this.polMeshIndex = meshIndex;
	
	this.shaderIndex=shader;
	this.secondShader=new Array();
	
	this.ambientColor = [1.0, 1.0, 1.0];
	this.lightColor = new Array();
	this.lightAssist = new Array();
	this.lightStyle = new Array();
	this.lightNum = 0;
	
	this.transformMatrix = new polMat();
	this.aimMatrix = new polMat();
	this.aimRotX;
	this.aimRotY;
	this.aimRotZ;
	this.aimRotRad;
	this.oldMatrix = new polMat();
	this.moving = false;
	this.rotOp = false;
	this.patern;
	this.elapsed;
	this.totalTime;
	
	this.rotating = false;
	this.rotateAxisX;
	this.rotateAxisY;
	this.rotateAxisZ;
	this.radPerMSec;
}

function AppendPolMesh(fileName,shader,map)
{
	if(arguments.length==2)
	{
		map=0;
	}
	var index = polMeshArray.length;
	polMeshArray[index] = new PolMesh(shader);
	var request;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		request=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		request=new ActiveXObject("Microsoft.XMLHTTP");
	}
	request.open("GET", fileName+".pol");
    request.onreadystatechange = function () {		//this temp function will be called when the request is done
		if (request.readyState == 4) {
            handleLoadedPolFile(request.responseText,index);
            handleTexture(index,0);
			if(map!=0)
			{		
				aMapData=new mapDataObject(0,128);
				aMapData.initialize();
			}
        }
    }
    request.send();						//send a request to create a new thread
	return polMeshArray.length-1;
};

function AppendPolObject(meshIndex,shader)
{
	if(arguments.length==2)
	{
		var temp = new polObject(meshIndex,shader);
		polObjArray.push(temp);
		return polObjArray.length-1;
	}
	else
	{
		var temp = new polObject(meshIndex,polMeshArray[meshIndex].shaderIndex);
		polObjArray.push(temp);
		return polObjArray.length-1;
	}
}

//pay attention here!!!!!!!!!!!!!
function handleLoadedTexture(texture, ri, rii) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.bindTexture(gl.TEXTURE_2D, null);
		handleTexture(ri, rii);
};
	
function handleTexture(index, iindex)			//this is a Recursive function
{
	//this.polData["polTexture"] = [];
	if(iindex == polMeshArray[index].textureAddress.length) return;		//all the textures are loaded
	if(polMeshArray[index].textureAddress[iindex]!="null")
		{
			
			polMeshArray[index].polTexture[iindex] = gl.createTexture();
			polMeshArray[index].polTexture[iindex].image = new Image();
        	polMeshArray[index].polTexture[iindex].image.onload = function () {
            	handleLoadedTexture(polMeshArray[index].polTexture[iindex],index,iindex+1);
        	}
        	polMeshArray[index].polTexture[iindex].image.src = polMeshArray[index].textureAddress[iindex];
			
		}
	else handleTexture(index, iindex+1);
};


//type == 2 -> point    type == 1 -> parallel
polObject.prototype.addLight = function(type, color, assist)
{
	if(this.lightColor.length==15) return;
	if(type == 1)
	{
		this.lightNum++;
		this.lightStyle.push(1);
		this.lightColor.push(color[0]);
		this.lightColor.push(color[1]);
		this.lightColor.push(color[2]);
		var truth = assist[0]*assist[0]+assist[1]*assist[1]+assist[2]*assist[2];
		truth = -Math.sqrt(truth);
		assist[0] /=truth;
		assist[1] /=truth;
		assist[2] /=truth;
		this.lightAssist.push(assist[0]);
		this.lightAssist.push(assist[1]);
		this.lightAssist.push(assist[2]);
	}
	else
	{
		this.lightNum++;
		this.lightStyle.push(2);
		this.lightColor.push(color[0]);
		this.lightColor.push(color[1]);
		this.lightColor.push(color[2]);
		this.lightAssist.push(assist[0]);
		this.lightAssist.push(assist[1]);
		this.lightAssist.push(assist[2]);
	}
}

polObject.prototype.translateBy = function(bx,by,bz,time)
{
	this.rotOp = false;
	this.moving=true;
	this.oldMatrix=this.transformMatrix.copy();
	this.aimMatrix=this.transformMatrix.copy();
	this.aimMatrix.translateBy(bx,by,bz);
	this.elapsed=0.0;
	this.totalTime=time;
}

polObject.prototype.translateTo = function(tx,ty,tz,time)
{
	this.rotOp = false;
	this.moving=true;
	this.oldMatrix=this.transformMatrix.copy();
	this.aimMatrix=this.transformMatrix.copy();
	this.aimMatrix.translateTo(tx,ty,tz);
	this.elapsed=0.0;
	this.totalTime=time;
}

polObject.prototype.rotateXBy = function(rad,time)
{
	this.rotOp = true;
	this.moving=true;
	this.oldMatrix=this.transformMatrix.copy();
	this.aimRotX=1;
	this.aimRotY=0;
	this.aimRotZ=0;
	this.aimRotRad=rad;
	this.elapsed=0.0;
	this.totalTime=time;
}

polObject.prototype.rotateYBy = function(rad,time)
{
	this.rotOp = true;
	this.moving=true;
	this.oldMatrix=this.transformMatrix.copy();
	this.aimRotX=0;
	this.aimRotY=1;
	this.aimRotZ=0;
	this.aimRotRad=rad;
	this.elapsed=0.0;
	this.totalTime=time;
}

polObject.prototype.rotateZBy = function(rad,time)
{
	this.rotOp = true;
	this.moving=true;
	this.oldMatrix=this.transformMatrix.copy();
	this.aimRotX=0;
	this.aimRotY=0;
	this.aimRotZ=1;
	this.aimRotRad=rad;
	this.elapsed=0.0;
	this.totalTime=time;
}

polObject.prototype.rotateAxisBy = function(rx,ry,rz,rad,time)
{
	this.rotOp = true;
	this.moving=true;
	this.oldMatrix=this.transformMatrix.copy();
	this.aimRotX=rx;
	this.aimRotY=ry;
	this.aimRotZ=rz;
	this.aimRotRad=rad;
	this.elapsed=0.0;
	this.totalTime=time;
}
/*
polObject.prototype.rotateAxisTo = function(rx,ry,rz,time)
{
	this.moving=true;
	this.oldMatrix=this.transformMatrix.copy();
	this.aimMatrix=this.transformMatrix.copy();
	this.aimMatrix.rotateAxisTo(rx,ry,rz);
	this.elapsed=0.0;
	this.totalTime=time;
}
*/
polObject.prototype.resizeBy = function(bx,by,bz,time)
{
	this.rotOp = false;
	this.moving=true;
	this.oldMatrix=this.transformMatrix.copy();
	this.aimMatrix=this.transformMatrix.copy();
	this.aimMatrix.resizeBy(bx,by,bz);
	this.elapsed=0.0;
	this.totalTime=time;
}

polObject.prototype.resizeTo = function(tx,ty,tz,time)
{
	this.rotOp = false;
	this.moving=true;
	this.oldMatrix=this.transformMatrix.copy();
	this.aimMatrix=this.transformMatrix.copy();
	this.aimMatrix.resizeTo(tx,ty,tz);
	this.elapsed=0.0;
	this.totalTime=time;
}

//No rotating!!!
polObject.prototype.multiTransform = function(matrix,time)
{
	this.rotOp = false;
	this.moving=true;
	this.oldMatrix=this.transformMatrix.copy();
	this.aimMatrix=this.transformMatrix.copy();
	this.aimMatrix.append(matrix);
	this.elapsed=0.0;
	this.totalTime=time;
};

polObject.prototype.setRotating = function(rx,ry,rz,radPerMSecond)
{
	if(radPerMSecond==0)
	{
		this.rotating=false;
		this.rotateAxisX=null;
		this.rotateAxisY=null;
		this.rotateAxisZ=null;
		this.radPerMSec=null;
	}
	else
	{
		this.rotating=true;
		this.rotateAxisX=rx;
		this.rotateAxisY=ry;
		this.rotateAxisZ=rz;
		this.radPerMSec=radPerMSecond;
	}
};

polObject.prototype.hide = function(op)
{
	if(op) this.visible=false;
	else this.visible=true;
}