var map;
var gsvc;
var ex;
var why;
let coordPair;

require([
  "dojo/ready",
  "dojo/on",
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/parser",
  "dijit/registry",
  "dijit/layout/BorderContainer",
  "dijit/layout/ContentPane",
  "esri/map",
  "esri/arcgis/utils",
  "esri/domUtils",
  "esri/dijit/Popup",
  "esri/tasks/BufferParameters",
  "esri/tasks/GeometryService",
  "esri/geometry/webMercatorUtils",
  "esri/geometry/Geometry",
  "esri/geometry/Polygon", 
  "esri/geometry/Extent",
  "esri/SpatialReference",
  "esri/dijit/Search",
  "esri/layers/FeatureLayer",
  "esri/InfoTemplate",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "dojo/domReady!"
],
    function(
        ready,
        on,
        dom,
        domConstruct,
        parser,
        registry,
        BorderContainer,
        ContentPane,
        Map,
        arcgisUtils,
        domUtils,
        Popup,
        BufferParameters,
        GeometryService,
        webMercatorUtils,
        Geometry,
        Polygon,
        Extent,   
        SpatialReference,
        Search,
        FeatureLayer,
        InfoTemplate,
        ArcGISTiledMapServiceLayer
    ){ 
        ready(function() {
            parser.parse();

            //give the coordinates for the bounding box
            var boundingBox = new Extent(-122.408020,37.417635,-121.402771,37.908749, new SpatialReference({ wkid:4326 }));
    
         
//create a map
            map = new Map("map", {
                extent: boundingBox,
                basemap: "streets", 
                zoom: 11
            });


// Extent/Bounding Box
            var previousExtent = map.extent.getExtent();
            map.on("extent-change", function(){
                let currentExtent = map.extent.getExtent();
                if (boundingBox.contains(map.extent.getCenter())){
                // Update previous extent
                    previousExtent = map.extent.getExtent();
                }
                else {
                // if new extent is not in bounding box then reset to previous extent.
                    map.setExtent(previousExtent);
                }
            })
            map.infoWindow.set("popupWindow", false);

 /*           
//Buffer
            //gsvc = new esri.tasks.GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");            

            function doBuffer(evt) {
                map.graphics.clear();
                var params = new esri.tasks.BufferParameters();
                params.geometries = [ evt.mapPoint ];

              //buffer in linear units such as meters, km, miles etc.
                params.distances = [ document.getElementById("distance").value];
                var i = document.getElementById("units");
                params.unit = i.options[i.selectedIndex].value;
                params.outSpatialReference = map.spatialReference;

                gsvc.buffer(params, showBuffer);
            }//end doBuffer

            function showBuffer(geometries) {
                var symbol = new esri.symbol.SimpleFillSymbol(
                    esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                    new esri.symbol.SimpleLineSymbol(
                        esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                        new dojo.Color([0,0,255,0.65]), 2
                    ),
                    new dojo.Color([0,0,255,0.35])
                );

                dojo.forEach(geometries, function(geometry) {
                    var graphic = new esri.Graphic(geometry,symbol);
                    map.graphics.add(graphic);
                });
            }//end showBuffer
*/

/*
//Google Maps Street View Interactive
            var panorama;
            function initialize() {
            console.log("I am in the Google Maps function")
            panorama = new google.maps.StreetViewPanorama(
                document.getElementById('google-maps'),
                {
                    position: {lat: 37.803012, lng: -122.270312},
                    pov: {heading: 165, pitch: 0},
                    zoom: 1
                });//END initialize
            console.log("I am leaving the Google Maps function")
            }
*/           

/*
//Get x and y coordinates
            function centroidFinder(polygon){
                polygon = new Polygon(new SpatialReference({wiki:4326}));
                var mapPoint = polygon.getCentroid();
            };//end x and y coor


            function getLatLong(coord) {
                console.log(coord);
                console.log("I am in the function");
                let { mapPoint } = coord;
                let { x, y } = mapPoint;
                var normalizedVal = webMercatorUtils.xyToLngLat(x, y);
                ex = normalizedVal[0]; 
                why = normalizedVal[1];
                console.log("Coordinates are: [" + ex + " , " + why + "]");
                coordPair = {x: ex, y: why};
                ex = coordPair.x;
                why = coordPair.y;
                return coordPair;
            }//END get x and y coordinates

            map.on("click", getLatLong);
*/            

            //Click-Info
            //this is the information that pops up when zooming to and selecting a parcel
            var template = new InfoTemplate();
            template.setTitle("<b>Parcel</b>");
            template.setContent(
                "<hr><a href='https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${SitusAddress}&heading=360&fov=120&pitch=-5&sensor=false&key=AIzaSyAtsysKdAwT9jbKdgDJJPlaPVBm2wZRR2c' target='_blank'><b><img src='https://maps.googleapis.com/maps/api/streetview?size=350x250&location=${SitusAddress}&fov=120&pitch=-5&sensor=false&key=AIzaSyAtsysKdAwT9jbKdgDJJPlaPVBm2wZRR2c'></b></a>" +

               "<hr>TESTING" +

                "<hr>APN Book No: <b>${BOOK}</b>" +

                "<hr>APN Page No: <b>${PAGE}</b>" +
                
                "<hr>APN Parcel No: <b>${APN}</b>" +

                "<hr>APN Sub Parcel No: <b>${SUB_PARCEL}</b>" +

                "<hr>Sort Parcel: <b>${SORT_APN}</b>" +

                "<hr>Parcel No: <b>${PARCEL}</b>" +

                "<hr>Year Built: <b>${YearBuilt}</b>" +

                "<hr>TRA Primary (City): <b>${TRAPrimary}</b>" +

                "<hr>TRA Secondary: <b>${TRASecondary}</b>" +

                "<hr>Land Value: <b>${Land}</b>" +

                "<hr>Improvement Value: <b>${Imps}</b>" +

                "<hr>CLCA Land Value: <b>${CLCALand}</b>" +

                "<hr>CLCA Improvement Value: <b>${CLCAImps}</b>" +

                "<hr>Homeowner's Exemption: <b>${HOEX}</b>" +

                "<hr>Other Exemption: <b>${OTEX}</b>" +

                "<hr>Total Net Value: <b>${TotalNetValue}</b>" +

                "<hr>Latest Document Prefix: <b>${LatestDocument_Prefix}</b>" +

                "<hr>Latest Document Series: <b>${LatestDocumentSeries}</b>" +

                "<hr>Latest Document Date: <b>${LatestDocumentDate}</b>" +

                "<hr>Use Code: <b>${UseCode}</b>" +

                "<hr>Economic Unit Flag: <b>${EconUnit}</b>" +
                
                "<hr>Situs Address: <b>${SitusAddress}</b>" +

                "<hr>Mailing Address: <b>${MailingAddress}</b>" +
                
                "<hr> View Assessor's Map: <a href=http://www.acgov.org/MS/prop/index.aspx?PRINT_PARCEL=${APN} target='_blank'><b>View Parcel Info</b></a>" +
                
                "<hr> View Assessor's Map: <a href=https://www.acgov.org/ptax_pub_app/RealSearchInit.do?searchByParcel=true&parcelNumber=${APN} target='_blank'><b>View Tax Info</b></a>"
            );

            var featureLayer = new FeatureLayer("https://services5.arcgis.com/ROBnTHSNjoZ2Wm1P/arcgis/rest/services/Parcels/FeatureServer/0", {
                mode: FeatureLayer.MODE_ONDEMAND,
                outFields: ["*"],
                infoTemplate: template});

            //Creates Sidebar
            map.addLayer(featureLayer);
            initializeSidebar(map);

            //puts county boder outline
            var countyBoundary = new FeatureLayer("https://services5.arcgis.com/ROBnTHSNjoZ2Wm1P/arcgis/rest/services/County_Boundary/FeatureServer/0");
            map.addLayer(countyBoundary);

            //adds apn numbers
            var tiled2 = new ArcGISTiledMapServiceLayer("https://tiles.arcgis.com/tiles/ROBnTHSNjoZ2Wm1P/arcgis/rest/services/Parcel_Labels/MapServer", {maxScale:0, minScale:4000});
            map.addLayer(tiled2);

            //Adds Parcel boundaries outline
            var parcel_boundaries = new ArcGISTiledMapServiceLayer("https://tiles.arcgis.com/tiles/ROBnTHSNjoZ2Wm1P/arcgis/rest/services/Parcel_Boundaries/MapServer", {maxScale:0, minScale:4000});
            map.addLayer(parcel_boundaries);
            
            
            //Search
            var search = new Search({
                enableButtonMode: false, //this enables the search widget to display as a single button
                enableLabel: false,
                enableInfoWindow: true,
                showInfoWindowOnSelect: false,
                enableSearchingAll: true,
                map: map}, 
                "search");
            
            //changed "search.get("sources") to [] 
            //to get rid of esri world geocoder option
            var sources = [];

            //Street Address Search
            sources.push({
                featureLayer: new FeatureLayer("https://services5.arcgis.com/ROBnTHSNjoZ2Wm1P/arcgis/rest/services/Parcels/FeatureServer/0"),
                searchFields: ["SitusAddress"],
                displayField: "SitusAddress",
                exactMatch: false,
                name: "Street Address",
                outFields: ["*"],
                placeholder: "Street Address",
                maxResults: 6,
                maxSuggestions: 6,

                //puts information for when you do a street address search
                infoTemplate: new InfoTemplate("Search Results",
                    "<hr><a href='https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${SitusAddress}&heading=360&fov=120&pitch=-5&sensor=false&key=AIzaSyAtsysKdAwT9jbKdgDJJPlaPVBm2wZRR2c' target='_blank'><b><img src='https://maps.googleapis.com/maps/api/streetview?size=350x250&location=${SitusAddress}&fov=120&pitch=-5&sensor=false&key=AIzaSyAtsysKdAwT9jbKdgDJJPlaPVBm2wZRR2c'></b></a>" +

                    "<hr>APN Book No: <b>${BOOK}</b>" +

                    "<hr>APN Page No: <b>${PAGE}</b>" +
                    
                    "<hr>APN Parcel No: <b>${APN}</b>" +

                    "<hr>APN Sub Parcel No: <b>${SUB_PARCEL}</b>" +

                    "<hr>Sort Parcel: <b>${SORT_APN}</b>" +

                    "<hr>Parcel No: <b>${PARCEL}</b>" +

                    "<hr>Year Built: <b>${YearBuilt}</b>" +

                    "<hr>TRA Primary (City): <b>${TRAPrimary}</b>" +

                    "<hr>TRA Secondary: <b>${TRASecondary}</b>" +

                    "<hr>Land Value: <b>${Land}</b>" +

                    "<hr>Improvement Value: <b>${Imps}</b>" +

                    "<hr>CLCA Land Value: <b>${CLCALand}</b>" +

                    "<hr>CLCA Improvement Value: <b>${CLCAImps}</b>" +

                    "<hr>Homeowner's Exemption: <b>${HOEX}</b>" +

                    "<hr>Other Exemption: <b>${OTEX}</b>" +

                    "<hr>Total Net Value: <b>${TotalNetValue}</b>" +

                    "<hr>Latest Document Prefix: <b>${LatestDocument_Prefix}</b>" +

                    "<hr>Latest Document Series: <b>${LatestDocumentSeries}</b>" +

                    "<hr>Latest Document Date: <b>${LatestDocumentDate}</b>" +

                    "<hr>Use Code: <b>${UseCode}</b>" +

                    "<hr>Economic Unit Flag: <b>${EconUnit}</b>" +
                    
                    "<hr>Situs Address: <b>${SitusAddress}</b>" +

                    "<hr>Mailing Address: <b>${MailingAddress}</b>" +
                    
                    "<hr> View Assessor's Map: <a href=http://www.acgov.org/MS/prop/index.aspx?PRINT_PARCEL=${APN} target='_blank'><b>View Parcel Info</b></a>" +
                    
                    "<hr> View Assessor's Map: <a href=https://www.acgov.org/ptax_pub_app/RealSearchInit.do?searchByParcel=true&parcelNumber=${APN} target='_blank'><b>View Tax Info</b></a>"
                ),
                enableSuggestions: true,
                minCharacters: 0
            });// end Street Address Search

            //APN Search
            sources.push({
                featureLayer: new FeatureLayer("https://services5.arcgis.com/ROBnTHSNjoZ2Wm1P/arcgis/rest/services/Parcels/FeatureServer/0"),
                searchFields: ["APN", "BOOK", "PAGE"],
                displayField: "APN",
                exactMatch: false,
                name: "APN",
                outFields: ["*"],
                placeholder: "APN Number",
                maxResults: 6,
                maxSuggestions: 6,

                //puts information when you do an apn search
                infoTemplate: new InfoTemplate("Search Results",
                    "<hr><a href='https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${SitusAddress}&heading=360&fov=120&pitch=-5&sensor=false&key=AIzaSyAtsysKdAwT9jbKdgDJJPlaPVBm2wZRR2c' target='_blank'><b><img src='https://maps.googleapis.com/maps/api/streetview?size=350x250&location=${SitusAddress}&fov=120&pitch=-5&sensor=false&key=AIzaSyAtsysKdAwT9jbKdgDJJPlaPVBm2wZRR2c'></b></a>" +
                    
                    "<hr>APN Book No: <b>${BOOK}</b>" +

                    "<hr>APN Page No: <b>${PAGE}</b>" +
                    
                    "<hr>APN Parcel No: <b>${APN}</b>" +

                    "<hr>APN Sub Parcel No: <b>${SUB_PARCEL}</b>" +

                    "<hr>Sort Parcel: <b>${SORT_APN}</b>" +

                    "<hr>Parcel No: <b>${PARCEL}</b>" +

                    "<hr>Year Built: <b>${YearBuilt}</b>" +

                    "<hr>TRA Primary (City): <b>${TRAPrimary}</b>" +

                    "<hr>TRA Secondary: <b>${TRASecondary}</b>" +

                    "<hr>Land Value: <b>${Land}</b>" +

                    "<hr>Improvement Value: <b>${Imps}</b>" +

                    "<hr>CLCA Land Value: <b>${CLCALand}</b>" +

                    "<hr>CLCA Improvement Value: <b>${CLCAImps}</b>" +

                    "<hr>Homeowner's Exemption: <b>${HOEX}</b>" +

                    "<hr>Other Exemption: <b>${OTEX}</b>" +

                    "<hr>Total Net Value: <b>${TotalNetValue}</b>" +

                    "<hr>Latest Document Prefix: <b>${LatestDocument_Prefix}</b>" +

                    "<hr>Latest Document Series: <b>${LatestDocumentSeries}</b>" +

                    "<hr>Latest Document Date: <b>${LatestDocumentDate}</b>" +

                    "<hr>Use Code: <b>${UseCode}</b>" +

                    "<hr>Economic Unit Flag: <b>${EconUnit}</b>" +
                    
                    "<hr>Situs Address: <b>${SitusAddress}</b>" +

                    "<hr>Mailing Address: <b>${MailingAddress}</b>" +
                    
                    "<hr> View Assessor's Map: <a href=http://www.acgov.org/MS/prop/index.aspx?PRINT_PARCEL=${APN} target='_blank'><b>View Parcel Info</b></a>" +
                    
                    "<hr> View Assessor's Map: <a href=https://www.acgov.org/ptax_pub_app/RealSearchInit.do?searchByParcel=true&parcelNumber=${APN} target='_blank'><b>View Tax Info</b></a>"
                ),
                enableSuggestions: true,
                minCharacters: 0
            });

            //Set the sources above to the search widget
            search.set("sources", sources);
            search.startup();
            }); //end ready function


        //Sidebar
        function initializeSidebar(map) {
            var popup = map.infoWindow;
            //when the selection changes update the side panel to display the popup info for the
            //currently selected feature.
            popup.on("SelectionChange", function() {
              displayPopupContent(popup.getSelectedFeature());
            });
            //when the selection is cleared remove the popup content from the side panel.
            popup.on("ClearFeatures", function() {
              dom.byId("featureCount").innerHTML = "Click to select feature(s)";
              registry.byId("leftPane").set("content", "");
              domUtils.hide(dom.byId("pager"));
            });
            //When features are associated with the  map's info window update the sidebar with the new content.
            popup.on("SetFeatures", function() {
              displayPopupContent(popup.getSelectedFeature());
              dom.byId("featureCount").innerHTML = popup.features.length + " feature(s) selected";
              //Enable navigation if more than one feature is selected
              popup.features.length > 1 ? domUtils.show(dom.byId("pager")) : domUtils.hide(dom.byId("pager"));
            });
        } //end initializeSidebar


        function displayPopupContent(feature) {
            if (feature) {
                var content = feature.getContent();
                registry.byId("leftPane").set("content", content);
            }
        } //end displayPopupContent

    } //end function
); //end require

var i = true;
function myFunction() {
    var main = document.getElementById("featureCount");
    var buffer = document.getElementById("btn");  
    if (i) {
      main.innerText = "Enter the distance and unit of measurement to set the buffer.";
      i = false;
      buffer.innerHTML = "Back to Main";
    }
    else {
      main.innerHTML = "From the search drop-down, select which type you would like to search, then enter an address within Alameda County.";
      i = true;
      buffer.innerHTML = "Buffer";

    }
}

/*
getAllPosts().then(response => {
    console.log(response);
}).catch(e => {
    console.log(e);
});

*/