<html>
<body>
<?php
$link = new mysqli("localhost","root","12345","quguangjie");
$query = //"update mapList set savePlace = 'svgmaps/sjtu.svg' where mapName = '上海交通大学闵行校区' ";
//"insert into mapList (mapName,address,savePlace)
//values( '上海交通大学闵行校区','上海市闵行区东川路800号','D:/svgmaps/sjtu.svg')";
"CREATE TABLE Persons
(
Id int not null auto_increment primary key,
LastName varchar(255),
FirstName varchar(255),
Address varchar(255),
City varchar(255)
)";

if($link->query($query) == TRUE) {
	echo "成功";
}
else{
	echo "失败!!!";
}
?>

</body>
</html>
