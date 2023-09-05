<?php
require 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');



$sql = " SELECT bb.gate 'Σημείο',  DATE_FORMAT(aa.datetime,'%d/%m/%Y %H:%i') 'Ημερ/νια κ Ώρα',  sum(aa.value) 'Πεζοί' " . 
" FROM  sensor_measures_history aa, sensor_measures bb  " . 
" where aa.measure_id = bb.id  " . 
" group by gate, datetime  " . 
" order by gate_id, aa.datetime ";

# Try query or error
$result = mysqli_query($con, $sql);  
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}

$row = mysqli_fetch_array($result, MYSQLI_ASSOC);

$fp = fopen('athens_pedestrian_data.csv', 'w');

foreach ($row as $val) {
    fputcsv($fp, $val);
}

fclose($fp);

?>

