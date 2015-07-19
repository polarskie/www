
<!DOCTYPE HTML> 
<?php session_start(); ?>
<html>
<head>
<link src="quguangjie.view.css" rel="stylesheet" type="text/css"/>
</head>
<body onunload="setCookieM()"> 
<?php
function test_input($data) {
	$data = htmlspecialchars($data);
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
// define variables and set to empty values

$link = new mysqli("localhost","root","12345","quguangjie");
if(!isset($_SESSION['userId']))
	header("Location:visitorLogin.php"); 

$idNum = $_SESSION['userId'];
$query = "select * from User where number = '$idNum'";
$result = $link->query($query);
if($row = $result->fetch_assoc()) {
	//echo "<div>您的用户信息为：ID " . $row['ID'] . " shopName " . $row['shopName'] . " seryCode " . $row['seryCode'] . " shopAddress " . $row['shopAddress'] . " mainService " . $row['mainService'] . "picSource" . $row['shopPicture'] . "</div>";
}
?>
<div id = "title" >我的<br/>去逛街
</div>
<div id = "left_bar">
	<div class = "left_option" onclick="scroll1()">基本信息</div>
	<div class = "left_option" onclick="scroll2()">当前活动</div>
	<div class = "left_option" onclick="scroll3()">我的评论</div>
	<div class = "left_option" onclick="selectMap()">进入地图</div>
	<div class = "left_option" onclick="logout()">退出</div>
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
      "userPic/" . $_SESSION['userId'] . ".jpg");
    }
  }
}
if(isset($_POST['coordinate1']))
{
	$coordinate1 = test_input($_POST['coordinate1']);
	echo "    <script type=\"text/javascript\">window.scrollTo(0,'$coordinate1');</script> 
	";
}
?>
<div id = "userInfo">
	<div id = "userInfoImg">
		<img id ="img" src="<?php echo $row["head"];?>" onclick = "location.assign('headUp.php')" alt="未找到图片，点击添加"/>
	</div>

	<div id = "userInfoTex">
	<p class = "CuserInfoTex">名字：<?php echo $row['name'] ?></P>
	<p class = "CuserInfoTex">手机号码：<?php echo $row['cellnumber'] ?></P>
	<p class = "CuserInfoTex">账号等级：<?php $ex = floor(pow($row['experience']+1,0.4)); echo $ex; ?></P>
	<p class = "CuserInfoTex">经验值：<?php echo $row['experience'] . "/" . (floor(pow($ex+1,2.5))); ?></p>
	</div>
</div>

<div id = "event">
	<div id="redBlock">
	<p class = "infraTitle">当前活动</p>
	<form id ="mapSelect" action="userMain.php" method="post">
		<select id = "box" name="site" onchange="send()">
			<option value="null" selected="selected">请选择地图</option>
			<?php
				$query = "select * from Map order by name";
				$result = $link->query($query);
				while($maps = $result->fetch_assoc())
				{
					echo "<option value=" . $maps['number'] . ">" . $maps['name'] . "</option>";
				}
			//<option value="sjtuShop">上海交通大学闵行校区</option>
			?>
		</select></p>
		<input type="text" hidden=true name="coordinate" id="coordinate"/>
	</form>
<?php
// define variables and set to empty values
if(isset($_POST['site']))
{
$eventInfo = test_input($_POST['site']);
$coordinate = test_input($_POST['coordinate']);
$query = "select number,name,shortevent,event from Shop where mapno='$eventInfo' order by level;";
$result = $link->query($query);
echo "<div id=\"subEvent\">";
while($row = $result->fetch_assoc()) {
	echo "<div class = \"events\" onclick = 'forDetail(" . $row['number'] . ")'>店名：" . $row['name']. " <br/>活动信息：" . $row['shortevent'] . "</div>";
	echo "<div class = \"events\" id=\"" . $row['number'] . "\"hidden=true >活动详情：" . $row['event'] . "<form action=\"viewShop.php\" method=\"post\" ><input hidden=true type=\"text\" value = \"" . $row['number'] . "\" name = \"shopId\"/><input hidden=true type=\"text\" value = \"" . $eventInfo . "\" name = \"mapName\"/><input class=\"button\" type=\"submit\" value = \"点击进入店家页面\"></form></div>";
	echo "<br/>";
}
echo "</div>";
}
?>
	</div>
	<form id ="callForDetail" hidden=true action="userMain.php" method="post">
		<input id = "cfdId" type="text" name="eventId"/>
	</form>
</div>
<div id="comments">
	<p class = "infraTitle">我的评论</p>
	<div id="scrolling">
	<?php 
		$query = "select Shop.name shopname,content,Remark.score remarkscore,time from Shop,Remark where Remark.userno = '$idNum' and Shop.number = Remark.shopno order by Remark.time desc;";
		$result = $link->query($query);
		$i=0;
			while($row = $result->fetch_assoc()) {
				echo "<div class = \"events\" >我对 " . $row['shopname']. " <br/>评论道：" . $row['content'] . "</div>";
				echo "<br/>";
				$i++;
			}
		if($i==0)
		{
			echo "<div class = \"events\" >我还没有做出任何评价</div>";
		}
		?>
	</div>
</div>

<script type="text/javascript">
function scroll1()
{
	window.scrollTo(0,0);
}

function scroll2()
{
	window.scrollTo(0,1500);
}

function scroll3()
{
	window.scrollTo(0,2700);
}

function logout()
{
	location.assign("logOut.php");
}

function send()
{
	var mapSelection = document.getElementById("box");
	document.getElementById("coordinate").value=window.pageYOffset;
	if(mapSelection.value!="null")
	{
		document.getElementById("mapSelect").submit();
	}
}

function forDetail(id)
{
	document.getElementById(id).hidden=!document.getElementById(id).hidden;
}

function changePic()
{
	document.getElementById("picUpload").hidden=!document.getElementById("picUpload").hidden;
}

function submitPic()
{
	document.getElementById("formPicUpload").submit();
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
	setCookie("userMainCo",window.pageYOffset,1);
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
function selectMap()
{
	location.assign("selectMap.php");
}
var co =getCookie("userMainCo");
if(co!="")
	window.scrollTo(0,co);

var width = screen.availWidth;
var height = screen.availWidth;
var length = width;
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

