
<!DOCTYPE HTML> 
<?php session_start(); ?>
<html>
<style type="text/css">
div{
-moz-user-select: none;
-khtml-user-select: none;
user-select: none;
font-family: 黑体, serif;
	font-size:35px;
}
#title
{
font-family: 黑体, serif;
font-size : 100px;
height: 300px;
margin-left: auto; 
margin-right: auto;
padding-top: 100px;
color:white;
vertical-align:center;
}
#back
{
font-family: 黑体, serif;
font-size : 100px;
height: 300px;
margin-left: auto; 
margin-right: auto;
padding-top: 100px;
color:white;
vertical-align:center;
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
.events
{
	margin-left: auto; 
	margin-right: auto;
	width:90%;
	word-wrap: break-word;
	word-break:break-all;
	background-color:white;
	text-align:left;
}

.button
{
	width:auto;
	font-size:40px;
	height:auto;
}
#searchOut
{
	width:75%;
	margin:auto;
}
</style>
<body> 
<div id="title">
搜索结果
</div>
<div id="searchOut">
<?php
function test_input($data) {
	$data = htmlspecialchars($data);
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
// define variables and set to empty values
$keyWord="";
$shopMap="";
$userName="";
$aimArr="";
$link = new mysqli("localhost","root","12345","quguangjie");
if(isset($_POST['keyWord'])&&isset($_SESSION['mapId']))
{
$keyWord = test_input($_POST['keyWord']);
$mapId = $_SESSION['mapId'];
$query = "select * from Shop where mapno = $mapId and (service like '%$keyWord%' or name like '%$keyWord%') order by level";
$result = $link->query($query);
$i=0;
while($row = $result->fetch_assoc()) {
	echo "<div class = \"events\" onclick = 'forDetail(" . $row['number'] . ")'>店名：" . $row['name']. " <br/>主要业务：" . $row['service'] . " <br/>商铺位置：" . $row['address'] . "</div>";
	echo "<form action=\"viewShop.php\" method=\"post\" ><input hidden=true type=\"text\" value = \"" . $row['number'] . "\" name = \"shopId\"/><input hidden=true type=\"text\" value = \"" . $_SESSION['mapId'] . "\" name = \"mapName\"/><input class=\"button\" type=\"submit\" value = \"点击进入店家页面\"></form>";
	echo "<br/>";
	$aimArr[$i++]=$row['name'];
}
}
$_SESSION['aimArray']=$aimArr;
echo count($_SESSION['aimArray']);
?>

</div>
<div onclick="back()" id="back">
返回
</div>
<script type="text/javascript">
function back()
{
	location.assign("svgmaps/<?php echo $_SESSION['mapId'] ?>.php")
}
</script>
</body>
</html>

