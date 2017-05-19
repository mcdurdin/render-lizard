<?php
    require_once('_head.php');

    $resultId = $_POST['resultId'];
    $testId = $_POST['testId'];
    $img = $_POST['data'];

    if(!is_numeric($resultId)) {
        die("Invalid resultId");
    }

    if(!is_numeric($testId)) {
        die("Invalid testId");
    }

    if(!file_exists($data_path . $resultId)) {
        mkdir($data_path . $resultId);
    }

    $filename = $data_path . $resultId . "/test-$testId.png";

    // Encode data from data-url to binary

    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $fileData = base64_decode($img);

    file_put_contents($filename, $fileData);
?>