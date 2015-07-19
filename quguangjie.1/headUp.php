
<!DOCTYPE HTML> 
<?php session_start(); ?>
<html>
<head>
<link src="quguangjie.view.css" rel="stylesheet" type="text/css"/>
</head>
<?php
$link = new mysqli("localhost","root","12345","quguangjie");
$idNum = "";
$row = "";
if(isset($_FILES['picUp']))
{
	if ((($_FILES["picUp"]["type"] == "image/jpeg")
	|| ($_FILES["picUp"]["type"] == "image/pjpeg"))
	&& ($_FILES["picUp"]["size"] < 1000000))
	{
		if ($_FILES["picUp"]["error"] > 0)
		{
			echo "Return Code: " . $_FILES["picUp"]["error"] . "<br />";
		}
		else
		{
			if(isset($_SESSION["userId"]))
			{
				$idNum = $_SESSION["userId"];
				move_uploaded_file($_FILES["picUp"]["tmp_name"],"userPic/" . $_SESSION['userId'] . ".jpg");
				$query = "update User set head='userPic/$idNum.jpg' where number = $idNum";
				$link->query($query);
				$query = "select head from User where number = '$idNum'";
				$result = $link->query($query);
				$row = $result->fetch_assoc();
			}
			else if(isset($_SESSION["shopId"]))
			{
				$idNum = $_SESSION["shopId"];
				move_uploaded_file($_FILES["picUp"]["tmp_name"],"shopPic/" . $_SESSION['shopId'] . ".jpg");
				$query = "update Shop set head='shopPic/$idNum.jpg' where number = $idNum";
				$link->query($query);
				$query = "select head from Shop where number = '$idNum'";
				$result = $link->query($query);
				$row = $result->fetch_assoc();
			}
		}
	}
	else echo "wrong file type or too big file!";
}
if($row=="")
{
	if(isset($_SESSION["userId"]))
	{
		$idNum = $_SESSION["userId"];
		$query = "select head from User where number = '$idNum'";
		$result = $link->query($query);
		$row = $result->fetch_assoc();
	}
	else if(isset($_SESSION["shopId"]))
	{
		$idNum = $_SESSION["shopId"];
		$query = "select head from Shop where number = '$idNum'";
		$result = $link->query($query);
		$row = $result->fetch_assoc();
	}
}

function test_input($data) {
	$data = htmlspecialchars($data);
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>
<body onmouseup="mouseUp(event)" onmousemove="transPic(event)"> 
<img hidden="true" src="<?php echo $row["head"]; ?>" id="img" onload="cont()"></img>
<div style="position:fixed;left:0px;top:0px;width:100%;height:100%;z-index:-1;"></div>
<div id = "title" >更换头像
</div>
<div style="margin-bottom:100px">
	<form method = "post" action ="headUp.php" enctype="multipart/form-data">
		<input type = "file" name = "picUp"/>
		<input type = "submit" value = "上传图片"/>
	</form>
</div>
<div id="cover">
<canvas id="canvas1" width="2000" height="2000" style="border:1px solid #c3c3c3;float:left;">
Your browser does not support the canvas element.
</canvas>
<canvas id="canvas2" width="2000" height="2000" style="border:1px solid #c3c3c3;float:left;">
Your browser does not support the canvas element.
</canvas>
<canvas id="canvas3" width="2000" height="2000" style="position:absolute;border:1px solid #c3c3c3;" onmousedown="mouseDown(event)">
Your browser does not support the canvas element.
</canvas>
</div>
<script type="text/javascript">
var haveMouse=1;
var contFlag=0;
var width = window.innerWidth;
var canvas1=document.getElementById("canvas1");
var canvas2=document.getElementById("canvas2");
var canvas3=document.getElementById("canvas3");
var ctx1 = canvas1.getContext("2d");
var ctx2 = canvas2.getContext("2d");
var ctx3 = canvas3.getContext("2d");
var cover = document.getElementById("cover");
var singleMove = document.getElementById("move");
canvas2.style.marginLeft = cover.style.marginLeft = width/9 + "px";
canvas3.height = canvas3.width = canvas2.height = canvas2.width = canvas1.height = canvas1.width = width/3;
canvas3.style.left = canvas1.offsetLeft + "px";
canvas3.style.top = canvas1.offsetTop + "px";
canvas3.style.zIndex = 5;
ctx1.fillStyle="#ffffff";
ctx1.fillRect(0,0,canvas1.width,canvas1.height);
ctx3.globalAlpha = 0.45;
ctx3.fillRect(0,0,canvas3.width,canvas3.height);
ctx3.clearRect(canvas3.width/5,canvas3.width/5,canvas3.width*3/5,canvas3.width*3/5);
ctx3.fillStyle="#ff0000";
ctx3.strokeStyle="#ff0000";
ctx3.lineWidth = 3;
ctx3.globalAlpha = 1;
ctx3.strokeRect(canvas3.width/5,canvas3.width/5,canvas3.width*3/5,canvas3.width*3/5);
ctx3.fillRect(canvas3.width*4/5-canvas3.width/60,canvas3.width*4/5-canvas3.width/60,canvas3.width/30,canvas3.width/30);


var rectLeft = canvas3.width/5;
var rectRight = canvas3.width*4/5;
var rectTop = canvas3.width/5;
var rectBottom = canvas3.width*4/5;
var mouseX=0;
var mouseY=0;
var transX=0;
var transY=0;
var offsetX=0;
var offsetY=0;
var transPattern=0;



function cont()
{
var img=document.getElementById("img");
if(img.width>img.height)
{
	var NimgHeight = img.height*canvas1.width/img.width;
	var NimgWidth = canvas1.width;
	offsetX=0;
	offsetY=(canvas1.height-NimgHeight)/2;
}
else
{
	var NimgHeight = canvas1.height;
	var NimgWidth = img.width*canvas1.height/img.height;
	offsetX=(canvas1.width-NimgWidth)/2;
	offsetY=0;
}
ctx1.drawImage(img,0,0,img.width,img.height,offsetX,offsetY,NimgWidth,NimgHeight);
drawCanvas2();
}

function mouseDown(event)
{
	mouseX = event.clientX;
	mouseY = event.clientY;
	if(abs(event.pageX-rectRight-canvas1.offsetLeft)+abs(event.pageY-rectBottom-canvas1.offsetTop)<width/20)
	{
		transPattern=1;
	}
	else
	{
		transPattern=2;
	}
}
function mouseUp(event)
{
	if(event.clientX==mouseX&&event.clientY==mouseY)
	{
		transPattern=0;
		transX=transY=0;
		var trans=0;
		var x = event.pageX-canvas1.offsetLeft;
		var y = event.pageY-canvas1.offsetTop;
		if(inRect(x,y,rectLeft,rectTop,rectRight,rectBottom))
		{
			var centerX=(rectLeft+rectRight)/2;
			var centerY=(rectTop+rectBottom)/2;
			transX=x-centerX;
			transY=y-centerY;
			if(rectBottom+transY>canvas1.height) transY=canvas1.height-rectBottom;
			if(rectRight+transX>canvas1.width) transX=canvas1.width-rectRight;
			if(rectLeft+transX<0) transX=0-rectLeft;
			if(rectTop+transY<0) transY=0-rectTop;
			rectBottom+=transY;
			rectRight+=transX;
			rectLeft+=transX;
			rectTop+=transY;
		}
		else if(abs(x-rectRight)+abs(y-rectBottom)>abs(x-rectLeft)+abs(y-rectTop))
		{
			trans = max(x-rectLeft,y-rectTop);
			rectLeft+=trans;
			rectTop+=trans;
		}
		else 
		{
			trans = min(x-rectRight,y-rectBottom);
			rectRight+=trans;
			rectBottom+=trans;
		}
		ctx3.clearRect(0,0,canvas3.width,canvas3.height);
		ctx3.globalAlpha = 0.45;
		ctx3.fillStyle="#000000";
		ctx3.fillRect(0,0,canvas3.width,canvas3.height);
		ctx3.clearRect(rectLeft,rectTop,rectRight-rectLeft,rectBottom-rectTop);
		ctx3.fillStyle="#ff0000";
		ctx3.strokeStyle="#ff0000";
		ctx3.lineWidth = 3;
		ctx3.globalAlpha = 1;
		ctx3.strokeRect(rectLeft,rectTop,rectRight-rectLeft,rectBottom-rectTop);
		ctx3.fillRect(rectRight-canvas3.width/60,rectBottom-canvas3.width/60,canvas3.width/30,canvas3.width/30);
		drawCanvas2();
	}
	else
	{
		var oldTrPtt = transPattern;
		transPattern=0;
		rectRight += transX;
		rectBottom += transY;
		if(oldTrPtt == 2)
		{
			rectLeft += transX;
			rectTop += transY;
		}
		transX=0;
		transY=0;
		drawCanvas2();
	}
}
function transPic(event)
{
	if(transPattern==0)
		return;
	else if(transPattern==1)
	{
		transX = transY = absMin(event.clientX-mouseX,event.clientY-mouseY);
		if(rectRight+transX>canvas3.width) transX = transY = canvas3.width-rectRight;
		if(rectBottom+transY>canvas3.width) transX = transY = canvas3.width-rectBottom;
		if(rectRight+transX<rectLeft) transX = transY = rectLeft-rectRight;
		if(rectBottom+transY<rectTop) transX = transY = rectTop-rectBottom;
		refresh();
	}
	else if(transPattern==2)
	{
		transX = event.clientX-mouseX;
		transY = event.clientY-mouseY;
		if(rectRight+transX>canvas3.width) transX = canvas3.width-rectRight;
		if(rectBottom+transY>canvas3.width) transY = canvas3.width-rectBottom;
		if(rectLeft+transX<0) transX = 0-rectLeft;
		if(rectTop+transY<0) transY = 0-rectTop;
		refresh();
	}
}

function refresh()
{
	ctx3.clearRect(0,0,canvas3.width,canvas3.height);
	ctx3.globalAlpha = 0.45;
	ctx3.fillStyle="#000000";
	ctx3.fillRect(0,0,canvas3.width,canvas3.height);
	if(transPattern==1)
	{
		ctx3.clearRect(rectLeft,rectTop,rectRight-rectLeft+transX,rectBottom-rectTop+transY);
		ctx3.fillStyle="#ff0000";
		ctx3.strokeStyle="#ff0000";
		ctx3.lineWidth = 3;
		ctx3.globalAlpha = 1;
		ctx3.strokeRect(rectLeft,rectTop,rectRight-rectLeft+transX,rectBottom-rectTop+transY);
	}
	else if(transPattern==2)
	{
		ctx3.clearRect(rectLeft+transX,rectTop+transY,rectRight-rectLeft,rectBottom-rectTop);
		ctx3.fillStyle="#ff0000";
		ctx3.strokeStyle="#ff0000";
		ctx3.lineWidth = 3;
		ctx3.globalAlpha = 1;
		ctx3.strokeRect(rectLeft+transX,rectTop+transY,rectRight-rectLeft,rectBottom-rectTop);
	}
	ctx3.fillRect(rectRight+transX-canvas3.width/60,rectBottom+transY-canvas3.width/60,canvas3.width/30,canvas3.width/30);
}

function drawCanvas2()
{
	ctx2.fillStyle="#ffffff";
	ctx2.fillRect(0,0,canvas2.width,canvas2.height);
	if(offsetY>0)
	{
		if(rectTop<offsetY)
		{
			ctx2.drawImage(img,
			rectLeft*img.width/canvas1.width,  0,
			(rectRight-rectLeft)*img.width/canvas1.width,  min((rectBottom-offsetY)*img.height/(canvas1.height-offsetY*2),img.height),
			0,  (offsetY-rectTop)*canvas2.height/(rectBottom-rectTop),
			canvas2.width,  min(rectBottom-offsetY,canvas1.height-2*offsetY)*canvas2.height/(rectBottom-rectTop));
		}
		else
		{
			ctx2.drawImage(img,
			rectLeft*img.width/canvas1.width,  (rectTop-offsetY)*img.height/(canvas1.height-offsetY*2),
			(rectRight-rectLeft)*img.width/canvas1.width,  min((rectBottom-rectTop),(canvas1.height-offsetY-rectTop))*img.height/(canvas1.height-offsetY*2),
			0,  0,
			canvas2.width,  min(rectBottom-rectTop,canvas1.height-offsetY-rectTop)*canvas2.height/(rectBottom-rectTop));
		}
	}
	else if(offsetX>0)
	{
		if(rectLeft<offsetX)
		{
			ctx2.drawImage(img,
			0,  rectTop*img.height/canvas1.height,
			min((rectRight-offsetX)*img.width/(canvas1.width-offsetX*2),img.width),  (rectBottom-rectTop)*img.height/canvas1.height,
			(offsetX-rectLeft)*canvas2.width/(rectRight-rectLeft),  0,
			min(rectRight-offsetX,canvas1.width-2*offsetX)*canvas2.width/(rectRight-rectLeft),  canvas2.height);
		}
		else
		{
			ctx2.drawImage(img,
			(rectLeft-offsetX)*img.width/(canvas1.width-offsetX*2),  rectTop*img.height/canvas1.height,
			min((rectRight-rectLeft),(canvas1.width-offsetX-rectLeft))*img.width/(canvas1.width-offsetX*2),  (rectBottom-rectTop)*img.height/canvas1.height,
			0,  0,
			min(rectRight-rectLeft,canvas1.width-offsetX-rectLeft)*canvas2.width/(rectRight-rectLeft),  canvas2.height);
		}
	}
}
function abs(a)
{
	if(a>0) return a;
	else return 0-a;
}

function absMin(a,b)
{
	if(abs(a)<abs(b)) return a;
	else return b;
}

function min(a,b)
{
	return a<b?a:b;
}
function max(a,b)
{
	return a>b?a:b;
}
function inRect(x,y,l,t,r,b)
{
	if(x>=l&&x<=r&&y>=t&&y<=b) return true;
	else return false;
}
</script>
</body>
</html>

