//var polCameraArray；

//function initCameraArray()
//{
	var polCameraArray = 0;
		polCameraArray=new Array();
		polCameraArray.tempCam = 0;
//}

function polCameraObject()
{
	this.nearest=0.1;
	this.farest=1000;
	this.angle=75;
	this.widthDivHeight=gl.widthDivHeight;
	this.pMatrix = matProject(15, gl.widthDivHeight, 0.1, 1000);
	this.enable = false;
	this.frontVec=new Vector(0,0,-1);
	this.leftVec=new Vector(-1,0,0);
	this.upVec=new Vector(0,1,0);
	this.position=new Vector(0,0,0);
	this.posMatrix = new Matrix();
	this.rotMatrix = new Matrix();
}

polCameraObject.prototype.translateTo = function(tx,ty,tz)
{
	this.position.x=tx;
	this.position.y=ty;
	this.position.z=tz;
	this.posMatrix.m14=-tx;
	this.posMatrix.m24=-ty;
	this.posMatrix.m34=-tz;
}

polCameraObject.prototype.translateBy = function(bx,by,bz)
{
	this.position.x+=bx;
	this.position.y+=by;
	this.position.z+=bz;
	this.posMatrix.m14=-this.position.x;
	this.posMatrix.m24=-this.position.y;
	this.posMatrix.m34=-this.position.z;
}

polCameraObject.prototype.pitch = function(v)
{
	var tangent = Math.tan(v*globalElapsedTime);
	this.frontVec.x-=this.upVec.x*tangent;
	this.frontVec.y-=this.upVec.y*tangent;
	this.frontVec.z-=this.upVec.z*tangent;
	this.frontVec.normalize();
	this.upVec = this.frontVec.cross(this.leftVec);
	this.rotMatrix.m11=-this.leftVec.x;
	this.rotMatrix.m21=-this.leftVec.y;
	this.rotMatrix.m31=-this.leftVec.z;
	this.rotMatrix.m12=this.upVec.x;
	this.rotMatrix.m22=this.upVec.y;
	this.rotMatrix.m32=this.upVec.z;
	this.rotMatrix.m13=-this.frontVec.x;
	this.rotMatrix.m23=-this.frontVec.y;
	this.rotMatrix.m33=-this.frontVec.z;
	this.rotMatrix=this.rotMatrix.inverse();
	//document.write(this.rotMatrix.toArray());
}

polCameraObject.prototype.yaw = function(v)
{
	var tangent = Math.tan(v*globalElapsedTime);
	this.frontVec.x+=this.leftVec.x*tangent;
	this.frontVec.y+=this.leftVec.y*tangent;
	this.frontVec.z+=this.leftVec.z*tangent;
	this.frontVec.normalize();
	this.leftVec = this.upVec.cross(this.frontVec);
	this.rotMatrix.m11=-this.leftVec.x;
	this.rotMatrix.m21=-this.leftVec.y;
	this.rotMatrix.m31=-this.leftVec.z;
	this.rotMatrix.m12=this.upVec.x;
	this.rotMatrix.m22=this.upVec.y;
	this.rotMatrix.m32=this.upVec.z;
	this.rotMatrix.m13=-this.frontVec.x;
	this.rotMatrix.m23=-this.frontVec.y;
	this.rotMatrix.m33=-this.frontVec.z;
	this.rotMatrix=this.rotMatrix.inverse();
}

polCameraObject.prototype.roll = function(v)
{
	var tangent = Math.tan(v*globalElapsedTime);
	this.upVec.x-=this.leftVec.x*tangent;
	this.upVec.y-=this.leftVec.y*tangent;
	this.upVec.z-=this.leftVec.z*tangent;
	this.upVec.normalize();
	this.leftVec = this.upVec.cross(this.frontVec);
	this.rotMatrix.m11=-this.leftVec.x;
	this.rotMatrix.m21=-this.leftVec.y;
	this.rotMatrix.m31=-this.leftVec.z;
	this.rotMatrix.m12=this.upVec.x;
	this.rotMatrix.m22=this.upVec.y;
	this.rotMatrix.m32=this.upVec.z;
	this.rotMatrix.m13=-this.frontVec.x;
	this.rotMatrix.m23=-this.frontVec.y;
	this.rotMatrix.m33=-this.frontVec.z;
	this.rotMatrix = this.rotMatrix.inverse();
	//document.write(this.rotMatrix.mul(temp).toArray());
	//document.write(this.rotMatrix.toArray());
}

polCameraObject.prototype.ahead = function(v)
{
	v*=globalElapsedTime;
	this.position.x+=this.frontVec.x*v;
	this.position.y+=this.frontVec.y*v;
	this.position.z+=this.frontVec.z*v;
	
	this.posMatrix.m14=-this.position.x;
	this.posMatrix.m24=-this.position.y;
	this.posMatrix.m34=-this.position.z;
}

polCameraObject.prototype.sideway = function(v)
{
	v*=globalElapsedTime;
	this.position.x+=this.leftVec.x*v;
	this.position.y+=this.leftVec.y*v;
	this.position.z+=this.leftVec.z*v;
	
	this.posMatrix.m14=-this.position.x;
	this.posMatrix.m24=-this.position.y;
	this.posMatrix.m34=-this.position.z;
}

polCameraObject.prototype.fly = function(v)
{
	v*=globalElapsedTime;
	this.position.x+=this.upVec.x*v;
	this.position.y+=this.upVec.y*v;
	this.position.z+=this.upVec.z*v;
	
	this.posMatrix.m14=-this.position.x;
	this.posMatrix.m24=-this.position.y;
	this.posMatrix.m34=-this.position.z;
}

polCameraObject.prototype.reset = function()
{
	this.upVec.x=0;
	this.upVec.y=1;
	this.upVec.z=0;
	this.leftVec.y=0;
	this.leftVec.normalize();
	this.frontVec = this.leftVec.cross(this.upVec);
	this.rotMatrix.m11=-this.leftVec.x;
	this.rotMatrix.m21=-this.leftVec.y;
	this.rotMatrix.m31=-this.leftVec.z;
	this.rotMatrix.m12=this.upVec.x;
	this.rotMatrix.m22=this.upVec.y;
	this.rotMatrix.m32=this.upVec.z;
	this.rotMatrix.m13=-this.frontVec.x;
	this.rotMatrix.m23=-this.frontVec.y;
	this.rotMatrix.m33=-this.frontVec.z;
	this.rotMatrix = this.rotMatrix.inverse();
	//document.write(this.rotMatrix.mul(temp).toArray());
	//document.write(this.rotMatrix.toArray());
}

/*
polCameraObject.prototype.translateTo = funtion(tx,ty,tz)
{
	this.transformMatrix.translateTo(-tx,-ty,-tz);
}

polCameraObject.prototype.translateBy = funtion(bx,by,bz,v)
{
	this.transformMatrix.translateBy(-bx*v,-by*v,-bz*v);
}

polCameraObject.prototype.rotateByLeft = funtion(rad,v)
{
	this.transformMatrix.worldRotateAxisByCam(this.leftVec.x,this.leftVect.y,this.leftVec.z,-rad*v);
}

polCameraObject.prototype.rotateByUp = funtion(rad,v)
{
	this.transformMatrix.worldRotateAxisByCam(this.upVec.x,this.upVect.y,this.upVec.z,-rad*v);
}

polCameraObject.prototype.rotateByFront = funtion(rad,v)
{
	var temp = this.leftVec.cross(this.upVec);
	this.transformMatrix.worldRotateAxisByCam(temp.x,temp.y,temp.z,-rad*v);
}

polCameraObject.prototype.goAhead = funtion(v)
{
	var temp = this.leftVec.cross(this.upVec);
	this.transformMatrix.translateBy(temp.x*v,temp.y*v,temp.z*v);
}

polCameraObject.prototype.goLeft = funtion(v)
{
	this.transformMatrix.translateBy(this.leftVec.x*v,this.leftVec.y*v,this.leftVec.z*v);
}

polCameraObject.prototype.goArise = funtion(v)
{
	this.transformMatrix.translateBy(this.upVec.x*v,this.upVec.y*v,this.upVec.z*v);
}
*/
function appendCamera()
{
	polCameraArray.push(new polCameraObject);
	return polCameraArray.length-1;
}



polCameraObject.prototype.adjustCamera = function(index, a, n, f, wdh)
{
	if(arguments.length==4) wdh=0;
	this.nearest=n;
	this.farest=f;
	this.angle=a;
	if(wdh!=0)
	{
		this.widthDivHeight=wdh;
	}
	this.pMatrix = matProject(this.angle, this.widthDivHeight, this.nearest, this.farest);
}