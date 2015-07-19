//************************************************************************
//POL is a file type difined by polarskie, which is aimed at finding a bridge between obj file and WebGL. To use this file and //the converting exporter in any conversial field involves RIGHT problem, please contact polarskie before you or your team use //them for any purpose except for learning, also when you have any question or Improvement.
//Email: 944232369@qq.com
	var MACROnearest = 0.1;
	var MACROfarest  = 1000;
	var MACROangle   = 15;

    var gl;
	var specialGl;
	var shaderProgram = new Array();
	var lastTime;
    function initGL(canvas, specialCanvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
			gl.widthDivHeight = canvas.width/canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
		
		specialGl = specialCanvas.getContext("2d");
		polCameraArray.push(new polCameraObject());
		polCameraArray[0].enable=true;
		
		for(var i in keyPressed)
		{
			keyPressed[i]=false;
		}
    }


    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }
	
	
	function appendShader(fs, vs, type) 
	{
	if(type==97)						//cartoon shader
	{
		var fragmentShader = getShader(gl, fs);
		var vertexShader = getShader(gl, vs);
		var index = shaderProgram.length;

        shaderProgram.push(gl.createProgram());
		shaderProgram[index].type = type;
        gl.attachShader(shaderProgram[index], fragmentShader);
        gl.attachShader(shaderProgram[index], vertexShader);
        gl.linkProgram(shaderProgram[index]);

        if (!gl.getProgramParameter(shaderProgram[index], gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }	
		
		gl.useProgram(shaderProgram[index]);

        shaderProgram[index].vertexPositionAttribute = gl.getAttribLocation(shaderProgram[index], "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram[index].vertexPositionAttribute);
        shaderProgram[index].textureCoordAttribute = gl.getAttribLocation(shaderProgram[index], "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram[index].textureCoordAttribute);
        shaderProgram[index].vertexNormalAttribute = gl.getAttribLocation(shaderProgram[index], "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram[index].vertexNormalAttribute);
		
        shaderProgram[index].pMatrixUniform = gl.getUniformLocation(shaderProgram[index], "uPMatrix");
        shaderProgram[index].mvMatrixUniform = gl.getUniformLocation(shaderProgram[index], "uMVMatrix");
		shaderProgram[index].nMatrixUniform = gl.getUniformLocation(shaderProgram[index], "uNMatrix");	//matrix for stroking
	}
	else
	{
        var fragmentShader = getShader(gl, fs);
        var vertexShader = getShader(gl, vs);
		var index = shaderProgram.length;

        shaderProgram.push(gl.createProgram());
		shaderProgram[index].type = type;
        gl.attachShader(shaderProgram[index], fragmentShader);
        gl.attachShader(shaderProgram[index], vertexShader);
        gl.linkProgram(shaderProgram[index]);

        if (!gl.getProgramParameter(shaderProgram[index], gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram[index]);

        shaderProgram[index].vertexPositionAttribute = gl.getAttribLocation(shaderProgram[index], "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram[index].vertexPositionAttribute);
        shaderProgram[index].textureCoordAttribute = gl.getAttribLocation(shaderProgram[index], "aTextureCoord");
        gl.enableVertexAttribArray(shaderProgram[index].textureCoordAttribute);
        shaderProgram[index].vertexNormalAttribute = gl.getAttribLocation(shaderProgram[index], "aVertexNormal");
        gl.enableVertexAttribArray(shaderProgram[index].vertexNormalAttribute);
		
		if(type%3==0)					//texture or colour
		{
        	shaderProgram[index].samplerUniform = gl.getUniformLocation(shaderProgram[index], "uSampler");
		}
		else
		{
			shaderProgram[index].colorUniform = gl.getUniformLocation(shaderProgram[index], "uColor");
		}
		if(type%2==0)					//lighting
		{
        	shaderProgram[index].nMatrixUniform = gl.getUniformLocation(shaderProgram[index], "uNMatrix");
        	shaderProgram[index].useLightingUniform = gl.getUniformLocation(shaderProgram[index], "uUseLighting");
        	shaderProgram[index].ambientColorUniform = gl.getUniformLocation(shaderProgram[index], "uAmbientColor");
        	shaderProgram[index].lightAssistUniform = gl.getUniformLocation(shaderProgram[index], "uLightAssist");
        	shaderProgram[index].lightColorUniform = gl.getUniformLocation(shaderProgram[index], "uLightColor");
        	shaderProgram[index].lightStyleUniform = gl.getUniformLocation(shaderProgram[index], "uLightStyle");
        	shaderProgram[index].lightNumUniform = gl.getUniformLocation(shaderProgram[index], "uLightNum");
			if(type%16==0)
			{
				//the shader is supposed to be shadering the shadow by shadow mapping
			}
		}
		if(type%5==0)				//the shader is one that render out a transparent mesh
		{
			shaderProgram[index].alphaUniform = gl.getUniformLocation(shaderProgram[index], "uAlpha");
		}
        shaderProgram[index].pMatrixUniform = gl.getUniformLocation(shaderProgram[index], "uPMatrix");
        shaderProgram[index].mvMatrixUniform = gl.getUniformLocation(shaderProgram[index], "uMVMatrix");
	}
	return shaderProgram.length-1;
    }
	

    var mvMatrix;
    var pMatrix;


    function drawPol(polObjIndex, shaderIndex) 
	{
		gl.useProgram(shaderProgram[shaderIndex]);
		
		//attributes
        gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].vertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram[shaderIndex].vertexPositionAttribute, polMeshArray[polObjArray[polObjIndex].polMeshIndex].vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].normalDirectionBuffer);
        gl.vertexAttribPointer(shaderProgram[shaderIndex].vertexNormalAttribute, polMeshArray[polObjArray[polObjIndex].polMeshIndex].normalDirectionBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
        gl.bindBuffer(gl.ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].textureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram[shaderIndex].textureCoordAttribute, polMeshArray[polObjArray[polObjIndex].polMeshIndex].textureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		//special shader ------- cartoon shader
		if(shaderProgram[shaderIndex].type==97)
		{
			gl.cullFace(gl.FRONT);
			gl.enable(gl.CULL_FACE);
			
        	gl.uniformMatrix4fv(shaderProgram[shaderIndex].pMatrixUniform, false, polCameraArray[polCameraArray.tempCam].pMatrix.toArray());

			var finalMvMatrix = polCameraArray[polCameraArray.tempCam].rotMatrix.mul(polCameraArray[polCameraArray.tempCam].posMatrix.mul(polObjArray[polObjIndex].transformMatrix.mat));
        	gl.uniformMatrix4fv(shaderProgram[shaderIndex].mvMatrixUniform, false, 
								finalMvMatrix.toArray());
			
			var finalNMatrix = polCameraArray[polCameraArray.tempCam].rotMatrix.mul(polObjArray[polObjIndex].transformMatrix.rotateMat);
        	gl.uniformMatrix4fv(shaderProgram[shaderIndex].nMatrixUniform, false, 
								finalNMatrix.toArray());	
			for(var i=0;i<polMeshArray[polObjArray[polObjIndex].polMeshIndex].geometryNum;++i)
			{
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].indexReferBuffer[i]);
        		gl.drawElements(gl.TRIANGLES, polMeshArray[polObjArray[polObjIndex].polMeshIndex].indexReferBuffer[i].numItems, gl.UNSIGNED_SHORT, 0);
			}
			gl.cullFace(gl.BACK);
			gl.disable(gl.CULL_FACE);
			for(var j in polObjArray[polObjIndex].secondShader) drawPol(polObjIndex, polObjArray[polObjIndex].secondShader[j]);
			return 0;
		}
		
		//lighting shader
		if(shaderProgram[shaderIndex].type%2==0)
		{
        	
        	gl.uniform1i(shaderProgram[shaderIndex].useLightingUniform, 1);
            gl.uniform3f(
                shaderProgram[shaderIndex].ambientColorUniform,
                polObjArray[polObjIndex].ambientColor[0],
                polObjArray[polObjIndex].ambientColor[1],
                polObjArray[polObjIndex].ambientColor[2]
            );
						
            gl.uniform3fv(shaderProgram[shaderIndex].lightAssistUniform, polObjArray[polObjIndex].lightAssist);

            gl.uniform3fv(
                shaderProgram[shaderIndex].lightColorUniform,
                polObjArray[polObjIndex].lightColor
            );
			
			gl.uniform1iv(
                shaderProgram[shaderIndex].lightStyleUniform,
                polObjArray[polObjIndex].lightStyle
            );
			
			gl.uniform1i(shaderProgram[shaderIndex].lightNumUniform, polObjArray[polObjIndex].lightNum);
		}
		
		//blending shader
		if(shaderProgram[shaderIndex].type%5==0)
		{
			gl.uniform1f(shaderProgram[shaderIndex].alphaUniform, 0.5);
        	gl.disable(gl.DEPTH_TEST);
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		}
		else
		{
			gl.enable(gl.DEPTH_TEST);
			gl.disable(gl.BLEND);
		}
		
		
		//matrixes setting
		gl.uniformMatrix4fv(shaderProgram[shaderIndex].pMatrixUniform, false, polCameraArray[polCameraArray.tempCam].pMatrix.toArray());
		
        var finalMvMatrix = polCameraArray[polCameraArray.tempCam].rotMatrix.mul(polCameraArray[polCameraArray.tempCam].posMatrix.mul(polObjArray[polObjIndex].transformMatrix.mat));
        gl.uniformMatrix4fv(shaderProgram[shaderIndex].mvMatrixUniform, false, 
								finalMvMatrix.toArray());
		
        if(shaderProgram[shaderIndex].type%2==0)
		{
        	var finalNMatrix = polCameraArray[polCameraArray.tempCam].rotMatrix.mul(polObjArray[polObjIndex].transformMatrix.rotateMat);
        	gl.uniformMatrix4fv(shaderProgram[shaderIndex].nMatrixUniform, false, finalNMatrix.toArray());	
			
			if(shaderProgram[shaderIndex].type%16==0)
			{
        		gl.activeTexture(gl.TEXTURE0);
        		gl.bindTexture(gl.TEXTURE_2D, polShadowFrameTexbuffer);
			}
		}
		
		//geometry drawing
		for(var i=0;i<polMeshArray[polObjArray[polObjIndex].polMeshIndex].geometryNum;++i)
		{
			//geometry color or texture coords
			if(shaderProgram[shaderIndex].type%3!=0)
			{
				gl.uniform3f(shaderProgram[shaderIndex].colorUniform, polMeshArray[polObjArray[polObjIndex].polMeshIndex].geometryColor[i][0], polMeshArray[polObjArray[polObjIndex].polMeshIndex].geometryColor[i][1], polMeshArray[polObjArray[polObjIndex].polMeshIndex].geometryColor[i][2]);
			}
			else
			{
        		gl.activeTexture(gl.TEXTURE1);
        		gl.bindTexture(gl.TEXTURE_2D, polMeshArray[polObjArray[polObjIndex].polMeshIndex].polTexture[i]);
        		gl.uniform1i(shaderProgram[shaderIndex].samplerUniform, 1);
			}
		
			//indexes
        	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, polMeshArray[polObjArray[polObjIndex].polMeshIndex].indexReferBuffer[i]);
			
			//drawElements
        	gl.drawElements(gl.TRIANGLES, polMeshArray[polObjArray[polObjIndex].polMeshIndex].indexReferBuffer[i].numItems, gl.UNSIGNED_SHORT, 0);
		}
		//document.write(polMeshArray[polObjArray[polObjIndex].polMeshIndex].geometryNum);
    }
	
