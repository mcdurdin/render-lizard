$(function() {
    // Each text should be added to the content grid
    // For each result, render to the content grid

    var t = $('<table><thead><tr id="tr-head"><th>Test</th><th>Unicode</th><th>Components</th><th>Notes</th></tr></thead><tbody></tbody></table>');
    var tb = $('tbody', t);

    var tr = $('#tr-head', t);
    for(var i = 0; i < results.length; i++) {
        tr.append('<th>'+results[i]+'</th>');
    }

    var tr = $('<tr id="tr-metadata"><td colspan="4">Test Parameters</td></tr>');
    for(var i = 0; i < results.length; i++) {
        var td = $('<td class="metadata">'); tr.append(td);
        (function(td) {
            $.ajax({url: "data/"+id+"/"+results[i]+"/metadata.txt"}).done(function(data) {
                td.text(data.replace(/\n/g, "\n\n"));
            });
        })(td);
    }
    tb.append(tr);
    for(var y = 0; y < tests.length; y++) {
        var tr = $('<tr id="tr-test-'+y+'">');
        var td = $('<td>').text(tests[y]);
        tr.append(td);
        tr.append($('<td>'));
        tr.append($('<td>'));
        tr.append($('<td>'));
        for (var i = 0; i < results.length; i++) {
            td = $('<td>');
            td.append($("<img src='data/"+id+"/"+results[i]+"/test-"+y+".png'>"));
            tr.append(td);
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

    var getBrowserInfo = function(font) {
      return "Date: "+(new Date).toISOString()+"\n"+
        "Font: "+font+"\n"+
        "Browser: "+navigator.userAgent+"\n";
    };

    $('#render').click(function() {
        // Here's the meat. For each test we generate a canvas, write to the canvas, save to a .png, upload to a .php, then add an .img to point to the .php
        // Fair chunk of work!
        var newId = findNewTestId();

        results.push(newId);

        var fontName = $("#font").val();
        var fontSize = parseInt($("#fontSize").val());
        var lineHeight = parseFloat($("#lineHeight").val());

        // Append the test number

        var tr = $('#tr-head');
        tr.append('<th>'+newId+'</th>');

        // Append the test details

        var tr = $('#tr-metadata');
        var metadata = getBrowserInfo(fontName);
        tr.append('<td class="metadata">'+metadata.replace(/\n/g, "\n\n")+'</td>');

        // todo: save the metadata

        $.post('save-metadata.php', {id:id, resultId: newId, metadata: metadata});

        for(var i = 0; i < tests.length; i++) {
            var tr = $('#tr-test-'+i);
            var td = $('<td>');
            (function(td, i) {
                var c = $('<canvas width="1000" height="30">')[0];
                td.append(c);
                td.append('...');
                tr.append(td);

                var ctx = c.getContext('2d');
                ctx.textBaseline = 'top';
                ctx.font = fontSize+"px '"+fontName+"'";
                var metrics = ctx.measureText(tests[i]);
                c.width = metrics.width;
                var my = getTextHeight(fontName, fontSize);
                c.height = my.height * lineHeight;
                ctx.textBaseline = 'top';
                ctx.font = fontSize+"px '"+fontName+"'";
                ctx.fillText(tests[i], 0, (my.height * lineHeight - my.height)/2);

                $.post("save.php", { id: id, testId: i, resultId: newId, data: c.toDataURL("image/png") }).done(function() {
                    // Replace the element with an image
                    td.empty();
                    td.append("<img src='data/"+id+"/"+newId+"/test-"+i+".png'>");
                });
            })(td, i);
        }
    });
});