
<!DOCTYPE HTML> 
<?php 
session_start(); 
if(isset($_SESSION['map']))
{
	if($_SESSION['map']=="sjtuShop")
		echo "<script type=\"text/javascript\"> location.assign(\"svgmaps/sjtuLocating.php\");</script>";
}
?>