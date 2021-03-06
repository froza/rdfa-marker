function stripScripts(s) {
  var div = document.createElement('div');
  div.innerHTML = s;
  var scripts = div.getElementsByTagName('script');
  var i = scripts.length;
  while (i--) {
    scripts[i].parentNode.removeChild(scripts[i]);
  }
  return div.innerHTML;
}

var codeMirrorHtmlMixed = null;
var codeMirrorHtmlMixed = null;
$(document).ready(function() {
  var viewPortWidth = $(window).width();

  var isTestExportPage = false;
  if (isTestExportPage) {
    var person = '' + //
    '<div vocab="http://schema.org/" typeof="Person">\n' + //
    '  <a property="image" href="http://manu.sporny.org/images/manu.png">\n' + //
    '    <span property="name">Manu Sporny</span></a>, \n' + //
    '  <span property="jobTitle">Founder/CEO</span>\n' + //
    '  <div>\n' + //
    '    Phone: <span property="telephone">(540) 961-4469</span>\n' + //
    '  </div>\n' + //
    '  <div>\n' + //
    '    E-mail: <a property="email" href="mailto:msporny@digitalbazaar.com">msporny@digitalbazaar.com</a>\n' + //
    '  </div>\n' + //
    '  <div>\n' + //
    '    Links: <a property="url" href="http://manu.sporny.org/">Manu\'s homepage</a>\n' + //
    '  </div>\n' + //
    '</div>'; //
    $('textarea#pageHtml').text(person);
  } else {
    var pageHTML = localStorage.rdfaMakerPageHTML;
    var head = pageHTML.match(/<head[^>]*>[\s\S]*<\/head>/gi);
    var body = pageHTML.match(/<body[^>]*>[\s\S]*<\/body>/gi);
    var bodyStriped = stripScripts(body);
    // $('textarea#pageHtml').text(pageHTML); // all page
    $('textarea#pageHtml').text(bodyStriped); // only body striped (without scripts)
  }

  var mixedMode = {
    name : "htmlmixed",
    scriptTypes : [ {
      matches : /\/x-handlebars-template|\/x-mustache/i,
      mode : null
    }, {
      matches : /(text|application)\/(x-)?vb(a|script)/i,
      mode : "vbscript"
    } ]
  };
  codeMirrorHtmlMixed = CodeMirror.fromTextArea(document.getElementById("pageHtml"), {
    mode : mixedMode,
    tabMode : 'indent',
    autoRefresh : true,
    lineNumbers : true,
    styleActiveLine : true,
    matchBrackets : true,
    readOnly : true,
    selectionPointer : true
  });

  codeMirrorTurtle = CodeMirror.fromTextArea(document.getElementById("turtleOutput"), {
    mode : 'text/turtle',
    tabMode : 'indent',
    autoRefresh : true,
    lineNumbers : true,
    styleActiveLine : true,
    matchBrackets : true,
    readOnly : true,
    selectionPointer : true
  });

  $('select.theme').on('change', function(e) {
    var theme = $(this).val();
    codeMirrorHtmlMixed.setOption("theme", theme);
    codeMirrorTurtle.setOption("theme", theme);
  });

  /**
   * Process the RDFa markup that has been input and display the output in the active tab.
   */
  var previewFrame = document.getElementById('preview');
  var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
  preview.open();
  preview.write(codeMirrorHtmlMixed.getValue());
  preview.close();
  if (!preview.data) {
    GreenTurtle.attach(preview);
  } else {
    GreenTurtle.attach(preview, true);
  }

  // iterate through all triples and insert them into the output display
  var turtle = play.toTurtle(preview.data);
  var d3Nodes = play.toD3TreeGraph(preview.data);
  codeMirrorTurtle.setValue(turtle);
  play.viz.redraw(d3Nodes);

  $('button.download_html_marked').on('click', function(e) {
    download(codeMirrorHtmlMixed.getValue(), "html-marked.html", "text/html");
  });
  $('a.download_rdf').on('click', function(e) {
    download(codeMirrorTurtle.getValue(), "html-marked.rdf", "application/octet-stream");
  });
});
