<!DOCTYPE HTML>
<?php session_start(); ?>

<html>
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" id="viewport" name="viewport" charset = utf-8>
<head>
<link src="quguangjie.index.css" rel="stylesheet" type="text/css"/>
</head>
<body >
<div id="mask" hidden=true></div>
<?php
// define variables and set to empty values
$shopName = $passCode = $shopSite = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   $shopName = test_input($_POST["shopName"]);
   $passCode = test_input($_POST["passCode"]);
   $shopSite = test_input($_POST["site"]);
}

$nameExist = true;
$codeCorrect = true;

$link = new mysqli("localhost","root","12345","quguangjie");
if($shopSite!="")
{
	echo $shopSite;
	$query = "select number,passcode from Shop where name = '$shopName' and mapno = $shopSite";
	$result = $link->query($query);
	if($row = $result->fetch_assoc()) {
		if($row['passcode']!=$passCode)
		{
			$codeCorrect = false;
		}
		else
		{
			$_SESSION['shopId']=$row['number'];
			$_SESSION['map']=$shopSite;
			echo "<script type=\"text/javascript\"> location.assign(\"shopMain.php\");</script>";
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
<form id = "logIn" action="shopLogin.php" method="post">
  <p class = "inputing">您的店名: <input class = "box" type="text" name="shopName" value = "<?php echo $shopName ?>"/><b class = "prompt"><?php if(!$nameExist) echo "没有这家店呀" ?></b></b></p>
  <p class = "inputing">您的密码: <input class = "box" type="password" name="passCode" value = "<?php echo $passCode ?>" /><b class = "prompt"><?php if(!$codeCorrect) echo "密码输错了呢" ?></b></b></p>
  <p class = "inputing">您的位置: 
<select class = "box" name="site">
<option value="null" selected="selected">请选择地图</option>
<?php
				$query = "select * from Map order by name";
				$result = $link->query($query);
				while($maps = $result->fetch_assoc())
				{
					echo "<option value=" . $maps['number'] . ">" . $maps['name'] . "</option>";
				}
			//<option value="sjtuShop">上海交通大学闵行校区</option>
			?>
												</select><b class = "prompt"></b></p>
</form>
<button type="button" onclick = "trySubmit()">登录</button>
<div id = "ruzhu" onclick = "jumpToShopRegister()">我要入驻去逛街
</div>

<script type="text/javascript">
function jumpToShopRegister()
{

	document.getElementById("mask").hidden=false;
	self.setInterval("wiping()",50);
	var t=setTimeout("location.assign('shopRegister.php');",1000);
}

function trySubmit()
{
    var boxing = document.getElementsByClassName("box");
	var flag=true;
    for(var i=0; i<boxing.length;++i)
    {
		if(boxing[i].value.length==0) {boxing[i].nextElementSibling.textContent = "此项不能为空"; flag=false;}
		else boxing[i].nextElementSibling.textContent = ""; 
    }
	if(boxing[2].value=="null") {boxing[2].nextElementSibling.textContent = "此项不能为空"; flag=false;}
	else boxing[2].nextElementSibling.textContent = ""; 
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
function jumping(p)
{
	document.getElementById("mask").hidden=false;
	self.setInterval("wiping()",20);
	var t=setTimeout("document.getElementById('logIn').submit();",600);
}
function wiping()
{
document.getElementById("mask").style.opacity=(alpha+=0.07);
}
</script>

</body>
</html>
