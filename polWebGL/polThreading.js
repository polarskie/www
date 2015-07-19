//************************************************************************
//POL is a file type difined by polarskie, which is aimed at finding a bridge between obj file and WebGL. To use this file and //the converting exporter in any conversial field involves RIGHT problem, please contact polarskie before you or your team use //them for any purpose except for learning, also when you have any question or improvement.
//Email: 944232369@qq.com

var globalTime;
var globalElapsedTime;
var startTime=new Date().getTime();
var cycles=0;

var threadFunctionArray=new Array(0);

function polFunctionObj()
{
	this.func;
	this.lifeSpan;
	this.killCode;
	this.parameter;
}

function appendThreadFunction(f,KC,para,LS)
{
	if(arguments.length<4)
	{
		LS=-100000;
	}
	if(arguments.length<3)
	{
		para=null;
	}
	if(arguments.length<2)
	{
		KC='true';
	}
	var temp = new polFunctionObj();
	temp.func=f;
	temp.lifeSpan=LS;
	temp.killCode=KC;
	temp.parameter=para;
	threadFunctionArray.push(temp);
	return threadFunctionArray.length-1;
}

function polThread() {
    requestAnimationFrame(polThread);
	handleTimer();
    polAnimate();
	polMain();
	polFunction();
	//if(polShadowFramebuffer!=null) polShadow();
	polDraw();
	cycles++;
}

function handleTimer()
{
	if(globalTime==null) globalTime=new Date().getTime();
	var nowTime=new Date().getTime();
	globalElapsedTime=nowTime-globalTime;
	globalTime=nowTime;
	if(cycles%30==0)
	document.getElementById("fps").innerHTML="FPS:"+1000.0/globalElapsedTime;
}

function polAnimate()
{
	for(var i in polObjArray)
	{
		if(polObjArray[i].moving)
		{
			polObjArray[i].elapsed+=globalElapsedTime;
			if(polObjArray[i].elapsed>polObjArray[i].totalTime)
			{
				if(polObjArray[i].rotOp)
				{
					polObjArray[i].transformMatrix=polObjArray[i].oldMatrix.copy();
					polObjArray[i].transformMatrix.rotateAxisBy(polObjArray[i].aimRotX,polObjArray[i].aimRotY,
																polObjArray[i].aimRotZ,polObjArray[i].aimRotRad);
				}
				else
				{
					polObjArray[i].transformMatrix=polObjArray[i].aimMatrix.copy();
				}
				polObjArray[i].aimMatrix=null;
				polObjArray[i].oldMatrix=null;
				polObjArray[i].moving=false;
				polObjArray[i].rotOp=false;
			}
			else if(!polObjArray[i].rotOp)
			{
				polObjArray[i].transformMatrix=matInterpolation(polObjArray[i].elapsed/polObjArray[i].totalTime,
																polObjArray[i].aimMatrix,polObjArray[i].oldMatrix);
			}
			else
			{
				if(polObjArray[i].aimRotY==0&&polObjArray[i].aimRotZ==0)
				{
					polObjArray[i].transformMatrix=polObjArray[i].oldMatrix.copy();
					polObjArray[i].transformMatrix.rotateXBy(polObjArray[i].aimRotRad*polObjArray[i].elapsed/polObjArray[i].totalTime);
				}
				else if(polObjArray[i].aimRotX==0&&polObjArray[i].aimRotZ==0)
				{
					polObjArray[i].transformMatrix=polObjArray[i].oldMatrix.copy();
					polObjArray[i].transformMatrix.rotateYBy(polObjArray[i].aimRotRad*polObjArray[i].elapsed/polObjArray[i].totalTime);
				}
				else if(polObjArray[i].aimRotX==0&&polObjArray[i].aimRotY==0)
				{
					polObjArray[i].transformMatrix=polObjArray[i].oldMatrix.copy();
					polObjArray[i].transformMatrix.rotateZBy(polObjArray[i].aimRotRad*polObjArray[i].elapsed/polObjArray[i].totalTime);
				}
				else
				{
					polObjArray[i].transformMatrix=polObjArray[i].oldMatrix.copy();
					polObjArray[i].transformMatrix.rotateAxisBy(polObjArray[i].aimRotX,polObjArray[i].aimRotY,
								polObjArray[i].aimRotZ,polObjArray[i].aimRotRad*polObjArray[i].elapsed/polObjArray[i].totalTime);
				}
			}
		}
		else if(polObjArray[i].rotating)
		{
			polObjArray[i].transformMatrix.rotateAxisBy(polObjArray[i].rotateAxisX,polObjArray[i].rotateAxisY,
														polObjArray[i].rotateAxisZ,polObjArray[i].radPerMSec*globalElapsedTime);
		}
	}
}


function polFunction()
{
	for(var i in threadFunctionArray)
	{
		while(i<threadFunctionArray.length)
		{
			threadFunctionArray[i].lifeSpan-=globalElapsedTime;
			if((threadFunctionArray[i].lifeSpan<0&&threadFunctionArray[i].lifeSpan>-10000)||eval(threadFunctionArray[i].killCode)) threadFunctionArray.splice(i,1);
			else break;
		}
		if(i>=threadFunctionArray.length) break;
		if(threadFunctionArray[i].parameter)
		{
			
			threadFunctionArray[i].func(threadFunctionArray[i].parameter);
		}
		else threadFunctionArray[i].func();
	}
}

function polDraw()
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //pMatrix = matProject(MACROangle, gl.widthDivHeight, MACROnearest, MACROfarest);
	for(var i in polObjArray)
	{
		if(polObjArray[i].visible)
			drawPol(i,polObjArray[i].shaderIndex);
	}
}

function polPick(mouseX, mouseY)
{
	gl.bindFramebuffer(gl.FRAMEBUFFER, polFramebuffer);
    gl.viewport(0, 0, polFramebuffer.width, polFramebuffer.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //pMatrix = matProject(MACROangle, gl.widthDivHeight, MACROnearest, MACROfarest);
	for(var i in polObjArray)
	{
		if(polObjArray[i].pickable)
		{
			drawPolPick(i);
		}
	}
	var pickBuf = new Uint8Array(polFramebuffer.pixelNum*4);
    gl.readPixels(0, 0, polFramebuffer.width, polFramebuffer.height, gl.RGBA, gl.UNSIGNED_BYTE, pickBuf);
	//for(var i = 0;i<polFramebuffer.pixelNum*4;++i) document.write(pickBuf[i]+' ');
	/*
	for(var i = 0;i<polFramebuffer.precisoin;++i)
	{
		for(var j = 0;j<polFramebuffer.precisoin;++j)
		{
			document.write(pickBuf[(i*polFramebuffer.precisoin+j)*4]+' '+pickBuf[(i*polFramebuffer.precisoin+j)*4+1]+' '+pickBuf[(i*polFramebuffer.precisoin+j)*4+2]+' '+pickBuf[(i*polFramebuffer.precisoin+j)*4+3]+' 11111111111 ')
		}
		document.write('---------------------');
	}
	*/
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	return pickBuf[(parseInt(mouseX/polFramebuffer.propotion)+parseInt((gl.viewportHeight-mouseY-1)/polFramebuffer.propotion)*polFramebuffer.width)*4]-1;
}




var polFramebuffer;
var polFrameTexbuffer;
var polFrameDepthbuffer;
var polPickProgram;

    function polInitFramebuffer(propotion) {
        polFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, polFramebuffer);
		polFramebuffer.propotion=propotion;
		polFramebuffer.width=parseInt(gl.viewportWidth/propotion);
		polFramebuffer.height=parseInt(gl.viewportHeight/propotion);
		polFramebuffer.texPixs = parseInt(Math.max(polFramebuffer.width,polFramebuffer.height));
		polFramebuffer.pixelNum = parseInt(polFramebuffer.width*polFramebuffer.height);

        polFrameTexbuffer = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, polFrameTexbuffer);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, polFramebuffer.texPixs, polFramebuffer.texPixs, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        polFrameDepthbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, polFrameDepthbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, polFramebuffer.texPixs, polFramebuffer.texPixs);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, polFrameTexbuffer, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, polFrameDepthbuffer);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		
		
		var fragmentShader = getShader(gl, "pickShader-fs");
        var vertexShader = getShader(gl, "pickShader-vs");

        polPickProgram = gl.createProgram();
        gl.attachShader(polPickProgram, fragmentShader);
        gl.attachShader(polPickProgram, vertexShader);
        gl.linkProgram(polPickProgram);

        if (!gl.getProgramParameter(polPickProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(polPickProgram);

        polPickProgram.vertexPositionAttribute = gl.getAttribLocation(polPickProgram, "aVertexPosition");
        gl.enableVertexAttribArray(polPickProgram.vertexPositionAttribute);
        polPickProgram.textureCoordAttribute = gl.getAttribLocation(polPickProgram, "aTextureCoord");
        gl.enableVertexAttribArray(polPickProgram.textureCoordAttribute);
        polPickProgram.vertexNormalAttribute = gl.getAttribLocation(polPickProgram, "aVertexNormal");
        gl.enableVertexAttribArray(polPickProgram.vertexNormalAttribute);
		
		
        polPickProgram.pMatrixUniform = gl.getUniformLocation(polPickProgram, "uPMatrix");
        polPickProgram.mvMatrixUniform = gl.getUniformLocation(polPickProgram, "uMVMatrix");
        polPickProgram.polObjIndexUniform = gl.getUniformLocation(polPickProgram, "uPolObjIndex");
    }
	
function drawPolPick(polObjIndex)
{
	gl.useProgram(polPickProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].vertexPositionBuffer);
    gl.vertexAttribPointer(polPickProgram.vertexPositionAttribute, polMeshArray[polObjArray[polObjIndex].polMeshIndex].vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].normalDirectionBuffer);
    gl.vertexAttribPointer(polPickProgram.vertexNormalAttribute, polMeshArray[polObjArray[polObjIndex].polMeshIndex].normalDirectionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
    gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].textureCoordBuffer);
    gl.vertexAttribPointer(polPickProgram.textureCoordAttribute, polMeshArray[polObjArray[polObjIndex].polMeshIndex].textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
    gl.uniformMatrix4fv(polPickProgram.pMatrixUniform, false, polCameraArray[polCameraArray.tempCam].pMatrix.toArray());
	
    var finalMvMatrix = polCameraArray[polCameraArray.tempCam].rotMatrix.mul(polCameraArray[polCameraArray.tempCam].posMatrix.mul(polObjArray[polObjIndex].transformMatrix.mat));
        gl.uniformMatrix4fv(polPickProgram.mvMatrixUniform, false, 
								finalMvMatrix.toArray());
	
	var t = (parseInt(polObjIndex)+1)/256.0;
	gl.uniform1f(polPickProgram.polObjIndexUniform, t);
	
	for(var i=0;i<polMeshArray[polObjArray[polObjIndex].polMeshIndex].geometryNum;++i)
	{
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].indexReferBuffer[i]);
    	gl.drawElements(gl.TRIANGLES, polMeshArray[polObjArray[polObjIndex].polMeshIndex].indexReferBuffer[i].numItems, gl.UNSIGNED_SHORT, 0);
	}
}