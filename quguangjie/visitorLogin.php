﻿<!DOCTYPE HTML>
<?php session_start(); ?>

<html>
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" id="viewport" name="viewport" charset = utf-8>
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
}

.box
{
height :20px;
width: 200px
}

#ruzhu
{
width : auto;
margin-left: auto; 
margin-right: auto;
margin-top: 15%;
}

#mask
{
background-color: #4d7b95 ;
position:fixed;
left:0px;
top:0px;
width:100%;
height:100%;
z-index:1032;
opacity: 0; /* 通用，其他浏览器  有效*/
}

</style>
<body >
<div id="mask" hidden=true></div>
<?php
// define variables and set to empty values
$cellNum = $passCode ="";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   $cellNum = test_input($_POST["cellNum"]);
   $passCode = test_input($_POST["passCode"]);
}

$nameExist = true;
$codeCorrect = true;

$link = new mysqli("localhost","root","12345","quguangjie");
if($cellNum!="")
{
	$query = "select * from User where cellnumber = '$cellNum'";
	$result = $link->query($query);
	if($row = $result->fetch_assoc()) {
		echo "<h1>" . $row['passcode'] . "</h1>";
		if($row['passcode']!=$passCode)
		{
			$codeCorrect = false;
		}
		else
		{
			$_SESSION['userId']=$row['number'];
			if(!isset($_SESSION['fromShopId']))
				echo "<script type=\"text/javascript\" > location.assign('userMain.php') </script>";
			else
			{
				$fromOK="true";
			}
		}
	}
	else{
			$nameExist = false;
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
<div id = "title" >登录<br/>去逛街
</div>
<form id = "logIn" action="visitorLogin.php" method="post">
  <p class = "inputing">手机号码: <input class = "box" type="text" name="cellNum" value = "<?php echo $cellNum ?>"/><b class = "prompt"><?php if(!$nameExist) echo "未注册的号码" ?></b></b></p>
  <p class = "inputing">您的密码: <input class = "box" type="password" name="passCode" value = "<?php echo $passCode ?>" /><b class = "prompt"><?php if(!$codeCorrect) echo "密码输错了呢" ?></b></b></p>
</form>
<button type="button" onclick = "trySubmit()">登录</button>
<form id="from" action="viewShop.php" method="post" hidden=true>
	<input type="text" name="shopId" value="<?php if(isset($fromOK)) echo $_SESSION['fromShopId']; ?>"></input>
	<input type="text" name="mapName" value="<?php if(isset($fromOK)) echo $_SESSION['frommapName']; ?>"></input>
</form>
<script type="text/javascript">

function trySubmit()
{
    var boxing = document.getElementsByClassName("box");
	var flag=true;
    for(var i=0; i<boxing.length;++i)
    {
		if(boxing[i].value.length==0) {boxing[i].nextElementSibling.textContent = "此项不能为空"; flag=false;}
		else boxing[i].nextElementSibling.textContent = ""; 
    }
	if(flag)
	{
		jumping();
		//document.getElementById("logIn").submit();
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

var box = document.getElementsByClassName("box");
for(var i=0; i<box.length;++i)
{
box[i].style.width = length/4+"px";
}

var prompting = document.getElementsByClassName("prompt");
for(var i=0; i<prompting.length;++i)
{
prompting[i].style.fontSize = length/40+"px";
}

var alpha=0;
function jumping()
{
	document.getElementById("mask").hidden=false;
	self.setInterval("wiping()",20);
	var t=setTimeout("document.getElementById('logIn').submit();",600);
}
function wiping()
{
document.getElementById("mask").style.opacity=(alpha+=0.07);
}
<?php if(isset($fromOK))
{
	unset($_SESSION['fromShopId']);
	unset($_SESSION['frommapName']);
	unset($fromOK);
	echo "document.getElementById(\"from\").submit();";
}
?>
</script>

</body>
</html>
