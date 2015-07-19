//************************************************************************
//POL is a file type difined by polarskie, which is aimed at finding a bridge between obj file and WebGL. To use this file and //the converting exporter in any conversial field involves RIGHT problem, please contact polarskie before you or your team use //them for any purpose except for learning, also when you have any question or improvement.
//Email: 944232369@qq.com
function Vector(ax,ay,az)
{
	if(arguments.length<3)
	{
		ax=0,ay=0,az=0;
	}
	this.x=ax;
	this.y=ay;
	this.z=az;
}

Vector.prototype.absolute = function()
{
	return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
}

Vector.prototype.normalize = function()
{
	if(this.x==0&&this.y==0&&this.z==0) return 0;
	var absolute = this.absolute();
	this.x/=absolute;
	this.y/=absolute;
	this.z/=absolute;
}

Vector.prototype.dot = function(another)
{
	return this.x*another.x+this.y*another.y+this.z+another.z;
}

Vector.prototype.cross = function(another)
{
	var out = new Vector();
	out.x=this.y*another.z-this.z*another.y;
	out.y=this.z*another.x-this.x*another.z;
	out.z=this.x*another.y-this.y*another.x;
	return out;
}

function Matrix()
{
	this.m11=1.0;
	this.m22=1.0;
	this.m33=1.0;
	this.m44=1.0;
	this.m12=0.0;
	this.m13=0.0;
	this.m14=0.0;
	this.m21=0.0;
	this.m23=0.0;
	this.m24=0.0;
	this.m31=0.0;
	this.m32=0.0;
	this.m34=0.0;
	this.m41=0.0;
	this.m42=0.0;
	this.m43=0.0;
}

//var newObj = oldObj.copy();
Matrix.prototype.copy = function()
{
	var temp = new Matrix();
	temp.m11=this.m11;
	temp.m12=this.m12;
	temp.m13=this.m13;
	temp.m14=this.m14;
	temp.m21=this.m21;
	temp.m22=this.m22;
	temp.m23=this.m23;
	temp.m24=this.m24;
	temp.m31=this.m31;
	temp.m32=this.m32;
	temp.m33=this.m33;
	temp.m34=this.m34;
	temp.m41=this.m41;
	temp.m42=this.m42;
	temp.m43=this.m43;
	temp.m44=this.m44;
	return temp;
}
	
Matrix.prototype.mul = function(another)
{
	var product = new Matrix();
	product.m11=this.m11*another.m11+this.m12*another.m21+this.m13*another.m31+this.m14*another.m41;
	product.m12=this.m11*another.m12+this.m12*another.m22+this.m13*another.m32+this.m14*another.m42;
	product.m13=this.m11*another.m13+this.m12*another.m23+this.m13*another.m33+this.m14*another.m43;
	product.m14=this.m11*another.m14+this.m12*another.m24+this.m13*another.m34+this.m14*another.m44;
	
	product.m21=this.m21*another.m11+this.m22*another.m21+this.m23*another.m31+this.m24*another.m41;
	product.m22=this.m21*another.m12+this.m22*another.m22+this.m23*another.m32+this.m24*another.m42;
	product.m23=this.m21*another.m13+this.m22*another.m23+this.m23*another.m33+this.m24*another.m43;
	product.m24=this.m21*another.m14+this.m22*another.m24+this.m23*another.m34+this.m24*another.m44;
	
	product.m31=this.m31*another.m11+this.m32*another.m21+this.m33*another.m31+this.m34*another.m41;
	product.m32=this.m31*another.m12+this.m32*another.m22+this.m33*another.m32+this.m34*another.m42;
	product.m33=this.m31*another.m13+this.m32*another.m23+this.m33*another.m33+this.m34*another.m43;
	product.m34=this.m31*another.m14+this.m32*another.m24+this.m33*another.m34+this.m34*another.m44;
	
	product.m41=this.m41*another.m11+this.m42*another.m21+this.m43*another.m31+this.m44*another.m41;
	product.m42=this.m41*another.m12+this.m42*another.m22+this.m43*another.m32+this.m44*another.m42;
	product.m43=this.m41*another.m13+this.m42*another.m23+this.m43*another.m33+this.m44*another.m43;
	product.m44=this.m41*another.m14+this.m42*another.m24+this.m43*another.m34+this.m44*another.m44;
	return product;
}
	
Matrix.prototype.toArray = function()
{
	return Array(this.m11, this.m21, this.m31, this.m41,
				 this.m12, this.m22, this.m32, this.m42,
				 this.m13, this.m23, this.m33, this.m43,
				 this.m14, this.m24, this.m34, this.m44);
}
/*no minus, transposed
Matrix.prototype.inverse = function()
{
	var adjoint=new Matrix();
	adjoint.m11=this.m22*(this.m33*this.m44-this.m34*this.m43)
			   -this.m23*(this.m32*this.m44-this.m34*this.m42)
			   +this.m24*(this.m32*this.m43-this.m33*this.m42);
	adjoint.m21=this.m21*(this.m33*this.m44-this.m34*this.m43)
			   -this.m23*(this.m31*this.m44-this.m34*this.m41)
			   +this.m24*(this.m31*this.m43-this.m33*this.m41);
	adjoint.m31=-this.m22*(this.m31*this.m44-this.m34*this.m41)
			    +this.m21*(this.m32*this.m44-this.m34*this.m42)
			    -this.m24*(this.m32*this.m41-this.m31*this.m42);
	adjoint.m41=this.m22*(this.m33*this.m41-this.m31*this.m43)
			   -this.m23*(this.m32*this.m41-this.m31*this.m42)
			   +this.m21*(this.m32*this.m43-this.m33*this.m42);
	adjoint.m12=this.m12*(this.m33*this.m44-this.m34*this.m43)
			   -this.m13*(this.m32*this.m44-this.m34*this.m42)
			   +this.m14*(this.m32*this.m43-this.m33*this.m42);
	adjoint.m22=this.m11*(this.m33*this.m44-this.m34*this.m43)
			   -this.m13*(this.m31*this.m44-this.m34*this.m41)
			   +this.m14*(this.m31*this.m43-this.m33*this.m41);
	adjoint.m32=-this.m12*(this.m31*this.m44-this.m34*this.m41)
			    +this.m11*(this.m32*this.m44-this.m34*this.m42)
			    -this.m14*(this.m32*this.m41-this.m31*this.m42);
	adjoint.m42=this.m12*(this.m33*this.m41-this.m31*this.m43)
			   -this.m13*(this.m32*this.m41-this.m31*this.m42)
			   +this.m11*(this.m32*this.m43-this.m33*this.m42);
	adjoint.m13=-this.m22*(this.m13*this.m44-this.m14*this.m43)
			    +this.m23*(this.m12*this.m44-this.m14*this.m42)
			    -this.m24*(this.m12*this.m43-this.m13*this.m42);
	adjoint.m23=-this.m21*(this.m13*this.m44-this.m14*this.m43)
			    +this.m23*(this.m11*this.m44-this.m14*this.m41)
			    -this.m24*(this.m11*this.m43-this.m13*this.m41);
	adjoint.m33=this.m22*(this.m11*this.m44-this.m14*this.m41)
			   -this.m21*(this.m12*this.m44-this.m14*this.m42)
			   +this.m24*(this.m12*this.m41-this.m11*this.m42);
	adjoint.m43=-this.m22*(this.m13*this.m41-this.m11*this.m43)
			    +this.m23*(this.m12*this.m41-this.m11*this.m42)
			    -this.m21*(this.m12*this.m43-this.m13*this.m42);
	adjoint.m14=this.m22*(this.m33*this.m14-this.m34*this.m13)
			   -this.m23*(this.m32*this.m14-this.m34*this.m12)
			   +this.m24*(this.m32*this.m13-this.m33*this.m12);
	adjoint.m24=this.m21*(this.m33*this.m44-this.m34*this.m43)
			   -this.m23*(this.m31*this.m44-this.m34*this.m41)
			   +this.m24*(this.m31*this.m43-this.m33*this.m41);
	adjoint.m34=-this.m22*(this.m31*this.m44-this.m34*this.m41)
			    +this.m21*(this.m32*this.m44-this.m34*this.m42)
			    -this.m24*(this.m32*this.m41-this.m31*this.m42);
	adjoint.m44=this.m22*(this.m33*this.m41-this.m31*this.m43)
			   -this.m23*(this.m32*this.m41-this.m31*this.m42)
			   +this.m21*(this.m32*this.m43-this.m33*this.m42);
}
*/

Matrix.prototype.inverse = function()
{
	var adjoint=new Matrix();
	adjoint.m11=this.m22*(this.m33*this.m44-this.m34*this.m43)
			   -this.m23*(this.m32*this.m44-this.m34*this.m42)
			   +this.m24*(this.m32*this.m43-this.m33*this.m42);
	adjoint.m21=-this.m12*(this.m33*this.m44-this.m34*this.m43)
			    +this.m13*(this.m32*this.m44-this.m34*this.m42)
			    -this.m14*(this.m32*this.m43-this.m33*this.m42);
	adjoint.m31=this.m12*(this.m23*this.m44-this.m24*this.m43)
			    -this.m13*(this.m22*this.m44-this.m24*this.m42)
			    +this.m14*(this.m22*this.m43-this.m23*this.m42);
	adjoint.m41=-this.m12*(this.m23*this.m34-this.m24*this.m33)
			    +this.m13*(this.m22*this.m34-this.m24*this.m32)
			    -this.m14*(this.m22*this.m33-this.m23*this.m32);
	adjoint.m12=-this.m21*(this.m33*this.m44-this.m34*this.m43)
			    +this.m23*(this.m31*this.m44-this.m34*this.m41)
			    -this.m24*(this.m31*this.m43-this.m33*this.m41);
	adjoint.m22=this.m11*(this.m33*this.m44-this.m34*this.m43)
			   -this.m13*(this.m31*this.m44-this.m34*this.m41)
			   +this.m14*(this.m31*this.m43-this.m33*this.m41);
	adjoint.m32=-this.m11*(this.m23*this.m44-this.m24*this.m43)
			   +this.m13*(this.m21*this.m44-this.m24*this.m41)
			   -this.m14*(this.m21*this.m43-this.m23*this.m41);
	adjoint.m42=this.m11*(this.m23*this.m34-this.m24*this.m33)
			   -this.m13*(this.m21*this.m34-this.m24*this.m31)
			   +this.m14*(this.m21*this.m33-this.m23*this.m31);
	adjoint.m13=this.m21*(this.m32*this.m44-this.m34*this.m42)
			    -this.m22*(this.m31*this.m44-this.m34*this.m41)
			    +this.m24*(this.m31*this.m42-this.m32*this.m41);
	adjoint.m23=-this.m11*(this.m32*this.m44-this.m34*this.m42)
			   +this.m12*(this.m31*this.m44-this.m34*this.m41)
			   -this.m14*(this.m31*this.m42-this.m32*this.m41);
	adjoint.m33=this.m11*(this.m22*this.m44-this.m24*this.m42)
			   -this.m12*(this.m21*this.m44-this.m24*this.m41)
			   +this.m14*(this.m21*this.m42-this.m22*this.m41);
	adjoint.m43=-this.m11*(this.m22*this.m34-this.m24*this.m32)
			   +this.m12*(this.m21*this.m34-this.m24*this.m31)
			   -this.m14*(this.m21*this.m32-this.m22*this.m31);
	adjoint.m14=-this.m21*(this.m32*this.m43-this.m33*this.m42)
			    +this.m22*(this.m31*this.m43-this.m33*this.m41)
			    -this.m23*(this.m31*this.m42-this.m32*this.m41);
	adjoint.m24=this.m11*(this.m32*this.m43-this.m33*this.m42)
			   -this.m12*(this.m31*this.m43-this.m33*this.m41)
			   +this.m13*(this.m31*this.m42-this.m32*this.m41);
	adjoint.m34=-this.m11*(this.m22*this.m43-this.m23*this.m42)
			   +this.m12*(this.m21*this.m43-this.m23*this.m41)
			   -this.m13*(this.m21*this.m42-this.m22*this.m41);
	adjoint.m44=this.m11*(this.m22*this.m33-this.m23*this.m32)
			   -this.m12*(this.m21*this.m33-this.m23*this.m31)
			   +this.m13*(this.m21*this.m32-this.m22*this.m31);
	var truth=this.m11*adjoint.m11+this.m12*adjoint.m12+this.m13*adjoint.m13+this.m14*adjoint.m14;
	adjoint.m11/=truth;
	adjoint.m12/=truth;
	adjoint.m13/=truth;
	adjoint.m14/=truth;
	adjoint.m21/=truth;
	adjoint.m22/=truth;
	adjoint.m23/=truth;
	adjoint.m24/=truth;
	adjoint.m31/=truth;
	adjoint.m32/=truth;
	adjoint.m33/=truth;
	adjoint.m34/=truth;
	adjoint.m41/=truth;
	adjoint.m42/=truth;
	adjoint.m43/=truth;
	adjoint.m44/=truth;
	adjoint=adjoint.transpose();
	return adjoint;
}

Matrix.prototype.transpose = function()
{
	var temp = new Matrix();
	temp.m11=this.m11;
	temp.m12=this.m21;
	temp.m13=this.m31;
	temp.m14=this.m41;
	temp.m21=this.m12;
	temp.m22=this.m22;
	temp.m23=this.m32;
	temp.m24=this.m42;
	temp.m31=this.m13;
	temp.m32=this.m23;
	temp.m33=this.m33;
	temp.m34=this.m43;
	temp.m41=this.m14;
	temp.m42=this.m24;
	temp.m43=this.m34;
	temp.m44=this.m44;
	return temp;
}

function polMat()
{
	this.px=0;
	this.py=0;
	this.pz=0;
	this.sx=1;
	this.sy=1;
	this.sz=1;
	this.mat=new Matrix();
	this.rotateMat=new Matrix();
}

polMat.prototype.copy = function(copy)
{
	var temp = new polMat();
	temp.mat = this.mat.copy();
	temp.rotateMat = this.rotateMat.copy();
	temp.px = this.px;
	temp.py = this.py;
	temp.pz = this.pz;
	temp.sx = this.sx;
	temp.sy = this.sy;
	temp.sz = this.sz;
	return temp;
}
//Pay attention that it is multiplied on the left side because the WebGL use column vector

polMat.prototype.append = function(another)
{
	this.px+=another.px;
	this.py+=another.py;
	this.pz+=another.pz;
	this.sx*=another.sx;
	this.sy*=another.sy;
	this.sz*=another.sz;
	this.mat=another.mat.mul(this.mat);
	this.rotateMat=another.rotateMat.mul(this.rotateMat);
}

polMat.prototype.toArray = function()
{
	var array = [this.mat.m11, this.mat.m21, this.mat.m31, this.mat.m41,
				 this.mat.m12, this.mat.m22, this.mat.m32, this.mat.m42,
				 this.mat.m13, this.mat.m23, this.mat.m33, this.mat.m43,
				 this.mat.m14, this.mat.m24, this.mat.m34, this.mat.m44];
	return array;
}
/*
polMat.prototype.copy(copie)
{
	this.m11=copie.m11;
	this.m22=copie.m22;
	this.m33=copie.m33;
	this.m44=copie.m44;
	this.m12=copie.m12;
	this.m13=copie.m13;
	this.m14=copie.m14;
	this.m21=copie.m21;
	this.m23=copie.m23;
	this.m24=copie.m24;
	this.m31=copie.m31;
	this.m32=copie.m32;
	this.m34=copie.m34;
	this.m41=copie.m41;
	this.m42=copie.m42;
	this.m43=copie.m43;
	this.px=copie.px;
	this.py=copie.py;
	this.pz=copie.pz;
}
*/
polMat.prototype.translateBy = function(bx, by, bz)
{
	var temp = new Matrix();
	temp.m14=bx;
	temp.m24=by;
	temp.m34=bz;
	this.px+=bx;
	this.py+=by;
	this.pz+=bz;
	this.mat=temp.mul(this.mat)
}

polMat.prototype.translateTo = function(tx, ty, tz)
{
	var temp = new Matrix();
	temp.m14=tx-this.px;
	temp.m24=ty-this.py;
	temp.m34=tz-this.pz;
	this.px=tx;
	this.py=ty;
	this.pz=tz;
	this.mat=temp.mul(this.mat)
}

//right handed
polMat.prototype.rotateXBy = function(rad)
{
		this.mat=new Matrix();
		this.mat.m11=this.sx;
		this.mat.m22=this.sy;
		this.mat.m33=this.sz;
		
	var temp=new Matrix();
	var rc=Math.cos(rad);
	var rs=Math.sin(rad);
	temp.m22=rc;
	temp.m33=rc;
	temp.m32=rs;
	temp.m23=-rs;
	this.rotateMat=temp.mul(this.rotateMat);
	this.mat=this.rotateMat.mul(this.mat);
	var tempp = new Matrix();
	tempp.m14=this.px;
	tempp.m24=this.py;
	tempp.m34=this.pz;
	this.mat=tempp.mul(this.mat);
}

polMat.prototype.rotateYBy = function(rad)
{
		this.mat=new Matrix();
		this.mat.m11=this.sx;
		this.mat.m22=this.sy;
		this.mat.m33=this.sz;
		
	var temp=new Matrix();
	var rc=Math.cos(rad);
	var rs=Math.sin(rad);
	temp.m11=rc;
	temp.m33=rc;
	temp.m31=-rs;
	temp.m13=rs;
	this.rotateMat=temp.mul(this.rotateMat);
	this.mat=this.rotateMat.mul(this.mat);
	var tempp = new Matrix();
	tempp.m14=this.px;
	tempp.m24=this.py;
	tempp.m34=this.pz;
	this.mat=tempp.mul(this.mat);
}

polMat.prototype.rotateZBy = function(rad)
{
		this.mat=new Matrix();
		this.mat.m11=this.sx;
		this.mat.m22=this.sy;
		this.mat.m33=this.sz;
		
	var temp=new Matrix();
	var rc=Math.cos(rad);
	var rs=Math.sin(rad);
	temp.m22=rc;
	temp.m11=rc;
	temp.m12=-rs;
	temp.m21=rs;
	this.rotateMat=temp.mul(this.rotateMat);
	this.mat=this.rotateMat.mul(this.mat);
	var tempp = new Matrix();
	tempp.m14=this.px;
	tempp.m24=this.py;
	tempp.m34=this.pz;
	this.mat=tempp.mul(this.mat);
}

polMat.prototype.rotateAxisBy = function(rx,ry,rz,rad)
{
		this.mat=new Matrix();
		this.mat.m11=this.sx;
		this.mat.m22=this.sy;
		this.mat.m33=this.sz;
		
	var temp=new Matrix();
	var rc=Math.cos(rad);
	var rs=Math.sin(rad);
	temp.m11=rc+(1-rc)*rx*rx;
	temp.m12=(1-rc)*rx*ry-rz*rs;
	temp.m13=(1-rc)*rx*rz+ry*rs;
	temp.m21=(1-rc)*rx*ry+rz*rs;
	temp.m22=rc+(1-rc)*ry*ry;
	temp.m23=(1-rc)*ry*rz-rx*rs;
	temp.m31=(1-rc)*rx*rz-ry*rs;
	temp.m32=(1-rc)*ry*rz+rx*rs;
	temp.m33=rc+(1-rc)*rz*rz;
	this.rotateMat=temp.mul(this.rotateMat);
	this.mat=this.rotateMat.mul(this.mat);
	var tempp = new Matrix();
	tempp.m14=this.px;
	tempp.m24=this.py;
	tempp.m34=this.pz;
	this.mat=tempp.mul(this.mat);
}

//this is supposed to be called by camera.
polMat.prototype.worldRotateAxisByCam = function(rx,ry,rz,rad)
{
	var temp=new Matrix();
	var rc=Math.cos(rad);
	var rs=Math.sin(rad);
	temp.m11=rc+(1-rc)*rx*rx;
	temp.m12=(1-rc)*rx*ry-rz*rs;
	temp.m13=(1-rc)*rx*rz+ry*rs;
	temp.m21=(1-rc)*rx*ry+rz*rs;
	temp.m22=rc+(1-rc)*ry*ry;
	temp.m23=(1-rc)*ry*rz-rx*rs;
	temp.m31=(1-rc)*rx*rz-ry*rs;
	temp.m32=(1-rc)*ry*rz+rx*rs;
	temp.m33=rc+(1-rc)*rz*rz;
	this.mat=temp.mul(this.mat);
}

polMat.prototype.rotateAxisTo = function(rx,ry,rz,rad)
{
		this.mat=new Matrix();
		this.mat.m11=this.sx;
		this.mat.m22=this.sy;
		this.mat.m33=this.sz;
		
	var temp=new Matrix();
	var rc=Math.cos(rad);
	var rs=Math.sin(rad);
	temp.m11=rc+(1-rc)*rx*rx;
	temp.m12=(1-rc)*rx*ry-rz*rs;
	temp.m13=(1-rc)*rx*rz+ry*rs;
	temp.m21=(1-rc)*rx*ry+rz*rs;
	temp.m22=rc+(1-rc)*ry*ry;
	temp.m23=(1-rc)*ry*rz-rx*rs;
	temp.m31=(1-rc)*rx*rz-ry*rs;
	temp.m32=(1-rc)*ry*rz+rx*rs;
	temp.m33=rc+(1-rc)*rz*rz;
	this.rotateMat=temp.copy();
	this.mat=temp.mul(this.mat);
	var tempp = new Matrix();
	tempp.m14=this.px;
	tempp.m24=this.py;
	tempp.m34=this.pz;
	this.mat=tempp.mul(this.mat);
}

polMat.prototype.resizeBy = function(bx,by,bz)
{
	var temp = new Matrix();
	this.sx*=bx;
	this.sy*=by;
	this.sz*=bz;
	temp.m11=this.sx;
	temp.m22=this.sy;
	temp.m33=this.sz;
	var tempp = new Matrix();
	tempp.m14=this.px;
	tempp.m24=this.py;
	tempp.m34=this.pz;
	this.mat=this.rotateMat.mul(temp);
	this.mat=tempp.mul(this.mat);
}


polMat.prototype.resizeTo = function(tx,ty,tz)
{
	var temp = new Matrix();
	this.sx=tx;
	this.sy=ty;
	this.sz=tz;
	temp.m11=tx;
	temp.m22=ty;
	temp.m33=tz;
	var tempp = new Matrix();
	tempp.m14=this.px;
	tempp.m24=this.py;
	tempp.m34=this.pz;
	this.mat=this.rotateMat.mul(temp);
	this.mat=tempp.mul(this.mat);
}

function matProject(c,k,h,i)
{
	var f=c*Math.PI/180;
	var a=i-h;
	var e=Math.cos(f)/Math.sin(f);
	var d=new Matrix();
	d.m11=e/k;
	d.m22=e;
	d.m33=-(i+h)/a;
	d.m43=-1;
	d.m34=-2*h*i/a;
	d.m44=0;
	return d;
}

//优化空间！！！！
function matInterpolation(proportion,matA,matB)
{
	var temp=new polMat();
	aProportion=1-proportion;
	
	temp.px=matA.px*proportion+matB.px*aProportion;
	temp.py=matA.py*proportion+matB.py*aProportion;
	temp.pz=matA.pz*proportion+matB.pz*aProportion;
	
	temp.sx=matA.sx*proportion+matB.sx*aProportion;
	temp.sy=matA.sy*proportion+matB.sy*aProportion;
	temp.sz=matA.sz*proportion+matB.sz*aProportion;
	
	temp.mat.m11=matA.mat.m11*proportion+matB.mat.m11*aProportion;
	temp.mat.m12=matA.mat.m12*proportion+matB.mat.m12*aProportion;
	temp.mat.m13=matA.mat.m13*proportion+matB.mat.m13*aProportion;
	temp.mat.m14=matA.mat.m14*proportion+matB.mat.m14*aProportion;
	
	temp.mat.m21=matA.mat.m21*proportion+matB.mat.m21*aProportion;
	temp.mat.m22=matA.mat.m22*proportion+matB.mat.m22*aProportion;
	temp.mat.m23=matA.mat.m23*proportion+matB.mat.m23*aProportion;
	temp.mat.m24=matA.mat.m24*proportion+matB.mat.m24*aProportion;
	
	temp.mat.m31=matA.mat.m31*proportion+matB.mat.m31*aProportion;
	temp.mat.m32=matA.mat.m32*proportion+matB.mat.m32*aProportion;
	temp.mat.m33=matA.mat.m33*proportion+matB.mat.m33*aProportion;
	temp.mat.m34=matA.mat.m34*proportion+matB.mat.m34*aProportion;
	
	temp.mat.m41=matA.mat.m41*proportion+matB.mat.m41*aProportion;
	temp.mat.m42=matA.mat.m42*proportion+matB.mat.m42*aProportion;
	temp.mat.m43=matA.mat.m43*proportion+matB.mat.m43*aProportion;
	temp.mat.m44=matA.mat.m44*proportion+matB.mat.m44*aProportion;
	
	temp.rotateMat.m11=matA.rotateMat.m11*proportion+matB.mat.m11*aProportion;
	temp.rotateMat.m12=matA.rotateMat.m12*proportion+matB.rotateMat.m12*aProportion;
	temp.rotateMat.m13=matA.rotateMat.m13*proportion+matB.rotateMat.m13*aProportion;
	temp.rotateMat.m14=matA.rotateMat.m14*proportion+matB.rotateMat.m14*aProportion;
	
	temp.rotateMat.m21=matA.rotateMat.m21*proportion+matB.rotateMat.m21*aProportion;
	temp.rotateMat.m22=matA.rotateMat.m22*proportion+matB.rotateMat.m22*aProportion;
	temp.rotateMat.m23=matA.rotateMat.m23*proportion+matB.rotateMat.m23*aProportion;
	temp.rotateMat.m24=matA.rotateMat.m24*proportion+matB.rotateMat.m24*aProportion;
	
	temp.rotateMat.m31=matA.rotateMat.m31*proportion+matB.rotateMat.m31*aProportion;
	temp.rotateMat.m32=matA.rotateMat.m32*proportion+matB.rotateMat.m32*aProportion;
	temp.rotateMat.m33=matA.rotateMat.m33*proportion+matB.rotateMat.m33*aProportion;
	temp.rotateMat.m34=matA.rotateMat.m34*proportion+matB.rotateMat.m34*aProportion;
	
	temp.rotateMat.m41=matA.rotateMat.m41*proportion+matB.rotateMat.m41*aProportion;
	temp.rotateMat.m42=matA.rotateMat.m42*proportion+matB.rotateMat.m42*aProportion;
	temp.rotateMat.m43=matA.rotateMat.m43*proportion+matB.rotateMat.m43*aProportion;
	temp.rotateMat.m44=matA.rotateMat.m44*proportion+matB.rotateMat.m44*aProportion;
	
	return temp;
}