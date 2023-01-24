<?php
require 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

$epsg =  'EPSG:3857';

<<<<<<< HEAD
<<<<<<< HEAD

$sql = "SELECT sm.id, sp.label, sp.intensity_limits, 'sensors' as layer, sm.gate_groups, GROUP_CONCAT(sm.live_report_id SEPARATOR ',') live_report_id, sm.sensor_id, sm.mpl_imageid,  ST_AsGeoJSON(sp.SHAPE) GEOM  " . 
" FROM sensor_points sp  " . 
" INNER JOIN sensor_measures sm ON sm.sensor_id = sp.id group by sensor_id ";

<<<<<<< HEAD
$attrs = ['label', 'live_report_id', 'layer', 'intensity_limits', 'mpl_imageid'];
=======
// SELECT date(datetime) as stat_day, SUM(ABS(value))
// from sensor_measures_history
// GROUP BY date(datetime)
// order by stat_day;
=======
>>>>>>> 9d066a6 (imlement sensor graph)

<<<<<<< HEAD
$sql = "SELECT sm.id, sp.label, intensity_limits, 'sensors' as layer,  GROUP_CONCAT(sm.live_report_id SEPARATOR ',') live_report_id, sm.sensor_id, sm.mpl_imageid,  ST_AsGeoJSON(sp.SHAPE) GEOM  " . 
" FROM sensor_points sp  " . 
" INNER JOIN sensor_measures sm ON sm.sensor_id = sp.id group by sensor_id ";

<<<<<<< HEAD
<<<<<<< HEAD
$attrs = ['label', 'live_report_id'];
>>>>>>> 8edf21e (implement pedestrian sensors functionality)
=======
$attrs = ['label', 'live_report_id', 'layer'];
>>>>>>> 9d066a6 (imlement sensor graph)
=======
$attrs = ['label', 'live_report_id', 'layer', 'intensity_limits', 'mpl_imageid'];
<<<<<<< HEAD
>>>>>>> caa8ac9 (implement sensors functionality)
=======
$attrs = ['label', 'live_report_id', 'gate_groups', 'layer', 'intensity_limits', 'mpl_imageid'];
>>>>>>> 82969d4 (add groups on measures)
=======
=======
$sql = "SELECT sm.id, sp.label, sp.intensity_limits, 'sensors' as layer, sm.gate_groups, GROUP_CONCAT(sm.live_report_id SEPARATOR ',') live_report_id, sm.sensor_id, sm.mpl_imageid,  ST_AsGeoJSON(sp.SHAPE) GEOM  " . 
" FROM sensor_points sp  " . 
" INNER JOIN sensor_measures sm ON sm.sensor_id = sp.id group by sensor_id ";

$attrs = ['label', 'live_report_id', 'gate_groups', 'layer', 'intensity_limits', 'mpl_imageid'];
>>>>>>> c73c64cc70771f3695caba42d35907a3903d272e
>>>>>>> 95ead2967e72b0a523cf31fa48d85a2ddd5a7bc6

# Try query or error
$rs = mysqli_query($con, $sql);  
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}

# Build GeoJSON feature collection array
# Set the wgs84 as the crs
$geojson = array(
   'type' => 'FeatureCollection',  
   'crs' => array(
        'type' => 'name',   
        'properties' => array(
           'name' => $epsg
        )        
    ),    
   'features' => array()
);

# Loop through rows to build features
while($row = mysqli_fetch_assoc($rs)) {
    foreach($attrs as $attr) {
        $props[$attr] = $row[$attr];
    }

    $feature = array(
        'id' => $row['id'],
        'type' => 'Feature', 
        'geometry' =>  json_decode($row['GEOM']),
        # Pass extra attribute columns here
        'properties' => $props
        );
    # Add feature arrays to feature collection array
    array_push($geojson['features'], $feature);
}

echo json_encode($geojson, JSON_NUMERIC_CHECK);
$con = NULL;

?>

