
<!DOCTYPE html>
<html>
<body>
 
</head>
<body>

<script type="text/javascript">
<?php
$distance=9999;
$savePlace="";
$Longitude="";
$Latitude="";
if(isset($_POST['Longitude'])&&isset($_POST['Latitude']))
{
	$Longitude=$_POST['Longitude'];
	$Latitude=$_POST['Latitude'];
$link = new mysqli("localhost","root","12345","quguangjie");
$query = "select * from mapList";
$result = $link->query($query);
while($row = $result->fetch_assoc())
{
	$temp=($Longitude-$row['Longitude'])*($Longitude-$row['Longitude'])+($Latitude-$row['Latitude'])*($Latitude-$row['Latitude']);
	if(100 < $distance)
	{
		$distance = $temp;
		$savePlace = $row['savePlace'];
	}
}
echo "location.assign(\"" . $savePlace . "\")";
}
?>
</script>
</body>
</html>