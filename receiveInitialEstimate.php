<?php

// read parameters and centroids
$paraJson = $_POST['parameters'];
$centJson = $_POST['centroids'];
// convert para array to string
$parameters = json_decode($paraJson, true);
$paraStr = implode(',', $parameters);
// convert 2d centroid array to string
$centroids = json_decode($centJson, true);
$tmpArr = array();
foreach ($centroids as $sub) {
  $tmpArr[] = implode(',', $sub);
}
$centStr = implode(',', $tmpArr);
// execute python script
exec('python "fitting_py_code/readPrimitive.py" "'.$paraStr.'" "'.$centStr.'"', $output);
echo json_encode($output)
//var_dump($output);
?>
