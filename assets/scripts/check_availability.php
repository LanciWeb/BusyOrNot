<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$month = $request->month;
$year = $request->year;

$month++;
include 'opendbconnection.inc';
$sql = 'SELECT ID_ind, day FROM indisponibilita WHERE year='.$year.' AND month='.$month.'';
$ris = mysqli_query ($db, $sql) or die ("Impossibile recuperare i giorni");
while ($riga = mysqli_fetch_array($ris)){
			if ($json != "") {$json .= ",";}
			$json .= '{"id":"'  . $riga["ID_ind"] . '",';
			$json .= '"day":"'. $riga["day"] . '"}';
}
$json = '{"dates":['.$json.']}';
mysqli_close($db);
echo $json;
?>