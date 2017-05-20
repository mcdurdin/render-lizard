$(function() {
    // Each test should be added to the content grid
    // For each result, render to the content grid

    //
    // Parse the test data
    //

    var testData = tests.filter(function(test) {
        test = test.trim();
        return test.length > 0 && test.charAt(0) != '#';
    });

    testData = testData.map(function(test) {
        var data=test.split('#');
        data.push('');
        return {
            text: data[0].trim(),
            note: data[1].trim(),
            unicodeComponents: function() {
                var table = $('<table>').addClass('unicode-components');
                var trChar = $('<tr>').addClass('char');
                var trCode = $('<tr>').addClass('code');
                table.append(trChar);
                table.append(trCode);
                for(var i = 0; i < this.text.length; i++) {
                    // todo: handle surrogate pairs
                    var s = 'U+'+this.text.charCodeAt(i);
                    trChar.append($('<td>').text(this.text.charAt(i)));
                    trCode.append($('<td>').text(s));
                }
                return table;
            }
        };
    });

    //
    // Load fonts
    //

    if(fontDefinitionExists) {
        $.ajax({url: "data/"+id+"/fonts.txt"}).done(function(data) {
           data = data.split("\n");
           data.forEach(function(fontName) {
              $('#fonts').append($('<option>').text(fontName.trim()));
           });
        });
    }

    //
    // Render tests and existing results to grid
    //

    var t = $('<table class="results"><thead><tr id="tr-head"><th>Test</th><th>Components</th><th>Notes</th></tr></thead><tbody></tbody></table>');
    var tb = $('tbody', t);

    var addHeaderCell = function(tr, resultId) {
        tr.append(
            $('<th>')
                .addClass('result-' + resultId)
                .text(resultId)
        );
    };

    var addMetadataCell = function(tr, resultId, data) {
        var td = $('<td>')
            .addClass('metadata')
            .addClass('result-'+resultId);
        tr.append(td);

        var formatMetadata = function(data) {
            td.text(data.replace(/\n/g, "\n\n"));

            var a = $('<a href="#">').text('Delete result').click(function() {
                $.post('delete.php', {id: id, resultId: resultId}).done(function() {
                    $(".result-"+resultId).fadeOut().remove();
                });
            });
            td.append(a);
        };

        if(data) {
            formatMetadata(data);
        } else {
            $.ajax({url: "data/"+id+"/"+resultId+"/metadata.txt"}).done(formatMetadata);
        }
    };

    var addHeaderCells = function(resultId, data) {
        addHeaderCell($('#tr-head'), resultId);
        addMetadataCell($('#tr-metadata'), resultId, data);
    };

    var addTestResultCell = function(tr, y, resultId) {
        var td = $('<td>').addClass('result').addClass('result-'+resultId);
        td.append($("<img src='data/"+id+"/"+resultId+"/test-"+y+".png'>"));
        tr.append(td);
    };

    var trHead = $('#tr-head', t);
    var trMetadata = $('<tr id="tr-metadata"><td colspan="3">Test Parameters</td></tr>');
    tb.append(trMetadata);

    for(var i = 0; i < results.length; i++) {
        addHeaderCell(trHead, results[i]);
        addMetadataCell(trMetadata, results[i]);
    }

    for(var y = 0; y < testData.length; y++) {
        var tr = $('<tr id="tr-test-'+y+'">');
        if(testData[y].note.match(/^[a-z-]+$/i)) tr.addClass('test-'+testData[y].note);
        tr.append($('<td>').text(testData[y].text).addClass('text'));
        tr.append($('<td>').append(testData[y].unicodeComponents()).addClass('unicode-components'));
        tr.append($('<td>').text(testData[y].note).addClass('note'));
        for (var i = 0; i < results.length; i++) {
            addTestResultCell(tr, y, results[i]);
        }
        tb.append(tr);
    }

    $('#content').append(t);

    var findNewTestId = function() {
        var r = 0;
        for(var i = 0; i < results.length; i++) {
            r = Math.max(results[i], r);
        }
        return r+1;
    }

    // http://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
    var getTextHeight = function(font, fontSize) {

        var text = $('<span>Hg</span>').css({ fontFamily: font, fontSize: fontSize });
        var block = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>');

        var div = $('<div></div>');
        div.append(text, block);

        var body = $('body');
        body.append(div);

        try {

            var result = {};

            block.css({ verticalAlign: 'baseline' });
            result.ascent = block.offset().top - text.offset().top;

            block.css({ verticalAlign: 'bottom' });
            result.height = block.offset().top - text.offset().top;

            result.descent = result.height - result.ascent;

        } finally {
            div.remove();
        }

        return result;
    };

    // Horrible hacky metadata.
    var getBrowserInfo = function(font) {
      return "Date: "+(new Date).toISOString()+"\n"+
        "Font: "+font+"\n"+
        "Browser: "+navigator.userAgent+"\n";
    };

    $('#render').click(function() {
        // Here's the meat. For each test we generate a canvas, write to the canvas, save to a .png, upload to a .php, then add an .img to point to the .php
        var newId = findNewTestId();

        results.push(newId);

        var fontName = $('#fonts').val();
        if(fontName === 'custom') {
            fontName = $("#font").val();
        } else if(fontName === 'default') {
            fontName = 'sans-serif'; // per spec, default font name
        }
        var fontSize = parseInt($("#fontSize").val());
        var lineHeight = parseFloat($("#lineHeight").val());
        var metadata = getBrowserInfo(fontName);

        // Append the test number and metadata
        addHeaderCells(newId, metadata);

        // Save the metadata
        $.post('save-metadata.php', {id:id, resultId: newId, metadata: metadata});

        // Render the text with the font parameters specified
        for(var i = 0; i < testData.length; i++) {
            var tr = $('#tr-test-'+i);
            var td = $('<td>')
                .addClass('result')
                .addClass('result-'+newId);
            (function(td, i) {

                // Render the text to a canvas

                var c = $('<canvas width="1000" height="30">')[0];
                td.append(c);
                td.append('...');
                tr.append(td);

                var ctx = c.getContext('2d');
                ctx.textBaseline = 'top';
                ctx.font = fontSize+"px '"+fontName+"'";
                var metrics = ctx.measureText(testData[i].text);
                c.width = metrics.width;
                var my = getTextHeight(fontName, fontSize);
                c.height = my.height * lineHeight;
                ctx.textBaseline = 'top';
                ctx.font = fontSize+"px '"+fontName+"'";
                ctx.fillText(testData[i].text, 0, (my.height * lineHeight - my.height)/2);

                // Save the canvas to the server and when complete, reload with the image (discarding the canvas)

                $.post("save.php", { id: id, testId: i, resultId: newId, data: c.toDataURL("image/png") }).done(function() {
                    // Replace the element with an image
                    td.empty();
                    td.append("<img src='data/"+id+"/"+newId+"/test-"+i+".png'>");
                });
            })(td, i);
        }
    });
});