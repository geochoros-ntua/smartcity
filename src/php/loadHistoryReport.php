<?php
require 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

$sensid = $_REQUEST['sensid'];
$reportType = $_REQUEST['reportType'] ? $_REQUEST['reportType'] : 'hour';
$from = $_REQUEST['from'];
$to = $_REQUEST['to'];

$sql = "";
if ($reportType == 'day'){
    $sql = " SELECT (select label from sensor_points where id =  $sensid) as title, " . 
    " CONCAT(date(datetime), \" (\", DAYNAME(date(datetime)), \")\") as label,  date(datetime) date, SUM(ABS(value)) as value " .
    " from sensor_measures_history " . 
    " where date(datetime) between date('$from') and date('$to') " . 
    " and measure_id in (select id from sensor_measures where sensor_id = $sensid)" . 
    " GROUP BY date " . 
    " order by date ";
} else if ($reportType == 'hour'){
    $sql = " SELECT (select label from sensor_points where id =  $sensid) as title, " .
    " datetime as label, " .
    " CONCAT(DATE_FORMAT(datetime, '%Y-%m-%d'), '-', HOUR(DATE_FORMAT(datetime,'%H:%i:%s'))) as DATEHOUR, " . 
    " date(datetime) date, " .
    " SUM(ABS(value)) as value " .
    " from sensor_measures_history " .
    " where date(datetime) between date('$from') and date('$to') " . 
    " and measure_id in (select id from sensor_measures where sensor_id = $sensid) " .
    " GROUP BY DATEHOUR ORDER BY datetime";
}


$rs = mysqli_query($con, $sql);  
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}

$rows = array();
while($r = mysqli_fetch_assoc($rs)) {
    $feature = array(
        'title' => $r['title'],
        'label' => $r['label'],
        'date' => $r['date'],
        'value' => $r['value']
        );
    array_push($rows, $feature);
}
echo json_encode( $rows);
$con = NULL;
       
?>
