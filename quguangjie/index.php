<html>
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" id="viewport" name="viewport" charset = utf-8>
<head charset>
<style type="text/css">
.title
{
font-family: 黑体, serif;
font-size:5em;
color: #ffffff;
width:auto;
margin-left: auto; 
margin-right: auto;
margin-top: 12%;
}
body
{
background-color:4d7b95;
text-align:center;
position:relative;
animation:myfirst 1s;
-moz-animation:myfirst 1s; /* Firefox */
-webkit-animation:myfirst 1s; /* Safari and Chrome */
-o-animation:myfirst 1s; /* Opera */
}

@keyframes myfirst
{
0%   {left:100%;}
100% {left:0px;}
}

@-moz-keyframes myfirst /* Firefox */
{
0%   {left:100%;}
100% {left:0px;}
}

@-webkit-keyframes myfirst /* Safari 和 Chrome */
{
0%   {left:100%;}
100% {left:0px;}
}

@-o-keyframes myfirst /* Opera */
{
0%   {left:100%;}
100% {left:0px;}
}
.button
{
font-family: 黑体, serif;
text-align:center;
height:5%;
color: #ffffff;
padding-top:15px;
padding-bottom:15px;
background:rgba(0, 0, 0, 0.4);
}

#dingWei
{
width:70%;
margin-top:15%;
margin-left:15%;
}
#lieBiao
{
width:70%;
margin-top:10%;
margin-left:15%;
}
#denglu
{
margin-left:15%;
font-family: 黑体, serif;
text-align:center;
width:35%;
color: #ffffff;
margin-left:15%;
padding-top:15px;
padding-bottom:15px;
margin-top:10%;
float:left;
padding-bottom:15px;
}
#zhuce
{
margin-top:10%;
width:35%;
float:left;
padding-bottom:15px;
}
#shangPu
{
margin-top:25%;
margin-left:70%;
width:30%;
color:white;
}

#mask
{
background-color: #4d7b95;
position:fixed;
left:0px;
top:0px;
width:100%;
height:100%;
z-index:1032;
opacity: 0; /* 通用，其他浏览器  有效*/
}

#backgroundImg{
	position:fixed;
	left:0px;
	top:0px;
	z-index:-2;
}
</style>
</head>
<body onload="init()">
<img src="background.jpg" id="backgroundImg">
</img>
<div id="mask" hidden=true>
</div>
<div text-align = "center" class="title">LI HE's test web App</div>
<?php
session_start();
$lat = $long = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   $lat = test_input($_POST["Latitude"]);
   $long = test_input($_POST["Longitude"]);
}
if(!$lat =="")
{
	$link = new mysqli("localhost","root","12345","quguangjie");
	$query = "select * from Map";
	$result = $link->query($query);
	$min = 720.0;
	$targetMap = -1;
	while($row = $result->fetch_assoc())
	{
		if(abs($lat-$row['coordinatex'])+abs($long-$row['coordinatey'])<$min)
		{
			$min = abs($lat-$row['coordinatex'])+abs($long-$row['coordinatey']);
			$targetMap = $row['number'];
		}
	}
	if($targetMap!=-1)
	{
		$_SESSION['mapId'] = $targetMap;
		echo "<script>location.assign('svgmaps/" . $targetMap . ".php')</script>";
	}
	else{
		echo "<h1 type='color = red'>sorry, can't find map at:</h1>";
		echo "<h1>latitude:$lat</h1>";
		echo "<h1>longtitude:$long</h1>";
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
<div text-align = "center" class="title" id="quGuangJie">去逛街</div>
<div class="button" id="dingWei" onclick="getLocation()">定位我的位置</div>
<div class="button" id="lieBiao" onclick="findSite()">让我从列表选择</div>
	<div class="button" id="denglu" onclick="login()">登录</div>
	<div class="button" id="zhuce" onclick="register()">注册</div>
<div id="shangPu" onclick="sellers()">商铺入口</div>
<form hidden=true id="GPS" method="post" action="index.php">
<input id="Longitude" name="Longitude"/>
<input id="Latitude" name="Latitude"/>
</form>
</body>

<script type="text/javascript">
var alpha=0;
function getLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{x.innerHTML="Geolocation is not supported by this browser.";}
  }
function showPosition(position)
  {
  document.getElementById("Latitude").value = position.coords.latitude;
  document.getElementById("Longitude").value=position.coords.longitude;	
  document.getElementById("GPS").submit();
  }
function jumping(p)
{
	document.getElementById("mask").hidden=false;
	self.setInterval("wiping()",20);
	var t=setTimeout("location.assign('"+p+"');",600);
}
function wiping()
{
document.getElementById("mask").style.opacity=(alpha+=0.07);
}
function findSite()
{
jumping("selectMap.php");
}
function login()
{
jumping("visitorLogin.php");
}

function register()
{
jumping("visitorRegister.php");
}

function sellers()
{
jumping("shopLogin.php");
}

var width = window.innerWidth;
var height = screen.availWidth;
var length = width;

var title = document.getElementById("quGuangJie");
title.style.fontSize = length/7+"px";

var small = document.getElementById("shangPu");
small.style.fontSize = length/28+"px";

var buttons = document.getElementsByClassName("button");
for(var i=0; i<buttons.length;++i)
{
buttons[i].style.fontSize = length/15+"px";
buttons[i].style.height = length/13+"px";
}
document.getElementById("backgroundImg").width=width;
</script>

</body>
</html>
