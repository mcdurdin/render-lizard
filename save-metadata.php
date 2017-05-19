<?php
    require_once('_head.php');

    $resultId = $_POST['resultId'];

    if(!is_numeric($resultId)) {
        die("Invalid resultId");
    }

    if(!file_exists($data_path . $resultId)) {
        mkdir($data_path . $resultId);
    }

    $metadata = $_POST['metadata'];

    $filename = $data_path . $resultId . "/metadata.txt";
    file_put_contents($filename, $metadata);
?>