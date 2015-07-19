var polShadowFramebuffer;
var polShadowFrameTexbuffer;
var polShadowFrameDepthbuffer;
var polShadowProgram;
var polShadowingLight;

function polLightShadowObj(x, y, z, type)
{
	this.attibute = new Vector(x, y, z);
	this.type = type;
	this.matrix = new Matrix();
	if(type == 1)
	{
	}
	else if(type == 2)
	{
		this.matrix.m14=-x;
		this.matrix.m24=-y;
		this.matrix.m34=-z;
	}
}

function polShadow()
{
	gl.bindFramebuffer(gl.FRAMEBUFFER, polShadowFramebuffer);
    gl.viewport(0, 0, polShadowFramebuffer.width, polShadowFramebuffer.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //pMatrix = matProject(MACROangle, gl.widthDivHeight, MACROnearest, MACROfarest);
	for(var i in polObjArray)
	{
		if(polObjArray[i].shadowing)
		{
			drawPolShadowMap(i);
		}
	}
	//var pickBuf = new Uint8Array(polFramebuffer.pixelNum*4);
    //gl.readPixels(0, 0, polFramebuffer.width, polFramebuffer.height, gl.RGBA, gl.UNSIGNED_BYTE, pickBuf);
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
}

    function polInitShadowFramebuffer(precision) {
        polShadowFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, polShadowFramebuffer);
		polShadowFramebuffer.precision=precision;
		polShadowFramebuffer.width=parseInt(gl.viewportWidth*precision);
		polShadowFramebuffer.height=parseInt(gl.viewportHeight*precision);
		polShadowFramebuffer.texPixs = parseInt(Math.max(polShadowFramebuffer.width,polShadowFramebuffer.height));
		polShadowFramebuffer.pixelNum = parseInt(polShadowFramebuffer.width*polShadowFramebuffer.height);

        polShadowFrameTexbuffer = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, polShadowFrameTexbuffer);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, polShadowFramebuffer.texPixs, polShadowFramebuffer.texPixs, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        polShadowFrameDepthbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, polShadowFrameDepthbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, polShadowFramebuffer.texPixs, polShadowFramebuffer.texPixs);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, polShadowFrameTexbuffer, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, polShadowFrameDepthbuffer);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		
		
		var fragmentShader = getShader(gl, "shadowMapShader-fs");
        var vertexShader = getShader(gl, "shadowMapShader-vs");

        polShadowProgram = gl.createProgram();
        gl.attachShader(polShadowProgram, fragmentShader);
        gl.attachShader(polShadowProgram, vertexShader);
        gl.linkProgram(polShadowProgram);

        if (!gl.getProgramParameter(polShadowProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(polShadowProgram);

        polShadowProgram.vertexPositionAttribute = gl.getAttribLocation(polShadowProgram, "aVertexPosition");
        gl.enableVertexAttribArray(polShadowProgram.vertexPositionAttribute);
        polShadowProgram.textureCoordAttribute = gl.getAttribLocation(polShadowProgram, "aTextureCoord");
        gl.enableVertexAttribArray(polShadowProgram.textureCoordAttribute);
        polShadowProgram.vertexNormalAttribute = gl.getAttribLocation(polShadowProgram, "aVertexNormal");
        gl.enableVertexAttribArray(polShadowProgram.vertexNormalAttribute);
		
		
        polShadowProgram.pMatrixUniform = gl.getUniformLocation(polShadowProgram, "uPMatrix");
        polShadowProgram.mvMatrixUniform = gl.getUniformLocation(polShadowProgram, "uMVMatrix");
		
		polShadowProgram.pMatrix = matProject(45, 1, 0.1, polCameraArray[polCameraArray.tempCam].farest);
    }
	
function drawPolShadowMap(polObjIndex)
{
	gl.useProgram(polShadowProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].vertexPositionBuffer);
    gl.vertexAttribPointer(polShadowProgram.vertexPositionAttribute, polMeshArray[polObjArray[polObjIndex].polMeshIndex].vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].normalDirectionBuffer);
    gl.vertexAttribPointer(polShadowProgram.vertexNormalAttribute, polMeshArray[polObjArray[polObjIndex].polMeshIndex].normalDirectionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
    gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].textureCoordBuffer);
    gl.vertexAttribPointer(polShadowProgram.textureCoordAttribute, polMeshArray[polObjArray[polObjIndex].polMeshIndex].textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.uniformMatrix4fv(shaderProgram[shaderIndex].pMatrixUniform, false, polCameraArray[polCameraArray.tempCam].pMatrix.toArray());
	
    var finalMvMatrix = polShadowingLight.matrix.mul(polObjArray[polObjIndex].transformMatrix.mat);
    gl.uniformMatrix4fv(polShadowProgram.mvMatrixUniform, false, finalMvMatrix.toArray());
	
	for(var i=0;i<polMeshArray[polObjArray[polObjIndex].polMeshIndex].geometryNum;++i)
	{
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].indexReferBuffer[i]);
    	gl.drawElements(gl.TRIANGLES, polMeshArray[polObjArray[polObjIndex].polMeshIndex].indexReferBuffer[i].numItems, gl.UNSIGNED_SHORT, 0);
	}
}