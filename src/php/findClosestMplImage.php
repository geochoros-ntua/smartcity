<?php
require 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
$x = $_REQUEST['x'];
$y = $_REQUEST['y'];

$sql = 'SELECT P.ID, ST_DISTANCE(Point(' . $x .' , ' . $y . '), P.GEOM) AS dist FROM mapillary_images P ORDER BY dist LIMIT 1';


# Try query or error
$rs = mysqli_query($con, $sql);  
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}

$rows = array();
while($r = mysqli_fetch_assoc($rs)) {
    $feature = array(
        'id' => $r['ID']
        );
    array_push($rows, $feature);
}
echo json_encode( $rows);
$con = NULL;



?>