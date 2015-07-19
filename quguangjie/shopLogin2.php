<!DOCTYPE HTML>

<html>
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" id="viewport" name="viewport" charset = utf-8><style type="text/css">
#title
{
font-family: 华文彩云,黑体, serif;
font-size : 25px;
color: #ffffff;
width:auto;
margin-left: auto; 
margin-right: auto;
margin-top: 5%;
}

body
{
background-color: #d70210;
text-align:center;
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

</style>
<body >
<div id = "title" >登录<br/>去逛街
</div>
<form id = "logIn" action="shopLogin1.php" method="post">
  <p class = "inputing">您的店名: <input class = "box" type="text" name="shopName" /><b class = "prompt"></b></p>
  <p class = "inputing">您的密码: <input class = "box" type="password" name="passCode" /><b class = "prompt"></b></p>
  <p class = "inputing">您的位置: 
<select class = "box" name="site">
<option value="null" selected="selected">请选择地图</option>
<option value="sjtuShop">上海交通大学闵行校区</option>
												</select><b class = "prompt"></b></p>
</form>
<button type="button" onclick = "trySubmit()">登录</button>
<p id = tishi>用户名或密码输错了?</p>
<div id = "ruzhu" onclick = "jumpToShopRegister()">我要入驻去逛街
</div>

<script type="text/javascript">
function jumpToShopRegister()
{
location.assign("shopRegister.html");
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
		document.getElementById("logIn").submit();
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
</script>

</body>
</html>

