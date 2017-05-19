<?php
    require_once('_head.php');

    $tests_file = "{$data_path}tests.txt";

    if(!file_exists($tests_file)) {
        die("Test does not exist");
    }

    $tests = file_get_contents($tests_file);
    $tests_html = htmlspecialchars($tests);
    $tests = explode("\n", $tests);

    $results = array();
    $dir = opendir($data_path);
    if($dir !== FALSE) {
        // locate all existing results
        $file = readdir($dir);
        while($file !== FALSE) {
            if(is_dir($data_path . $file) && $file !== '.' && $file !== '..') {
                array_push($results, $file);
            }
            $file = readdir($dir);
        }
        closedir($dir);
    }
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Render Test</title>
        <link rel="stylesheet" type="text/css" href="render.css">
        <script>
            var id = <?=$id?>,
                results = [
            <?php
              for($i = 0; $i < count($results); $i++) {
                  if($i > 0) echo ", ";
                  echo $results[$i];
              }
            ?>
            ], tests = [
                <?php
                for($i = 0; $i < count($tests); $i++) {
                    $v = addslashes(trim($tests[$i]));
                    if($i > 0) echo ", ";
                    echo "\"$v\"";
                }
                ?>
            ];
        </script>
        <script
            src="https://code.jquery.com/jquery-3.2.1.min.js"
            integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
            crossorigin="anonymous"></script>
        <script src="render.js"></script>
    </head>
    <body>
        <header>
            ID: <input id="id" type="text" readonly value="<?=$id?>"><br>
            Tests: <textarea id="tests" readonly><?=$tests_html?></textarea><br>
            Font: <input id="font" type="text" value="Khmer OS">
            Size: <input id="fontSize" type="text" value="30"> (pixels)
            Line height: <input id="lineHeight" type="text" value="1.5">
            <br>
            <input id="render" type="button" value="Render">
        </header>
        <article id="content">
        </article>
        <footer></footer>
    </body>
</html>
