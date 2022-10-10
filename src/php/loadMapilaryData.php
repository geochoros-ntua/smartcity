<?php
require 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

$bbox = $_REQUEST['bbox'];
$layer = $_REQUEST['layer'];

$sequence_attrs = array('id','image_id');
$image_attrs = array('id','compass_angle', 'sequence_id');
$point_attrs = array('feature_id', 'value');
$quest_dim_koin_attrs = array('label', 'name', 'area', 'q1', 'q2');
$da_dim_koin_attrs = array('label', 'name', 'no', 'area', 's1', 's2');
$da_geitonies_attrs = array('synoikia', 'name', 'geitonia', 'dk_id', 's1', 's2');
$da_pdstr_attrs = array('streetname', 'c1_1', 'c1_2','c1_3','s1','s2','s4');


$epsg =  'EPSG:4326';

$sql = '';
$attrs = [];


if ($layer == 'mapillary_sequences'){
    $sql = 'select OGR_FID, ST_AsGeoJSON(GEOM) as GEOM, ' . implode(', ', $sequence_attrs) . ' from mapillary_sequences where 
    MBRIntersects(
        ST_GeomFromText(\'Polygon((' . $bbox . '))\'),
        GEOM
    ) = 1';
    $attrs = $sequence_attrs;
    $epsg =  'EPSG:4326';
} else if ($layer == 'mapillary_images'){
    $sql = 'select OGR_FID, ST_AsGeoJSON(GEOM) as GEOM, ' . implode(', ', $image_attrs) . ' from mapillary_images where 
    MBRIntersects(
        ST_GeomFromText(\'Polygon((' . $bbox . '))\'),
        GEOM
    ) = 1';
    $attrs = $image_attrs;
    $epsg =  'EPSG:4326';
} else if ($layer == 'mapillary_points'){
    $filter = $_REQUEST['filter'];
    $filterSql = $filter != '' ? " value in ( " . $filter . " ) and " : " value in ( '' ) and ";
    $sql = 'select OGR_FID, ST_AsGeoJSON(GEOM) as GEOM, ' . implode(', ', $point_attrs) . ' from mapillary_points where ' . 
    $filterSql . 
    ' value NOT IN  (\'object--support--pole\',\'object--support--utility-pole\',\'marking--discrete--other-marking\') and 
    MBRIntersects(
        ST_GeomFromText(\'Polygon((' . $bbox . '))\'),
        GEOM
    ) = 1';
    $attrs = $point_attrs;
    $epsg =  'EPSG:4326';
} else if ($layer == 'da_dim_koin'){
    $sql = 'select OGR_FID, ST_AsGeoJSON(SHAPE) as GEOM, ' . implode(', ', $da_dim_koin_attrs) . ' from da_dim_koin where 
    MBRIntersects(
        ST_GeomFromText(\'Polygon((' . $bbox . '))\'),
        SHAPE
    ) = 1';
    $attrs = $da_dim_koin_attrs;
    $epsg = 'EPSG:3857';
} else if ($layer == 'da_geitonies'){
    $sql = 'select OGR_FID, ST_AsGeoJSON(SHAPE) as GEOM, ' . implode(', ', $da_geitonies_attrs) . ' from da_geitonies where 
    MBRIntersects(
        ST_GeomFromText(\'Polygon((' . $bbox . '))\'),
        SHAPE
    ) = 1';
    $attrs = $da_geitonies_attrs;
    $epsg = 'EPSG:3857';
} else if ($layer == 'da_pedestrian_ways'){
    $sql = 'select OGR_FID, ST_AsGeoJSON(SHAPE) as GEOM, ' . implode(', ', $da_pdstr_attrs) . ' from da_pedestrian_ways where 
    MBRIntersects(
        ST_GeomFromText(\'Polygon((' . $bbox . '))\'),
        SHAPE
    ) = 1';
    $attrs = $da_pdstr_attrs;
    $epsg = 'EPSG:3857';
} else if ($layer == 'quest_dim_koin'){
    $sql = 'select OGR_FID, ST_AsGeoJSON(SHAPE) as GEOM, ' . implode(', ', $quest_dim_koin_attrs) . ' from quest_dim_koin where 
    MBRIntersects(
        ST_GeomFromText(\'Polygon((' . $bbox . '))\'),
        SHAPE
    ) = 1';
    $attrs = $quest_dim_koin_attrs;
    $epsg = 'EPSG:3857';
} else if ($layer == 'mpl_trafic_signs'){
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
           'name' => $epsg
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
$con = NULL;

# this is the ogr command to import spatial data to mysql. We do not use it any more. 
# Just keep it here for importing new data from shp etc.
# ogr2ogr -f MySQL MYSQL:"info212790_walkability,host=185.138.42.100,user=info212790_walkability,password=walkability_pass,port=3306" C:\\PHD\\UGLab_v1\\image_points.shp -nln test_points -update -overwrite 


// ogr2ogr -f MySQL MYSQL:"mapillary_data,host=localhost,user=root,password=,port=3306" C:\\workdir\\smart_city_docs\\data\\da_dim_koin_3857.shp -nln da_dim_koin -update -overwrite 
// ogr2ogr -f MySQL MYSQL:"mapillary_data,host=localhost,user=root,password=,port=3306" C:\\workdir\\smart_city_docs\\data\\da_geitonies_3857.shp -nln da_geitonies -update -overwrite 
// ogr2ogr -f MySQL MYSQL:"mapillary_data,host=localhost,user=root,password=,port=3306" C:\\workdir\\smart_city_docs\\data\\sample_lines_3857.shp -nln da_pedestrian_ways -update -overwrite 
// ogr2ogr -f MySQL MYSQL:"mapillary_data,host=localhost,user=root,password=,port=3306" C:\\workdir\\smart_city_docs\\data\\sensor_points.shp -nln sensor_points -update -overwrite 

// ogr2ogr -f MySQL MYSQL:"info212790_walkability,host=185.138.42.100,user=info212790_walkability,password=#walkability@2022,port=3306" C:\\workdir\\smart_city_docs\\data\\da_dim_koin_3857.shp -nln da_dim_koin -update -overwrite 
// ogr2ogr -f MySQL MYSQL:"info212790_walkability,host=185.138.42.100,user=info212790_walkability,password=#walkability@2022,port=3306" C:\\workdir\\smart_city_docs\\data\\da_geitonies_3857.shp -nln da_geitonies -update -overwrite 
// ogr2ogr -f MySQL MYSQL:"info212790_walkability,host=185.138.42.100,user=info212790_walkability,password=#walkability@2022,port=3306" C:\\workdir\\smart_city_docs\\data\\sample_lines_3857.shp -nln da_pedestrian_ways -update -overwrite 
// ogr2ogr -f MySQL MYSQL:"info212790_walkability,host=185.138.42.100,user=info212790_walkability,password=#walkability@2022,port=3306" C:\\workdir\\smart_city_docs\\data\\sensor_points.shp -nln sensor_points -update -overwrite 
// ogr2ogr -f MySQL MYSQL:"info212790_walkability,host=185.138.42.100,user=info212790_walkability,password=#walkability@2022,port=3306" C:\\workdir\\smart_city_docs\\data\\quest_dim_koin_3857.shp -nln quest_dim_koin -update -overwrite 

// sql scripts
// create table mapillary_features_detail_20220314 as  SELECT * FROM `mapillary_features_detail` WHERE image_id in
// (select id from mapillary_images)

// create table mapillary_points_20220314 as 
// SELECT * FROM `mapillary_points` WHERE feature_id in 
// (select feature_id from mapillary_features_detail_20220314);
?>

