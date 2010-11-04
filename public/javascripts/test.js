// debug is defined in envjs but we want to be able to view this page in a browser
if (typeof(debug) == "undefined") {
  var debug = function(msg) {
    console.log(msg);
  }
}

var ajaxifyLinks = function() {
  $('a').each(function() {
    $(this).attr('href', "#" + $(this).attr('href'));
    $(this).click(linkHandler);
  });
};

var linkHandler = function() {
  debug('linkHandler');
  setTimeout(makeAjaxRequest, 1000);
  // return false;
};

var makeAjaxRequest = function() {
  debug('makeAjaxRequest');
  $.get('/javascripts/test-response.js', renderAjaxResponse);
};

var renderAjaxResponse = function(data, textStatus, xhr) {
  debug('renderAjaxResponse');
  $('#testResponseContainer').append(data);
};

$(document).ready(ajaxifyLinks);