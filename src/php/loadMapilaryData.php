<?php
require 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

$bbox = $_REQUEST['bbox'];
$layer = $_REQUEST['layer'];

$sequence_attrs = array('id','image_id');
$image_attrs = array('id','compass_angle', 'sequence_id');

$sql = '';
$attrs = [];

if ($layer == 'mpl_sequences'){
    $sql = 'select OGR_FID, ST_AsGeoJSON(GEOM) as GEOM, ' . implode(', ', $sequence_attrs) . ' from mapillary_sequences where 
    MBRIntersects(
        ST_GeomFromText(\'Polygon((' . $bbox . '))\'),
        GEOM
    ) = 1';
    $attrs = $sequence_attrs;
} else if ($layer == 'mpl_images'){
    $sql = 'select OGR_FID, ST_AsGeoJSON(GEOM) as GEOM, ' . implode(', ', $image_attrs) . ' from mapillary_images where 
    MBRContains(
        ST_GeomFromText(\'Polygon((' . $bbox . '))\'),
        GEOM
    ) = 1';
    $attrs = $image_attrs;
} else if ($layer == 'mpl_points'){
    //to be implemented
    
} else {
    echo 'No such layer exist.\n';
    exit;
}


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
           'name' => 'EPSG:4326'
        )        
    ),    
   'features' => array()
);

# Loop through rows to build features
while($row = mysqli_fetch_assoc($rs)) {
    $props = array('layer' => $layer);
    foreach($attrs as $attr) {
        $props[$attr] = $row[$attr];
    }

    $feature = array(
        'id' => $row['OGR_FID'],
        'type' => 'Feature', 
        'geometry' =>  json_decode($row['GEOM']),
        # Pass extra attribute columns here
        'properties' => $props
        );
    # Add feature arrays to feature collection array
    array_push($geojson['features'], $feature);
}

echo json_encode($geojson, JSON_NUMERIC_CHECK);
$conn = NULL;

# this is the ogr command to import spatial data to mysql. We do not use it any more. Just keep it here for educational reasons.... 
# ogr2ogr -f MySQL MYSQL:"info212790_walkability,host=185.138.42.100,user=info212790_walkability,password=walkability_pass,port=3306" C:\\PHD\\UGLab_v1\\image_points.shp -nln test_points -update -overwrite 

?>

