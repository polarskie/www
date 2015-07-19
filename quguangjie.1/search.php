
<!DOCTYPE HTML> 
<?php session_start(); ?>
<html>
<head>
<link src="quguangjie.index.css" rel="stylesheet" type="text/css"/>
</head>
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

