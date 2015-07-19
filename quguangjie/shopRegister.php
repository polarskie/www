
<!DOCTYPE HTML> 
<?php session_start(); ?>
<html>
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" id="viewport" name="viewport" charset = utf-8>
<head>
<style type="text/css">
#title
{
	font-family: 黑体, serif;
font-size : 25px;
color: #ffffff;
width:auto;
margin-left: auto; 
margin-right: auto;
margin-top: 5%;
}

body
{
	font-family: 黑体, serif;
background-color: #4d7b95;
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

form
{
width : auto;
margin-left: auto; 
margin-right: auto;
margin-top: 5%;
}

p
{
font-size: 1.5em;
text-align:center;
}
/*
.box
{
height :45px;
width: 200px;
}
*/
#ruzhu
{
width : 90px;
margin-left: auto; 
margin-right: auto;
margin-top: 15%;
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

</style>
</head>
<body > 
<div id="mask" hidden=true></div>
<?php
// define variables and set to empty values
$shopName = $map = $passCode = $checkCode = $seryCode = $shopAddress = $mainService = "";

$exist1=false;
$exist2=false;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   $shopName = test_input($_POST["shopName"]);
   $map = test_input($_POST["site"]);
   $passCode = test_input($_POST["passCode"]);
   $checkCode = test_input($_POST["checkCode"]);
   $seryCode = test_input($_POST["seryCode"]);
   $shopAddress = test_input($_POST["shopAddress"]);
   $mainService = test_input($_POST["mainService"]);
}

if($shopName!="")
{
	$link = new mysqli("localhost","root","12345","quguangjie");
	$query = "select * from sjtuShop where shopName = '$shopName'";
	$result = $link->query($query);
	$query = "select * from sjtuShop where seryCode = '$seryCode'";
	$result1 = $link->query($query);
	if($result->fetch_assoc()) 
	{
		$exist1=true;
	}
	if($result1->fetch_assoc()) 
	{
		$exist2=true;
	}
	
	if(!$exist1&&!$exist2)
	{
		$query = "insert into sjtuShop(shopName,passCode,seryCode,shopAddress,mainService,level)
		values('$shopName','$passCode','$seryCode','$shopAddress','$mainService',1)";

		if($link->query($query) == TRUE) {
			$query = "select * from sjtuShop where shopName = '$shopName'";
			$result = $link->query($query);
			$row = $result->fetch_assoc();
			$_SESSION["shopId"] = $row["ID"];
			$idNum = $row["ID"];
			$_SESSION['map'] = "sjtuShop";
			
			$query = "insert into sjtuShopEventInfo(shopName, eventMessage, eventDetail, eventCoordinateX, eventCoordinateY, shopId, level)
								values('$shopName', ' ', ' ', '-1',  '-1', '$idNum', '2');";
								
			if(!$link->query($query))
				echo $query;
/*			if($link->query($query) == TRUE) {
				$query = "select * from sjtuShop where shopName = '$shopName'";
				$result = $link->query($query);
				$row = $result->fetch_assoc();
				$_SESSION["shopId"] = $row["ID"];
				$_SESSION['map'] = "sjtuShop";*/
			echo "<script type=\"text/javascript\" > location.assign('shopMain.php') </script>";
		}
		else{
			echo "failed!!!";
		}
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
<body >

<div id = "title" >入驻<br/>去逛街
</div>
<form id ="register" action="shopRegister.php" method="post">
  <p class = "inputing">您的店名*: <input class = "box" type="text" name="shopName" value = "<?php echo $shopName ?>" /><b class = "prompt"><?php if($exist1) echo "这家店已经注册了" ?></b></p>
  <p class = "inputing">您的位置*: 
<select class = "box" name="site" >
<option value="null" selected="selected">请选择地图</option>
<option value="sjtuShop">上海交通大学闵行校区</option>
												</select><b class = "prompt"></b></p>
  <p class = "inputing">您的密码*: <input id = "passcode" class = "box" type="password" name="passCode" value = "<?php echo $passCode ?>" onblur = "checkPasscode()"/><b class = "prompt"></b></p>
  <p class = "inputing">重复密码*: <input id = "confirming" class = "box" type="password" name="checkCode" value = "<?php echo $checkCode ?>" onblur = "checkConfirming()"/><b class = "prompt""></b></p>
  <p class = "inputing">执照编码*: <input class = "box" type="text" name="seryCode" value = "<?php echo $seryCode ?>" /><b class = "prompt"><?php if($exist2) echo "这家店已经注册了" ?></b></p>
  <p class = "inputing">商铺地址: <input class = "longBox" type="text" name="shopAddress" value = "<?php echo $shopAddress ?>" /><b class = "prompt"></b></p>
  <p class = "inputing">主要业务（以空格分隔）: <input class = "longBox" type="text" name="mainService" value = "<?php echo $mainService ?>" /><b class = "prompt"></b></p>

<br />
</form>
<p>*项不能为空</p>
<button type="button" onclick = "trySubmit()">入驻</button>

<script type="text/javascript">
/*
function checkPasscode()
{
var passcode = document.getElementById("passcode");
if(passcode.value.length<5) 
{
passcode.focus();
var a=document.getElementById("a2");
a.textContent = "密码应长于5位";
}
}*/

function trySubmit()
{
    var boxing = document.getElementsByClassName("box");
	var flag=true;
    for(var i=0; i<boxing.length;++i)
    {
		if(boxing[i].value.length==0) {boxing[i].nextElementSibling.textContent = "此项不能为空"; flag=false;}
		else boxing[i].nextElementSibling.textContent = ""; 
    }
	if(boxing[1].value=="null") 
	{
		boxing[1].nextElementSibling.textContent = "此项不能为空"; 
		flag=false;
	}
	else boxing[1].nextElementSibling.textContent = ""; 
	
	if(boxing[2].value!=boxing[3].value)
	{
		boxing[3].nextElementSibling.textContent = "和之前输入的不同哦";
		flag = false;
	}
	if(flag)
	{
		jumping();
	}
}

var width = screen.availWidth;
var height = screen.availWidth;
var length = width;

var title = document.getElementById("title");
title.style.fontSize = length/8+"px";

var inputing = document.getElementsByClassName("inputing");
for(var i=0; i<inputing.length;++i)
{
inputing[i].style.fontSize = length/25+"px";
}

var prompting = document.getElementsByClassName("prompt");
for(var i=0; i<prompting.length;++i)
{
prompting[i].style.fontSize = length/40+"px";
}

var box = document.getElementsByClassName("box");
for(var i=0; i<box.length;++i)
{
box[i].style.width = length/4+"px";
box[i].style.height = height/21+"px";
box[i].style.fontSize = height/28+"px";
}

box = document.getElementsByClassName("longBox");
for(var i=0; i<box.length;++i)
{
box[i].style.width = length/2+"px";
box[i].style.height = height/21+"px";
box[i].style.fontSize = height/28+"px";
}
var alpha=0;
function jumping()
{
	document.getElementById("mask").hidden=false;
	self.setInterval("wiping()",20);
	var t=setTimeout("document.getElementById('register').submit();",600);
}
function wiping()
{
document.getElementById("mask").style.opacity=(alpha+=0.07);
}
</script>
</body>
</html>

