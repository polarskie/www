
<!DOCTYPE html>
<html>
<body>
 
<style type="text/css">
.title
{
font-family: 黑体, serif;
font-size:5em;
color: #ffffff;
width:auto;
margin-left: auto; 
margin-right: auto;
margin-top: 5%;
margin-bottom: 25%;
}

body
{
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

.selection
{
background:rgba(0, 0, 0, 0.4);
	font-family: 黑体, serif;
color: #ffffff;
width:auto;
margin-left: auto; 
margin-right: auto;
margin-top: 5%;
margin-bottom: 25%;
font-size:24px;
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
<body>
<div id="mask" hidden=true>
</div>

<div text-align = "center" class="title" id="quGuangJie">选地图<br/>去逛街!</div>
<form hidden='true' id='form' method="post">
	<input name="mapId"></input>
</form>
<?php
$link = new mysqli("localhost","root","12345","quguangjie");
$query = "select * from Map order by name";
$result = $link->query($query);
while($row = $result->fetch_assoc())
{
	echo "<div class = \"selection\"   onclick = \"jumping('" . $row['number'] . "')\">" . $row['name'] . "</div>";
}

?>
<script type="text/javascript">
var alpha=0;
function jumping(p)
{
	document.getElementById("mask").hidden=false;
	self.setInterval("wiping()",20);
	var t=setTimeout("loadMap(" + p + ");",600);
}
function wiping()
{
document.getElementById("mask").style.opacity=(alpha+=0.07);
}

function loadMap(p)
{
	var form = document.getElementById("form");
	form.action = "svgmaps/" + p + ".php";
	form.children[0].value = p;
	form.submit();
}

var width = screen.availWidth;
var height = screen.availWidth;
var length = width;

var title = document.getElementById("quGuangJie");
title.style.fontSize = length/8+"px";
</script>
</body>
</html>