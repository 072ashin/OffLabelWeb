<?php
// get arrays from client
$off = $_POST['off'];
$offFileName = $_POST['offFileName'];
// generate unique string
$uuid = uniqid();
// define file path
$offFilePath = 'off/' . $offFileName . '_' . $uuid . '.off';
// open new text file
// write off info into text file
file_put_contents($offFilePath, $off);
echo $offFilePath;
?>