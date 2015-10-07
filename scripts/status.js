// author: InMon Corp.
// version: 1.0
// date: 10/6/2015
// description: sFlow-RT Weathermap Example
// copyright: Copyright (c) 2015 InMon Corp.

// edit table of links to match SVG map IDs with agents and data sources
var links = {
  'sf-la'  : [{agt:'10.0.0.254', ds:'21'},{agt:'10.0.1.254', ds:'1'}],
  'sf-den' : [{agt:'10.0.0.254', ds:'24'},{agt:'10.0.2.254', ds:'3'}],
  'sf-kan' : [{agt:'10.0.0.254', ds:'22'},{agt:'10.0.3.254', ds:'3'}],
  'den-kan': [{agt:'10.0.2.254', ds:'4'},{agt:'10.0.3.254', ds:'2'}],
  'la-den' : [{agt:'10.0.1.254', ds:'4'},{agt:'10.0.2.254', ds:'4'}]
};

var nodes = {
  'sf' : {agt:'10.0.0.254'},
  'la' : {agt:'10.0.1.254'},
  'den': {agt:'10.0.2.254'},
  'kan': {agt:'10.0.3.254'}
};

// use flow metric for faster response time than ifinoctets counter metric
setFlow('svg_weathermap_bytes', {value:'bytes',filter:'direction=ingress'});

// assign link properties based on utilization
function linkProperties(utilization) {
  var color;
  if(utilization === -1) color = 'gray';
  else if(utilization < 20) color = 'blue';
  else if(utilization < 40) color = 'cyan';
  else if(utilization < 60) color = 'green';
  else if(utilization < 80) color = 'yellow';
  else color = 'red';
  var props =  {'color':color,'width':10};
  return props; 
}

// assign node properties
function nodeProperties() {
  var props = {'color':'gray'};
  return props;
}

setHttpHandler(function(req) {
  var resp = {links:{},nodes:{}};
  for(var link in links) {
    let utilization = links[link].reduce(
       function(acc,el) {
         let {agt,ds} = el;
         let bytes = metric(agt,ds+'.svg_weathermap_bytes')[0].metricValue || 0;
         let speed = metric(agt,ds+'.ifspeed')[0].metricValue || 0;
         let utilization = speed ? 800 * bytes / speed : -1;
         return Math.max(acc,utilization);
       }, -1);
    resp.links[link] = linkProperties(utilization); 
  }
  for(var node in nodes) {
    resp.nodes[node] = nodeProperties();
  }
  return resp;
});
