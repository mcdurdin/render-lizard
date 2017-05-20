<?php
    require_once('_head.php');

    $resultId = $_POST['resultId'];

    if(!is_numeric($resultId)) {
        die("Invalid resultId");
    }

    function delTree($dir) {
        $files = array_diff(scandir($dir), array('.','..'));
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
        }
        return rmdir($dir);
    }

    delTree($data_path . $resultId);
?>