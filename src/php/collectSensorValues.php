<?php
require 'connect.php';
header('Access-Control-Allow-Origin: *');
try {
<<<<<<< HEAD
    $sql = 'select * from sensor_measures where sensor_id=1';
=======
<<<<<<< HEAD
    $sql = 'select * from sensor_measures';
=======
    $sql = 'select * from sensor_measures where sensor_id=1';
>>>>>>> 376afd6 (home_about)
>>>>>>> c73c64cc70771f3695caba42d35907a3903d272e
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
        $measure_id = $r['id'];
        $context = stream_context_create($opts);
        $response = file_get_contents('https://my.sensmax.eu/api/v2/report/' . $report_id, true, $context);

        $array = json_decode(json_decode($response), true);

        $i = 0;
        do
        {
            $value = $array[$i]['inside']."\n";
<<<<<<< HEAD
            $insert_sql = "insert into sensor_measures_history (measure_id, value) values ( " . $measure_id . "," . $value . ") ";
=======
            $gate_id = $array[$i]["id"];
            $insert_sql = "insert into sensor_measures_history (measure_id, gate_id, value) values ( " . $measure_id . "," . $gate_id . "," . $value . ") ";
>>>>>>> c73c64cc70771f3695caba42d35907a3903d272e
            if ($con->query($insert_sql) === TRUE) {
                echo "New record created successfully";
            } else {
                echo "Error: " . $insert_sql . "<br>" . $con->error;
            } 
            $i++;
        }
        while($i < count($array));
       
    }
    $con->close();
    
} catch(Exception $e) {
    echo 'Message: ' .$e->getMessage();
}
?>