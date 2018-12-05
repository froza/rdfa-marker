/*
var onMessageHandler = function(message) {
  // Ensure it is run only once, as we will try to message twice
  chrome.runtime.onMessage.removeListener(onMessageHandler);

  var form = document.createElement("form");
  form.setAttribute("method", "LINK");
  form.setAttribute("action", message.url);
  for ( var key in message.data) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", message.data[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  console.log(message);
  form.submit();
};

chrome.runtime.onMessage.addListener(onMessageHandler);
*/

$(document).ready(function() {
  var person =
    '<div vocab="http://schema.org/" typeof="Person">\n'+
    '  <a property="image" href="http://manu.sporny.org/images/manu.png">\n' +
    '    <span property="name">Manu Sporny</span></a>, \n' +
    '  <span property="jobTitle">Founder/CEO</span>\n' +
    '  <div>\n' +
    '    Phone: <span property="telephone">(540) 961-4469</span>\n' +
    '  </div>\n' +
    '  <div>\n' +
    '    E-mail: <a property="email" href="mailto:msporny@digitalbazaar.com">msporny@digitalbazaar.com</a>\n' +
    '  </div>\n' +
    '  <div>\n' +
    '    Links: <a property="url" href="http://manu.sporny.org/">Manu\'s homepage</a>\n' +
    '  </div>\n' +
    '</div>';

  //$('textarea#pageHtml').text(person);

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
  var editor = CodeMirror.fromTextArea(document.getElementById("pageHtml"), {
    mode : mixedMode,
    selectionPointer : true
  });
});