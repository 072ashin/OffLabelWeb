<?php
// get arrays from client
$label = $_POST['label'];
$labelFileName = $_POST['labelFileName'];
// generate unique string
$uuid = uniqid();

$labelFileName = 'labelResult/' . $labelFileName . '_' . $uuid . '.txt';

file_put_contents($labelFileName, $label);
echo $labelFileName;
?>