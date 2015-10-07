$(function() { 
  var statusURL =  '../scripts/status.js/json';

  var svgDoc;

  function setMarkerColor(marker,color) {
    if(!marker) return;
    var match = marker.match('url\\((.*)\\)');
    if(!match) return;
    $(match[1],svgDoc).find('path').attr({'fill':color}); 
  }

  function updateStatus(data) {
    if(!svgDoc) return;

    var links = data.links;
    for(var link in links) {
      var linkObj = $('#'+link,svgDoc);
      var props = links[link];
      if(props.color) {
        linkObj.css({'stroke':props.color});
        setMarkerColor(linkObj.css('marker-start'),props.color);
        setMarkerColor(linkObj.css('marker-mid'),props.color);
        setMarkerColor(linkObj.css('marker-end'),props.color);
        setMarkerColor(linkObj.css('marker'),props.color);
      }
      if(props.width) linkObj.css({'stroke-width':props.width});
    }

    var nodes = data.nodes;
    for(var node in nodes) {
      var nodeObj = $('#'+node,svgDoc);
      var props = nodes[node];
      if(props.color) nodeObj.css({'fill':props.color});
    }
  }

  function pollStatus() {
    $.ajax({
      url: statusURL,
      success: function(data) {
        updateStatus(data);
        setTimeout(pollStatus, 2000);
      },
      error: function(result,status,errorThrown) {
        setTimeout(pollStatus, 2000);
      },
      timeout: 60000
   });
  }

  $(document).ready(function() {
    pollStatus();
  });

  document.getElementById('svgObj').addEventListener('load', function() {
    svgDoc = $(document.getElementById('svgObj').contentDocument);
  }, true); 
});
