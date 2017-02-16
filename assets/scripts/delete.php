<?php
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$id = $request->id;

include 'opendbconnection.inc';
$sql = 'DELETE FROM indisponibilita WHERE ID_ind='.$id.'';
$ris = mysqli_query($db, $sql) or die("Impossibile eliminare i dati dal database!");
mysqli_close($db);
echo'ok';
?>