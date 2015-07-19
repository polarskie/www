
<!DOCTYPE HTML> 
<?php session_start(); ?>
<html>
<head>
</head>
<body> 
<form action="shopMain.php" method="post" id="form">
  <input type="text" name="ID" id = "idNum"/>
</form>
<?php
// define variables and set to empty values
$shopName = $passCode = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
   $shopName = test_input($_POST["shopName"]);
   $passCode = test_input($_POST["passCode"]);
   $shopSite = test_input($_POST["site"]);
}

$link = new mysqli("localhost","root","12345","quguangjie");
$query = $shopSite=="sjtuShop"?"select * from sjtuShop where shopName = '$shopName'":"";
$result = $link->query($query);
if($row = $result->fetch_assoc()) {
	if($row['passCode']!=$passCode)
	{
		echo "<script type=\"text/javascript\"> location.assign(\"shopLogin2.php\");</script>";
	}
	else
	{
		$_SESSION['ID']=$row['ID'];
		$_SESSION['map']=$shopSite;
		echo "<script type=\"text/javascript\"> location.assign(\"shopMain.php\");</script>";
	}
}
else{
		echo "<script type=\"text/javascript\"> location.assign(\"shopLogin2.php\");</script>";
}

function test_input($data) {
	$data = htmlspecialchars($data);
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>
<h1>fdafoehfifi</h1>

</body>
</html>

