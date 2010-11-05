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
  var anchor = this;
  setTimeout(function() { makeAjaxRequest(anchor) }, 1000)
  // return false;
};

var makeAjaxRequest = function(anchor) {
  debug('makeAjaxRequest');
  var targetURL = $(anchor).attr('href').replace('#', '');
  $.get(targetURL, renderAjaxResponse);
};

var renderAjaxResponse = function(data, textStatus, xhr) {
  debug('renderAjaxResponse');
  $('#testResponseContainer').append(data);
};

$(document).ready(ajaxifyLinks);



// HELPERS FOR TESTING IN ENVJS BELOW HERE

var envjsJohnsonClickLink = function(anchor) {
  // stolen from capybara-envjs click method.  can't use 'event' as a variable name as that's already defined in envjs.  the use of createEvent with an empty string seems to go against the actual spec (it should be createEvent('MouseEvents') but that raises an error)
  var e = document.createEvent('');
  e.initEvent('click', true, true);
  e['button'] = 1;
  anchor.dispatchEvent(e);
}

var envjsRhinoClickLink = function(anchor) {
  // 'standard' way of 'clicking' a link in javascript
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  anchor.dispatchEvent(event);
}

var envjsTestLinkBehaviour = function(clickLinkFunction) {
  // replicate capybara-envjs waiting for all events to fire
  var anchor = $('#testAnchor')[0];
  clickLinkFunction(anchor);
  Envjs.wait(-2000);
}