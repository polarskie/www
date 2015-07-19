
<!DOCTYPE html>
<html>
<head>
<link src="quguangjie.index.css" rel="stylesheet" type="text/css"/>
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