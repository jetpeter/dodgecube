<?php
include '../sql_config.php';

define('INSERTION', 'INSERT INTO scores (name, score, ipaddress) VALUES (?, ?, ?)');

$name = $_POST['name'];
$score = $_POST['score'];

if (is_null($name) || is_null($score)) {
	die("Invalid Params");
}

$ipaddress = $_SERVER["REMOTE_ADDR"];
if (is_null($ipaddress)) {
	$ipaddress = '192.168.1.100';
}

$mysqli = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB);
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$stmt = $mysqli->prepare(INSERTION);
$stmt->bind_param('sds', $name, $score, $ipaddress);
$stmt->execute();

$querySet = $mysqli->query('SELECT score, name FROM scores WHERE score < 700 OR ipaddress LIKE "' . $ipaddress . '" ORDER BY score DESC LIMIT 10');
$result = array();
$index = 0;
while ($row = mysqli_fetch_array($querySet)) {
	$result[] = $row;
	$index++;
}   
echo json_encode($result);
?>