
<!DOCTYPE HTML> 
<?php 
session_start(); 
$npx="";
$npy="";
$idNum="";
if(isset($_SESSION['shopId'])&&isset($_SESSION['map'])&&isset($_POST['npx'])&&isset($_POST['npy']))
{
	$npx=$_POST['npx'];
	$npy=$_POST['npy'];
	$idNum=$_SESSION['shopId'];
	$link = new mysqli("localhost","root","12345","quguangjie");
	$query = "update Shop set coordinateX = '$npx',coordinateY = '$npy' where number = '$idNum'";
	$link->query($query);
	echo "<script type=\"text/javascript\"> location.assign(\"shopMain.php\");</script>";
}
?>