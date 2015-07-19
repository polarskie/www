//************************************************************************
//POL is a file type difined by polarskie, which is aimed at finding a bridge between obj file and WebGL. To use this file and //the converting exporter in any conversial field involves RIGHT problem, please contact polarskie before you or your team use //them for any purpose except for learning, also when you have any question or improvement.
//Email: 944232369@qq.com


var polMapFramebuffer;
var polMapFrameTexbuffer;
var polMapFrameDepthbuffer;
var polMapProgram;
function polInitMapFramebuffer(width) {
        polMapFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, polMapFramebuffer);
		polMapFramebuffer.width=width;
		polMapFramebuffer.texPixs = width;
		polMapFramebuffer.pixelNum = width*width;

        polMapFrameTexbuffer = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, polMapFrameTexbuffer);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, polMapFramebuffer.texPixs, polMapFramebuffer.texPixs, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        polMapFrameDepthbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, polMapFrameDepthbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, polMapFramebuffer.texPixs, polMapFramebuffer.texPixs);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, polMapFrameTexbuffer, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, polMapFrameDepthbuffer);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		
		
		var fragmentShader = getShader(gl, "mapShader-fs");
        var vertexShader = getShader(gl, "mapShader-vs");

        polMapProgram = gl.createProgram();
        gl.attachShader(polMapProgram, fragmentShader);
        gl.attachShader(polMapProgram, vertexShader);
        gl.linkProgram(polMapProgram);

        if (!gl.getProgramParameter(polMapProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(polMapProgram);

        polMapProgram.vertexPositionAttribute = gl.getAttribLocation(polMapProgram, "aVertexPosition");
        gl.enableVertexAttribArray(polMapProgram.vertexPositionAttribute);
		
        polMapProgram.textureCoordAttribute = gl.getAttribLocation(polMapProgram, "aTextureCoord");
        gl.enableVertexAttribArray(polMapProgram.textureCoordAttribute);
        polMapProgram.vertexNormalAttribute = gl.getAttribLocation(polMapProgram, "aVertexNormal");
        gl.enableVertexAttribArray(polMapProgram.vertexNormalAttribute);
		/*
		
        polMapProgram.pMatrixUniform = gl.getUniformLocation(polMapProgram, "uPMatrix");
        polMapProgram.mvMatrixUniform = gl.getUniformLocation(polMapProgram, "uMVMatrix");
        polMapProgram.polObjIndexUniform = gl.getUniformLocation(polMapProgram, "uPolObjIndex");
		*/
		polMapProgram.mapLowest = gl.getUniformLocation(polMapProgram, "uLowest");
		polMapProgram.mapHeight = gl.getUniformLocation(polMapProgram, "uHeight");
		polMapProgram.mapAxis   = gl.getUniformLocation(polMapProgram, "uAxis");
    }
	
function drawPolMap(meshIndex)
{
	gl.useProgram(polMapProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[meshIndex].vertexPositionBuffer);
    gl.vertexAttribPointer(polMapProgram.vertexPositionAttribute, polMeshArray[meshIndex].vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[meshIndex].normalDirectionBuffer);
    gl.vertexAttribPointer(polMapProgram.vertexNormalAttribute, polMeshArray[meshIndex].normalDirectionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
    gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[meshIndex].textureCoordBuffer);
    gl.vertexAttribPointer(polMapProgram.textureCoordAttribute, polMeshArray[meshIndex].textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.uniform1f(polMapProgram.mapLowest, polMeshArray[meshIndex].originalBox.yo);
	gl.uniform1f(polMapProgram.mapHeight, polMeshArray[meshIndex].originalBox.yi-polMeshArray[meshIndex].originalBox.yo);
	gl.uniform1f(polMapProgram.mapAxis, Math.max(polMeshArray[meshIndex].originalBox.xi-polMeshArray[meshIndex].originalBox.xo,polMeshArray[meshIndex].originalBox.zi-polMeshArray[meshIndex].originalBox.zo));
	
	for(var i=0;i<polMeshArray[meshIndex].geometryNum;++i)
	{
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polMeshArray[meshIndex].indexReferBuffer[i]);
    	gl.drawElements(gl.TRIANGLES, polMeshArray[meshIndex].indexReferBuffer[i].numItems, gl.UNSIGNED_SHORT, 0);
	}
}

function mapDataObject(polMeshIndex,devision)
{
	this.meshIndex = polMeshIndex;
	this.width = devision;
	this.dataArray = new Array();
	this.height = polMeshArray[this.meshIndex].originalBox.yi-polMeshArray[this.meshIndex].originalBox.yo;
}

mapDataObject.prototype.initialize = function()
{
	polInitMapFramebuffer(this.width);
	gl.bindFramebuffer(gl.FRAMEBUFFER, polMapFramebuffer);
    gl.viewport(0, 0, polMapFramebuffer.width, polMapFramebuffer.width);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //pMatrix = matProject(MACROangle, gl.widthDivHeight, MACROnearest, MACROfarest);
	drawPolMap(this.meshIndex);
	var mapBuf = new Uint8Array(polMapFramebuffer.pixelNum*4);
    gl.readPixels(0, 0, polMapFramebuffer.width, polMapFramebuffer.width, gl.RGBA, gl.UNSIGNED_BYTE, mapBuf);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	for(var i=0;i<polMapFramebuffer.pixelNum;i++)
	{
		this.dataArray.push(parseFloat(mapBuf[i*4])/255*this.height + polMeshArray[this.meshIndex].originalBox.yo);
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}