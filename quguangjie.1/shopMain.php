﻿
<!DOCTYPE HTML> 
<?php session_start(); ?>
<html>
<head>
<link src="quguangjie.view.css" rel="stylesheet" type="text/css"/>
</head>
<body onunload="setCookieM()"> 
<?php
// define variables and set to empty values
function test_input($data) {
	$data = htmlspecialchars($data);
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
$link = new mysqli("localhost","root","12345","quguangjie");
$shopId = $_SESSION['shopId'];
$query = "select * from Shop where number = '$shopId'";
$result = $link->query($query);
if($row = $result->fetch_assoc()) {
	/*
	$shopName = $row['name'];
	$passCode = $row['passcode'];
	$seryCode = $row['certificate'];
	$shopAddress = $row['address'];
	$mainService = $row['service'];
	$shopCoordinateX = $row['coordinateX'];
	$shopCoordinateY = $row['coordinateY'];*/
	
	//echo "<div>您的用户信息为：ID " . $row['ID'] . " shopName " . $row['shopName'] . " seryCode " . $row['seryCode'] . " shopAddress " . $row['shopAddress'] . " mainService " . $row['mainService'] . "picSource" . $row['shopPicture'] . "</div>";
}
?>
<div id = "top_bar">
	<div class = "top_option" id="top_left" onclick="scroll1()">我的店铺</div>
	<div class = "top_div"></div>
	<div class = "top_option" id="top_mid" onclick="scroll2()">编辑活动</div>
	<div class = "top_div"></div>
	<div class = "top_option" id="top_right" onclick="scroll3()">收到的评论</div>
	<div class = "top_div"></div>
	<div class = "top_option" id="top_right" onclick="scroll4()">会员充值</div>
	<div class = "top_div"></div>
	<div class = "top_option" onclick="logout()">退出</div>
</div>
<?php
if(isset($_FILES['picUp']))
{
if ((($_FILES["picUp"]["type"] == "image/gif")
|| ($_FILES["picUp"]["type"] == "image/jpeg")
|| ($_FILES["picUp"]["type"] == "image/pjpeg"))
&& ($_FILES["picUp"]["size"] < 1000000))
  {
  if ($_FILES["picUp"]["error"] > 0)
    {
    echo "Return Code: " . $_FILES["picUp"]["error"] . "<br />";
    }
  else
    {
      move_uploaded_file($_FILES["picUp"]["tmp_name"],
      "sjtuShopPic/" . $_SESSION['shopId'] . ".jpg");
    }
  }
}
if(isset($_POST['coordinate1']))
{
	$coordinate1 = $_POST['coordinate1'];
	echo "    <script type=\"text/javascript\">window.scrollTo(0,'$coordinate1');</script> 
	";
}
?>
<div id = "title" >我的<br/>店铺
</div>
<div id = "shopInfo">
	<div id = "shopInfoImg">
		<img id ="img" onclick = "location.assign('headUp.php')" src="<?php echo $row['head'];?>" alt="未找到图片，点击添加"/>
	</div>

	<div id = "shopInfoTex">
		<p class = "CshopInfoTex"><?php echo "店名：" . $row['name'] ?></p>
		<p class = "CshopInfoTex"><?php echo "执照编码：" . $row['certificate'] ?></p>
		<p class = "CshopInfoTex"><?php echo "商铺地址：" . $row['address'] ?></p>
		<p class = "CshopInfoTex"><?php echo "主要业务：" . $row['service'] ?></p>
		<input class = "CshopInfoTex" onclick="location.assign('svgmaps/<?php echo $_SESSION['map'] . "_1.php" ?>')" value="更改地图坐标"/>
	</div>
</div>

<div id = "event">
	<div id = "editEvent">
	编辑活动
	<div id = "subEditEvent">
	
<?php
// define variables and set to empty values

//$query = $_SESSION['map']=="sjtuShop"?"select * from sjtuShopEventInfo where shopId = '$idNum'":"";
//$result = $link->query($query);
//$row = $result->fetch_assoc();
	if(!isset($_POST['eventMessage']))
	{
		echo "<form action=\"shopMain.php\" id=\"editEventForm\" method=\"post\">
				<p>当前活动</p>
				<p>活动简讯：<input type=\"text\" name=\"eventMessage\" id=\"shortBox\" value=\"" . $row['shortevent'] . "\"/></p>
				<p id = \"prompt1\"></p>
				<p><div id=\"adjust1\">活动详情：</div><div id=\"adjust2\"><textarea row=\"10\" col=\"10\" name=\"eventDetail\" id=\"longBox\" value=\"" . $row['event'] . "\">" . $row['event'] . "</textarea></div></p>
				<p id = \"prompt2\"></p>
				<input type=\"text\" hidden=true name=\"coordinate\" id=\"coordinate\"/>
				</form>
			<button type=\"button\" id=\"button\" onclick=\"tryRenewEvent()\">更新</button>";
	}
	else// if($row['shortevent']=="")
	{
		$eventMessage = test_input($_POST['eventMessage']);
		$eventDetail = test_input($_POST['eventDetail']);
		//UPDATE `quguangjie`.`sjtushopeventinfo` SET `eventMessage`='全场二折', `eventDetail`='假的的' WHERE `ID`='2';
		$query = "update Shop set event = '$eventDetail', shortevent = '$eventMessage' where number = $shopId";
								if($link->query($query)) ;
								else echo "query FAILED!!!!!!!!!";
		echo "<form action=\"shopMain.php\" id=\"editEventForm\" method=\"post\">
				<p>当前活动</p>
				<p>活动简讯：<input type=\"text\" name=\"eventMessage\" id=\"shortBox\" value=\"" . $eventMessage . "\"/></p>
				<p id = \"prompt1\"></p>
				<p><div id=\"adjust1\">活动详情：</div><div id=\"adjust2\"><textarea row=\"10\" col=\"10\" name=\"eventDetail\" id=\"longBox\" value=\"" . $eventDetail . "\">" . $eventDetail . "</textarea></div></p>
				<p id = \"prompt2\"></p>
				<input type=\"text\" hidden=true name=\"coordinate\" id=\"coordinate\"/>
				</form>
		<button type=\"button\" id=\"button\" onclick=\"tryRenewEvent()\">更新</button>";
	}/*
	else
	{
		$eventMessage = test_input($_POST['eventMessage']);
		$eventDetail = test_input($_POST['eventDetail']);
		//UPDATE `quguangjie`.`sjtushopeventinfo` SET `eventMessage`='全场二折', `eventDetail`='假的的' WHERE `ID`='2';
		$query = $_SESSION['map']=="sjtuShop"?"update sjtuShopEventInfo set eventMessage = '$eventMessage',eventDetail = '$eventDetail' where shopId = '$idNum'":"";
		$link->query($query);
		echo "<form action=\"shopMain.php\" id=\"editEventForm\" method=\"post\">
				<p>当前活动</p>
				<p>活动简讯：<input type=\"text\" name=\"eventMessage\" id=\"shortBox\" value=\"" . $eventMessage . "\"/></p>
				<p id = \"prompt1\"></p>
				<p><div id=\"adjust1\">活动详情：</div><div id=\"adjust2\"><textarea row=\"10\" col=\"10\" name=\"eventDetail\" id=\"longBox\" value=\"" . $eventDetail . "\">" . $eventDetail . "</textarea></div></p>
				<p id = \"prompt2\"></p>
				<input type=\"text\" hidden=true name=\"coordinate\" id=\"coordinate\"/>
				</form>
		<button type=\"button\" id=\"button\" onclick=\"tryRenewEvent()\">更新</button>";
	}*/
	if(isset($_POST['coordinate']))
	{
		$coordinate = test_input($_POST['coordinate']);
		echo "    <script type=\"text/javascript\">window.scrollTo(0,'$coordinate');</script>   ";
	}
?>
	</div>
	</div>
</div>

<div id="comments">
	收到的评论
	<div id="scrolling">
	<?php 
		$query = "select name,content,score from Remark,User where shopno = '$shopId' and User.number = Remark.userno order by time desc;";
		$result = $link->query($query);
		while($row = $result->fetch_assoc()) {
			if($row['content']!="")
			{
				echo "<div class = \"events\" >" . $row['name']. " 评论道：" . $row['content'] . "</div>"; 
				echo "<div class = \"events\" >打分 " . $row['score'] . " 分</div>";
				echo "<br/>";
			}
			else
			{
				echo "<div class = \"events\" >" . $row['name']. " 打分：" . $row['score'] . " 分</div>";
				echo "<br/>";
			}
		}
		?>
	</div>
</div>
<div id = "charge">
请向支付宝号13166221016转账，并注明执照编号和店名
</div>
<script type="text/javascript">
/*
function trysmt()
{
	document.getElementById("tsmt").submit();
}
*/
function setCookie(c_name,value,expiredays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate()+expiredays);
document.cookie=c_name+ "=" +escape(value)+
((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
function setCookieM()
{
	setCookie("shopMainCo",window.pageYOffset,1);
}
function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=");
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1;
    c_end=document.cookie.indexOf(";",c_start);
    if (c_end==-1) c_end=document.cookie.length;
    return unescape(document.cookie.substring(c_start,c_end));
    } 
  }
return ""
}

var co =getCookie("shopMainCo");
if(co!="")
	window.scrollTo(0,co);
function scroll1()
{
	window.scrollTo(0,0);
}

function scroll2()
{
	window.scrollTo(0,1400);
}

function scroll3()
{
	window.scrollTo(0,2600);
}

function scroll4()
{
	window.scrollTo(0,3800);
}

function logout()
{
	location.assign("logOut.php");
}

function tryRenewEvent()
{
	var shortBox = document.getElementById("shortBox");
	var longBox = document.getElementById("longBox");
	if(shortBox.value.length>5)
	{
		document.getElementById("prompt1").textContent="长度不能超过五个字符";
	}
	else document.getElementById("prompt1").textContent="";
	if(longBox.value.length>100)
	{
		var p =document.getElementById("prompt2").textContent="长度不能超过100个字符";
	}
	else document.getElementById("prompt2").textContent="";
	if(shortBox.value.length<=10&&longBox.value.length<=100)
	{
		document.getElementById("editEventForm").submit();
	}
}
function changePic()
{
	document.getElementById("picUpload").hidden=!document.getElementById("picUpload").hidden;
}

function submitPic()
{
	document.getElementById("formPicUpload").submit();
}
var img = document.getElementById("img")
{
	if(img.height>800)
	{
		img.height="800";
	}
}
</script>
</body>
</html>

