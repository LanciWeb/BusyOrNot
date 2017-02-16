<?php
header("Content-Type: application/json; charset=UTF-8");

include 'opendbconnection.inc';
$sql = 'SELECT * FROM indisponibilita ORDER BY year DESC, month DESC, day DESC';
$ris = mysqli_query($db, $sql) or die("Impossibile recuperare i dati dal database!");
while ($riga = mysqli_fetch_array($ris))
		{
			if ($json != "") {$json .= ",";}
			$json .= '{"id":"'  . $riga["ID_ind"] . '",';
			$json .= '"year":"'   . $riga["year"] . '",';
			$json .= '"month":"'   . $riga["month"] . '",';
			$json .= '"day":"'   . $riga["day"] . '",';
			$json .= '"password":"'   . $riga["password"] . '",';
			$json .= '"status":"'. $riga["status"] . '"}';
		}
$json = '{"dates":['.$json.']}';
mysqli_close($db);
echo $json;
?>