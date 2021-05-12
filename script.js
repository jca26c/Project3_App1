// Load necessary packages 
require([
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer",
    "esri/views/MapView",
    "esri/WebMap",
    "esri/Camera",
    "esri/widgets/Home",
    "esri/widgets/ScaleBar",
    "esri/widgets/Search",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/LayerList",
    "esri/widgets/Legend",
    "dojo/domReady!"
      ], function(
            Map,
           FeatureLayer,
           GeoJSONLayer,
           MapView,
           WebMap,
           Camera,
           Home,
           ScaleBar,
           Search,
           BasemapGallery,
           Expand,
           LayerList,
           Legend
          ) {
    
    // Create the map
    var map = new Map({
      basemap: "topo-vector"
    });
    
    // Create the MapView
    var view = new MapView({
      container: "viewDiv",
      map: map,
      center:[-89.5465041, 43.0849081],
      zoom: 11
    });
    
    // Create a home button
    var home_btn = new Home({
      view: view
    });
    
    // Add the home button
    view.ui.add(home_btn, "top-left");
    
    // Create the scale bar
    var scaleBar = new ScaleBar({
      view: view,
      unit: "dual"
    });
    
    // Add the scale bar
    view.ui.add(scaleBar, {
      position: "bottom-left"
    });
    
      view.ui.add(
            new Search({
              view: view
            }),
            "top-right"
          );
    
    var basemapGallery = new BasemapGallery({
      view: view,
      container: document.createElement("div")
    });
    
    // Create the expand widget
    var bgExpand = new Expand({
      view: view,
      content: basemapGallery
    });
    
    view.ui.add(bgExpand, "top-right");
  
    // close the expand whenever a basemap is selected
    basemapGallery.watch("activeBasemap", function() {
      var mobileSize = view.heightBreakpoint === "xsmall" || view.widthBreakpoint === "xsmall";
      if (mobileSize) {
        bgExpand.collapse();
      }
    });
    
    var layerList = new LayerList({
      container: document.createElement("div"),
      view: view
    });
    
    var layerListExpand = new Expand({
      expandIconClass: "esri-icon-layer-list",  
      view: view,
      content: layerList
    });
    view.ui.add(layerListExpand, "top-left");
    
  const labelClass = {
      symbol: {
        type: "text", 
        color: "black",
        font: {
          family: "Playfair Display",
          size: 8,
          weight: "bold"
        }
      },
      labelPlacement: "above-center",
      labelExpressionInfo: {
        expression: "$feature.PlanName"
      }
    };
     // Create pop-up information from metdata tags
    // Pop-up for Madison WI neighborhoods
    var template_neighborhood = { // autocasts as new PopupTemplate()
        title: "Neighborhood: {PlanName}",
        content: [{
          type: "fields",
          fieldInfos: [{
            fieldName: "Status",
            label: "Status: ",
            visible: true,
            format: {
              digitSeparator: true,
              places: 0
            }
          }, {
            fieldName: "Year",
            label: "Year: ",
            visible: true,
            format: {
              digitSeparator: true,
              places: 0
            }
          }, {
            fieldName: "Link",
            label: "Link: ",
            visible: true,
            format: {
              digitSeparator: true,
              places: 0
            }
          }]
        }]
      };
    // Create pop-up template for Madison WI bike paths
    var template_bike_path = { // autocasts as new PopupTemplate()
      title: "BFuncClass {BFuncClass}",
      content: [{
        type: "fields",
        fieldInfos: [{
          fieldName: "BFuncClass",
          label: "BFuncClass: ",
          visible: true,
          format: {
            digitSeparator: true,
            places: 0
          }
        }, {
          fieldName: "Status",
          label: "Status: ",
          visible: true,
          format: {
            digitSeparator: true,
            places: 0
          }
        }, {
          fieldName: "Surface",
          label: "Surface: ",
          visible: true,
          format: {
            digitSeparator: true,
            places: 0
          }
        }]
      }]
    };
  // Create pop-up template for Madison WI bike stations
    var template_bike_station = { // autocasts as new PopupTemplate()
      title: "Bike Station: {Location}",
      content: [{
        type: "fields",
        fieldInfos: [{
          fieldName: "Location",
          label: "Location: ",
          visible: true,
          format: {
            digitSeparator: true,
            places: 0
          }
        }, {
          fieldName: "StationID",
          label: "Station ID: ",
          visible: true,
          format: {
            digitSeparator: true,
            places: 0
          }
        }]
      }]
    };
    
    // Create pop-up for Madison WI bike hazards
    var template_bike_hazard = { // autocasts as new PopupTemplate()
      title: "Jurisdiction: {Jurisdicti}",
      content: [{
        type: "fields",
        fieldInfos: [{
          fieldName: "Jurisdicti",
          label: "Jurisdiction: ",
          visible: true,
          format: {
            digitSeparator: true,
            places: 0
          }
        }, {
          fieldName: "Comments",
          label: "Comments: ",
          visible: true,
          format: {
            digitSeparator: true,
            places: 0
          }
        }]
      }]
    };
    
    // Create FeatureLayers
    // Reference the popupTemplate instance in the popupTemplate property of FeatureLayer
    // Create Madison WI neighborhood FeatureLayer
    var featureLayer_neighborhood = new FeatureLayer({
      url: "https://services2.arcgis.com/bB9Y1bGKerz1PTl5/arcgis/rest/services/Neighborhood_Plans/FeatureServer",
      outFields: ["*"],
      popupTemplate: template_neighborhood,
      labelingInfo: [labelClass],
          renderer: {
      type: "simple",
      symbol: {
        type: "simple-marker",
        color: "rgba(0,100,0,0.6)",
        size: 3,
        outline: {
          color: [0, 0, 0, 0.1],
          width: 2.0
        }
      }
    }
   });
    
    // Create Madison WI bike paths FeatureLayer
    var featureLayer_bike_paths = new FeatureLayer({
      url: "https://services2.arcgis.com/bB9Y1bGKerz1PTl5/arcgis/rest/services/Bike_Paths/FeatureServer",
      outFields: ["*"],
      popupTemplate: template_bike_path,
      labelingInfo: [labelClass],
      renderer: {
        type: "simple",
        symbol: {
          type: "simple-marker",
          color: "rgba(0,0,50,50)",
          size: 3,
          outline: {
            color: [0, 0, 50, 50],
            width: 0.5
          }
        }
      }
    })
  
        // Create Madison WI bike stations FeatureLayer
        var featureLayer_bike_stations = new FeatureLayer({
          url: "https://services2.arcgis.com/bB9Y1bGKerz1PTl5/arcgis/rest/services/City_Bike_Count_Stations/FeatureServer",
          outFields: ["*"],
          popupTemplate: template_bike_station
        });
  

    // Create Madison WI bike hazards cluster renderer
    const bike_hazard_cluster = {
      type: "cluster",
      clusterRadius: "100px",
      popupTemplate: {
        content: "This cluster represents {cluster_count} bike accidents.",
        fieldInfos: [{
          fieldName: "cluster_count",
          format: {
            places: 0,
            digitSeparator: true
          }
        }]
      },
      clusterMinSize: "24px",
      clusterMaxSize: "60px",
      labelingInfo: [{
        deconflictionStrategy: "none",
        labelExpressionInfo: {
          expression:
          "Text($feature.cluster_count, '#,###')"
        },
        symbol: {
          type: "text",
          color: "#FFFFFF",
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "12px"
          }
        },
        labelPlacement: "center-center",
      }]
    }
    // Create Madison WI bike hazards FeatureLayer
    const bike_hazards_layer = new FeatureLayer({
      title: "Bike Hazards",
      url: "https://services2.arcgis.com/bB9Y1bGKerz1PTl5/arcgis/rest/services/Madison_Bike_Hazards/FeatureServer",
      featureReduction: bike_hazard_cluster,
      outFields: ["*"],
      popupTemplate: template_bike_hazard,
      renderer: {
        type: "simple",
        field: "mag",
        symbol: {
          type: "simple-marker",
          size: 4,
          color: "#FF5733",
          outline: {
            color: "rgba(0, 139, 174, 0.5)",
            width: 5
          }
        }
      }
    });
    
    // Create the symbol for bike paths
    var symbol_bike_path = {
      type: "simple-line", 
      color:"green",
      size: 3
    };
    
    // Create the renderer for bike paths
    featureLayer_bike_paths.renderer = {
      type: "simple", // autocasts as new SimpleRenderer()
      symbol: symbol_bike_path
    };
    
    
    // Create the symbol for neighborhoods
    var symbol_neighborhood = {
      type: "simple-line", 
      color:"black",
      size: 3
    };
    
    // Create the renderer for neighborhoods  
    featureLayer_neighborhood.renderer = {
      type: "simple", // autocasts as new SimpleRenderer()
      symbol: symbol_neighborhood
    };
    
      var legend = new Legend({
      view: view,
      layerInfos: [{
        layer: bike_hazards_layer,
        title: "Bike Hazards"
      },{
        layer: featureLayer_bike_paths,
        title: "Madison Bike Paths"
      },{
        layer: featureLayer_neighborhood,
        title: "Madison Neighborhoods"
      },{
        layer: featureLayer_bike_stations,
        title: "Madison Bike Stations"
      }]
    });
    
    // Add the legend 
    view.ui.add(legend, "bottom-right"); 
  
    
    // Add the neighborhood FeatureLayer
    map.add(featureLayer_neighborhood);
    
    // Add the bike paths FeatureLayer
    map.add(featureLayer_bike_paths);
    
    // Add the bike stations FeatureLayer
    map.add(featureLayer_bike_stations);
    
    // Add the bike hazards cluster FeatureLayer
    map.add(bike_hazards_layer);
      });
