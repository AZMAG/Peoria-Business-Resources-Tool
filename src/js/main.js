require([
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/FeatureLayer',
  'esri/geometry/Extent',
  'esri/widgets/FeatureTable',
], function (Map, MapView, FeatureLayer, Extent) {
  var map = new Map({
    basemap: 'gray',
  });

  const extent = new Extent({
    xmin: -12532415.067261647,
    ymin: 3954353.6294668326,
    xmax: -12455978.038976442,
    ymax: 4030790.657752038,
    spatialReference: { wkid: 3857 },
  });

  var view = (window.view = new MapView({
    container: 'mapView',
    map,
    extent,
  }));

  var peoriaBoundaryLayer = new FeatureLayer({
    url: 'https://geo.azmag.gov/arcgis/rest/services/maps/RegionalBoundaries/MapServer/3',
    definitionExpression: "Juris = 'PEORIA'",
  });

  map.add(peoriaBoundaryLayer);

  var peoriaBusinessesLayer = new FeatureLayer({
    url: 'https://geo.azmag.gov/arcgis/rest/services/maps/PeoriaBusinesses/MapServer/0',
  });

  map.add(peoriaBusinessesLayer);

  view.whenLayerView(peoriaBusinessesLayer).then((lyrView) => {
    peoriaBusinessesLayer.queryFeatures().then(({ features }) => {
      let data = features.map(({ attributes }) => attributes);
      $('#table').kendoGrid({
        dataSource: data,
        height: 500,
        scrollable: true,
        columns: [
          { field: 'Name', title: 'Name' },
          { field: 'Phone_Number', title: 'Phone Number' },
          { field: 'Address', title: 'Address' },
          { field: 'Specials', title: 'Specials' },
          { field: 'Website', title: 'Website' },
          { field: 'Opn_for', title: 'Open For' },
        ],
      });
    });
  });

  view.when(() => {});
});
