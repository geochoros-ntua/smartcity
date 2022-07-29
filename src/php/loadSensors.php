<?php
require 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

$epsg =  'EPSG:3857';

// SELECT date(datetime) as stat_day, SUM(ABS(value))
// from sensor_measures_history
// GROUP BY date(datetime)
// order by stat_day;

$sql = "SELECT sm.id, sp.label, GROUP_CONCAT(sm.live_report_id SEPARATOR ',') live_report_id, sm.sensor_id,  ST_AsGeoJSON(sp.SHAPE) GEOM  " . 
" FROM sensor_points sp  " . 
" INNER JOIN sensor_measures sm ON sm.sensor_id = sp.id group by sensor_id ";

$attrs = ['label', 'live_report_id'];

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

