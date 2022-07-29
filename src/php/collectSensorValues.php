<?php
require 'connect.php';
header('Access-Control-Allow-Origin: *');
// header('Content-type: application/json');

try {
    $sql = 'select * from sensor_measures';
    $rs = mysqli_query($con, $sql);  
    if (!$rs) {
        echo 'An SQL error occured.\n';
        exit;
    }

    $opts = array(
        'ssl'=>array(
            'verify_peer'=>false,
            'verify_peer_name'=>false,
        ),
        'http'=>array(
            'method'=>'GET',
            'header'=>'apikey: 723383f311b01561313486fee7e8275d980b87e78ab6cbc57de5f1f11534cff9'
    ));

    $rows = array();
    # Loop through rows to build features. 
    while($r = mysqli_fetch_assoc($rs)) {
        $report_id = $r['live_report_id'];
        //echo $report_id;
        $measure_id = $r['id'];
        $context = stream_context_create($opts);
        $response = file_get_contents('https://my.sensmax.eu/api/v2/report/' . $report_id, false, $context);
        $value = str_replace('\u0022', "'", $response);
        $pos = strpos($value, "'inside':");
        $value = substr($value, $pos+9);
        $posend = strpos($value, ",");
        $value = substr($value,0, $posend);
        $insert_sql = "insert into sensor_measures_history (measure_id, value) values ( " . $measure_id . "," . $value . ") ";
        if ($con->query($insert_sql) === TRUE) {
        echo "New record created successfully";
        } else {
        echo "Error: " . $insert_sql . "<br>" . $con->error;
        } 
    }
    $con->close();
    
} catch(Exception $e) {
    echo 'Message: ' .$e->getMessage();
}
?>