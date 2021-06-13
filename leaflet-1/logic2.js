

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {

  //Creating Map

let myMap = L.map("map", {
  center: [	36.778259, -119.417931],
  zoom: 5
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

function getColor(d) {
  return d > 90 ? '#d73027' :
         d > 70  ? '#fc8d59' :
         d > 50  ? '#fee08b' :
         d > 30  ? '#d9ef8b' :
         d > 10   ? '#91cf60' :
         d > -10  ? '#1a9850' :
                    '#1a9850' ;
}
  // Once we get a response, send the data.features object to the createFeatures function
  data.features.forEach(d=>{
    let lat=d.geometry.coordinates[1];
    let long=d.geometry.coordinates[0];
    let r=d.geometry.coordinates[2];
    let p=d.properties.place;
    let m=d.properties.mag;
  



        var circle = L.circle([lat,long], {
          color: getColor(r),
          fillColor: getColor(r),
          fillOpacity: 0.5,
          radius: Math.exp(m)*1000
      }).addTo(myMap);
    
      circle.bindPopup("<b>Earthquake magnitude: "+m.toString()+"</b><br>"+p);
    }
  );



  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [-10, 10, 30, 50, 70, 90],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);



});
