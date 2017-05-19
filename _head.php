<?php
    $data_path = "./data/";

    $id = $_REQUEST['id'];
    if(!is_numeric($id)) {
    die("Invalid ID");
    }

    $data_path .= "$id/";
?>