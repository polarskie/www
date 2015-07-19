
<!DOCTYPE HTML> 
<?php session_start(); ?>
<html>
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" id="viewport" name="viewport" charset = utf-8>
<head>
<link src="quguangjie.index.css" rel="stylesheet" type="text/css"/>
</head>
<div id="mask" hidden=true></div>
<?php
// define variables and set to empty values
$name = $passCode = $checkCode = $cellNum = $veriCode = "";

$cellExist=false;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   $name = test_input($_POST["name"]);
   $passCode = test_input($_POST["passCode"]);
   $checkCode = test_input($_POST["checkCode"]);
   $cellNum = test_input($_POST["cellNum"]);
   $veriCode = test_input($_POST["veriCode"]);
}
if($name!="")
{
	$link = new mysqli("localhost","root","12345","quguangjie");
	$query = "select * from User where cellno = '$cellNum'";
	$result = $link->query($query);
	if(var_dump($result)) 
		$cellExist=true;
	else
	{
		$query = "insert into User(name,passcode,cellnumber)
					values('$name','$passCode','$cellNum')";

		if($link->query($query) == TRUE) {
			$query = "select number from User where name = '$name'";
			$result = $link->query($query);
			$row = $result->fetch_assoc();
			$_SESSION["userId"] = $row["number"];
			
			echo "<script type=\"text/javascript\" > location.assign('userMain.php') </script>";
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
<div id = "title" >注册<br/>去逛街
</div>
<form id ="register" action="visitorRegister.php" method="post">
  <p class = "inputing">起个名字*: <input class = "box" type="text" name="name" value = "<?php echo $name ?>"/><b class = "prompt"></b></p>
  <p class = "inputing">设个密码*: <input id = "passcode" class = "box" type="password" name="passCode" value = "<?php echo $passCode ?>" onblur = "checkPasscode()"/><b class = "prompt"></b></p>
  <p class = "inputing">重复一次*: <input id = "confirming" class = "box" type="password" name="checkCode" value = "<?php echo $checkCode ?>" onblur = "checkConfirming()"/><b class = "prompt""></b></p>
  <p class = "inputing">手机号码*: <input class = "box" type="text" name="cellNum" value = "<?php echo $cellNum ?>" /><b class = "prompt"><?php if($cellExist) echo "已经存在的手机号"?></b></p>
  <button class = "buttons" type="button" onclick = "sendVeriCode()">发送验证码</button>
  <p class = "inputing">输入验证码*：<input class = "box" type="text" name="veriCode" value = "<?php echo $veriCode ?>" /><b class = "prompt"></b></p>
<br />
</form>
<p>*项不能为空</p>
<button class = "buttons" type="button" onclick = "trySubmit()">注册</button>

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
	
	if(boxing[1].value!=boxing[2].value)
	{
		boxing[2].nextElementSibling.textContent = "和之前输入的不同哦";
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

