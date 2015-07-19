
<!DOCTYPE HTML> 
<?php session_start(); ?>
<html>
<head>
<style type="text/css">
#title
{
font-family: 黑体, serif;
font-size : 100px;
color: #ffffff;
width:auto;
height: 200px;
margin-left: auto; 
margin-right: auto;
margin-top: 5%;
}
div{
	font-family: 黑体, serif;
-moz-user-select: none;
-khtml-user-select: none;
user-select: none;
}
body
{
background-color: #4d7b95;
text-align:center;
}

#top_bar
{
	position:fixed;
	left:0%;
	right:60px;
	top:0%;
	z-index: 1030;
	width:40px;
	font-size:35px;
}

.top_option{
    margin-top: 10px;
	width:100%;
	box-sizing: border-box;
	text-align:center;
	padding-top:8px;
	padding-bottom:8px;
	overflow: hidden;
	color:white;
}
#shopInfo
{
	margin-left: auto; 
	margin-right: auto;
	width:75%;
	height:510px;
	font-size:40px;
	margin-bottom:200px;
}

#shopInfoImg
{
	float:left;
	width:30%;
	height:100%;
}
img
{
	width : 100%;
}

#shopInfoTex
{
	text-align:left;
	float:left;
	width:70%;
}

.CshopInfoTex
{
	margin-left:10%;
}

#comments
{
	margin-left: auto;
	margin-right: auto;
	width:80%;
	height:1200px;
	font-size:40px;
}
.events
{
	text-align:left;
	width:100%;
	word-wrap: break-word;
	word-break:break-all;
	background-color:white;
}
#addingComm
{
	width:100%;
	text-align:left;
}
#myComm
{
	width:180px;
	height:40px;
	font-size:30px;
	
}
#myCommContent
{
	width:100%;
	font-size:40px;
}
</style>
</head>
<body onunload="setCookieM()"> 
<div id = "top_bar">
	<div class = "top_option" id="top_left" onclick="gotoMap()">进入地图</div>
	<div class = "top_div"></div>
	<div class = "top_option" id="top_mid" onclick="gotoMain()">我的主页</div>
	<div class = "top_div"></div>
	<div class = "top_option" id="top_right" onclick="backtoTop()">回到顶部</div>
</div>
<?php
function test_input($data) {
	$data = htmlspecialchars($data);
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
// define variables and set to empty values
$row['head']="";
$row['name']="";
$row['address']="";
$row['service']="";
$row['score']="";
$row['commentnum']="";
$idNum="";
$shopMap="";
$userName="";
$link = new mysqli("localhost","root","12345","quguangjie");
if(isset($_POST['shopId'])&&isset($_POST['mapName']))
{
$shopMap=test_input($_POST['mapName']);
$idNum = test_input($_POST['shopId']);
$_SESSION['fromShopId']=$_POST['shopId'];
$_SESSION['frommapName']=$_POST['mapName'];
$query = "select * from Shop where number = '$idNum'";
$result = $link->query($query);
if($row = $result->fetch_assoc()) {
	//echo "<div>您的用户信息为：ID " . $row['ID'] . " shopName " . $row['shopName'] . " seryCode " . $row['seryCode'] . " shopAddress " . $row['shopAddress'] . " mainService " . $row['mainService'] . "picSource" . $row['shopPicture'] . "</div>";
}
if(isset($_POST['newComm']))
{
	$comments=test_input($_POST['newComm']);
	$ranking=test_input($_POST['ranking']);
	$axis = 1;
	if(strlen($comments)>14) $axis=3;
	$newScore = ($row['score'] * $row['commentnum'] + $ranking * $axis)/($row['commentnum']+$axis);
	$newCommentCount = $row['commentnum'] + $axis;
	//echo $newScore;
	$query = "update Shop set score = '$newScore',commentnum = '$newCommentCount' where number = '$idNum'";
	$result = $link->query($query);
	$shopName = $row['name'];
	$userIdNum = $_SESSION['userId'];
	//$time=time();
	//echo "<h1>$time</h1>";
	$query = "insert into Remark(userno,shopno,content,score)
								values('$userIdNum','$idNum','$comments','$ranking')";
	$link->query($query);
	
	//更新row内容
	$query = "select * from Shop where number = '$idNum'";
	$result = $link->query($query);
	$row = $result->fetch_assoc();
}
/*
$query = $_POST['mapName']=="sjtuShop"?"select * from sjtuShop where ID = '$idNum'":"";
$result = $link->query($query);
if($row = $result->fetch_assoc()) {
	//echo "<div>您的用户信息为：ID " . $row['ID'] . " shopName " . $row['shopName'] . " seryCode " . $row['seryCode'] . " shopAddress " . $row['shopAddress'] . " mainService " . $row['mainService'] . "picSource" . $row['shopPicture'] . "</div>";
}
	//echo "<div>您的用户信息为：ID " . $row['ID'] . " shopName " . $row['shopName'] . " seryCode " . $row['seryCode'] . " shopAddress " . $row['shopAddress'] . " mainService " . $row['mainService'] . "picSource" . $row['shopPicture'] . "</div>";
*/
}
?>
<div id = "title">逛店铺</div>
<div id = "shopInfo">
	<div id = "shopInfoImg">
		<img src="
			<?php
			echo $row['head'];
			?>"
		  alt="未找到图片，点击添加"/>
	</div>

	<form action="svgmaps/sjtuMap.php" method="post" hidden=true id="submitAim">
		<input type="text" id="aim" name="aim" value="<?php echo $row['name']; ?>"></input>
	</form>
	<div id = "shopInfoTex">
		<p class = "CshopInfoTex"><?php echo "店名：" . $row['name'] ?></p>
		<p class = "CshopInfoTex"><?php echo "评级：" . round($row['score'],1) ?></p>
		<p class = "CshopInfoTex"><?php echo "商铺地址：" . $row['address'] ?></p>
		<p class = "CshopInfoTex"><?php echo "主要业务：" . $row['service'] ?></p>
		<p class = "CshopInfoTex"><?php echo "当前活动：" . $row['shortevent'] ?></p>
		<p class = "CshopInfoTex"><?php echo "活动详情：" . $row['event'] ?></p>
	</div>
</div>

<div id="comments">
	<div id = "addingComm">
		<button onclick="<?php if(isset($_SESSION['userId'])) echo "tryToSubmit()";
			else echo "gotoMain()";
	?>" id = "myComm" >添加评论</button><form method="post" action="viewShop.php" id="formComment">
		<div><textarea row =10 col = 10 id="myCommContent" name="newComm"></textarea></div>
		<div>打个分：<input min = "0" max = "10" type="range" id="ranking" name="ranking" /></div>
		<input name="shopId" hidden=true value="<?php echo $idNum; ?>"/>
		<input name="mapName" hidden=true value="<?php echo test_input($shopMap); ?>"/>
	</form><p id="prompt"></p></div>
	<?php 
		$query = "select * from Remark,User where Remark.shopno = '$idNum' and User.number = Remark.userno order by time desc;";
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
<script type="text/javascript">
function backtoTop()
{
	window.scrollTo(0,0);
}
function defaultImg(p)
{
	p.src="shopPic/default.jpg";
}
function setCookie(c_name,value,expiredays)
{
var exdate=new Date();
exdate.setDate(exdate.getDate()+expiredays);
document.cookie=c_name+ "=" +escape(value)+
((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}
function setCookieM()
{
	setCookie("viewShopCo",window.pageYOffset,1);
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
var co =getCookie("viewShopCo");
if(co!="")
	window.scrollTo(0,co);

function tryToSubmit()
{
	var dd=document.getElementById("myCommContent");
	if(document.getElementById("myCommContent").textLength>100)
	{
		document.getElementById("prompt").textContent="字数不能超过100的";
	}
	else
	{
		document.getElementById("formComment").submit();
	}
}
function gotoMap()
{
	document.getElementById("submitAim").submit();
}

function gotoMain()
{
	<?php if(isset($_SESSION['userId'])) echo "location.assign(\"userMain.php\");";
			else echo "location.assign(\"visitorLogin.php\");";
	?>
}
</script>
</body>
</html>

