define([
    "mag/map",
    "esri/widgets/Zoom",
    "esri/widgets/Home",
], function({ map, view }, Zoom, Home) {


    //Add basemap toggle widget
    // var basemapToggle = new BasemapToggle({
    //     view,
    //     nextBasemap: "hybrid"
    // });

    // basemapToggle.on('toggle', function(event) {
    //     const tractsLayer = map.findLayerById("tracts");

    //     if (event.current.title === "Imagery with Labels") {
    //         tractsLayer.opacity = .5;
    //     } else {
    //         tractsLayer.opacity = .9;
    //     }
    // });

    // view.ui.add(basemapToggle, "bottom-left");

    //Add zoom widget
    var zoom = new Zoom({
        view
    });
    view.ui.add(zoom, 'top-left');

    //Add home widget
    var home = new Home({
        view
    });
    view.ui.add(home, 'top-left');

    //Add locate widget
    // var locate = new Locate({
    //     view
    // });
    // view.ui.add(locate, 'bottom-left');

    //Add search widget
    // let search = new Search({
    //     view,
    //     includeDefaultSources: false,
    //     locationEnabled: false,
    //     sources: [{
    //         locator: new Locator({
    //             url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
    //         }),
    //         singleLineFieldName: "SingleLine",
    //         outFields: ["Addr_type"],
    //         autoNavigate: true,
    //         searchExtent: extent,
    //         placeholder: "Address",
    //     }, ],
    // });

    // view.ui.add(search, "bottom-left");

});
