<?php
require 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

$measureid = $_REQUEST['measureid'];
$reportType = $_REQUEST['reportType'] ? $_REQUEST['reportType'] : 'hour';
$from = $_REQUEST['from'];
$to = $_REQUEST['to'];

$sql = "";
if ($reportType == 'day'){
    $sql = " SELECT bb.gate as title, " . 
    " CONCAT(date(aa.datetime), \" (\", DAYNAME(date(aa.datetime)), \")\") as label,  date(aa.datetime) date, SUM(ABS(aa.value)) as value " .
    " from sensor_measures_history aa left join sensor_measures bb on bb.id = aa.measure_id " . 
    " where date(aa.datetime) between date('$from') and date('$to') " . 
    " and aa.measure_id = $measureid " . 
    " GROUP BY date " . 
    " order by date ";
} else if ($reportType == 'hour'){
    $sql = " SELECT bb.gate as title, " .
    " DATE_ADD( DATE_FORMAT(aa.datetime, '%Y-%m-%d %H:00:00'), " . 
    " INTERVAL IF(MINUTE(aa.datetime) < 30, 0, 1) HOUR ) AS label, " .
    " date(aa.datetime) date, " .
    " SUM(ABS(aa.value)) as value " .
    " from sensor_measures_history aa left join sensor_measures bb on bb.id = aa.measure_id " . 
    " where date(aa.datetime) between date('$from') and date('$to') " . 
    " and aa.measure_id = $measureid " .
    " GROUP BY label ORDER BY datetime";
}


$rs = mysqli_query($con, $sql);  
if (!$rs) {
    echo 'An SQL error occured.\n' . $sql;
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