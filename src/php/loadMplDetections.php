<?php
require 'connect.php';
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

$feature_id = $_REQUEST['feature_id'];


$sql = "select aa.geometry, aa.image_id, aa.feature_id, bb.value
FROM mapillary_features_detail_da aa
INNER JOIN mapillary_points bb ON aa.feature_id=bb.feature_id
where aa.feature_id = '$feature_id'";
// 496834095095254
# Try query or error
$rs = mysqli_query($con, $sql);  
if (!$rs) {
    echo 'An SQL error occured.\n';
    exit;
}

$rows = array();
# Loop through rows to build features. 
while($r = mysqli_fetch_assoc($rs)) {
    $feature = array(
        'image_id' => $r['image_id'],
        'feature_id' => $r['feature_id'],
        'value' => $r['value'],
        # this is not a geographic geometry. 
        'geometry' =>  $r['geometry'],
        );
    # Add feature arrays to feature collection array
    array_push($rows, $feature);
}
echo json_encode( $rows);
$con = NULL;


?>

