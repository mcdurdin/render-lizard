<?php
    require_once('_head.php');

    $tests_file = "{$data_path}tests.txt";
    $fonts_file = "{$data_path}fonts.txt";

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
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
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
            ], fontDefinitionExists = <?= file_exists($fonts_file) ?>;
        </script>
        <script
            src="https://code.jquery.com/jquery-3.2.1.min.js"
            integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
            crossorigin="anonymous"></script>
        <script src="render.js"></script>

        <!-- Bootstrap -->
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

        <!-- Optional theme -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

        <!-- Latest compiled and minified JavaScript -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
    </head>
    <body>
    <div class="container-fluid theme-showcase" role="main">

        <header>
            <form class="form-inline">
                <div class="form-group">
                    <label for="id">ID:</label>
                    <input class="form-control" id="id" type="text" readonly value="<?=$id?>">
                </div>
                <div class="form-group">
                    <label for=tests">Tests:</label>
                    <textarea class="form-control" id="tests" readonly><?=$tests_html?></textarea>
                </div>
                <div class="form-group">
                    <label for="fonts">Font:</label>
                    <select class="form-control" id="fonts">
                        <option value="default">Default</option>
                    </select>
                    <label for="fontSize">Size:</label>
                    <input class="form-control" id="fontSize" size="5" type="text" value="30"> (pixels)
                    <label for="lineHeight">Line height:</label>
                    <input class="form-control" id="lineHeight" size="5" type="text" value="1.5">
                </div>
                <input id="render" type="button" class="btn btn-large btn-default" value="Render">
            </form>
        </header>
        <article id="content">
        </article>
    </div>
    </body>
</html>
