<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$pass = $date = "";

function validate_input($input){
	$input = trim($input);
	$input = stripslashes($input);
	$input = htmlspecialchars($input);
	return $input;
};

function find_separator($string){
	if(strpos($string, '/') > 0) return '/';
	if(strpos($string, '-') > 0) return '-';
	if(strpos($string, '.') > 0) return '.';
};

$pass = validate_input($request->password);
$date = validate_input ($request->ind_date);

$separator = find_separator($date);

$data = explode($separator, $date, 3);
$day = $data[0];
$month = $data[1];
$year = $data[2];

include 'opendbconnection.inc';
$sql = 'INSERT INTO indisponibilita (year, month, day, password) VALUES ("'.$year.'", "'.$month.'", "'.$day.'", "'.$pass.'")';
$ris=mysqli_query($db,$sql) or die();
mysqli_close($db); 
echo 'ok';
?> 