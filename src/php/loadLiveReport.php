<?php
require 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

try {
    $opts = array(
        "ssl"=>array(
            "verify_peer"=>false,
            "verify_peer_name"=>false,
        ),
        'http'=>array(
            'method'=>"GET",
            'header'=>"apikey: 723383f311b01561313486fee7e8275d980b87e78ab6cbc57de5f1f11534cff9"
    ));

    $report_id = $_REQUEST['report_id'];
    $context = stream_context_create($opts);
    $response = file_get_contents("https://my.sensmax.eu/api/v2/report/" . $report_id, false, $context);
    $result = json_decode($response, true);
    echo $result;
    
} catch(Exception $e) {
    echo 'Message: ' .$e->getMessage();
}
?>

