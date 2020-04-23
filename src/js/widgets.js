/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Peoria Business Resource Tool
 * @summary     Map widgets JavaScript file
 * @file        widgets.js
 * ======================================================================== */

define([
    "mag/config",
    "mag/map",
    "mag/addNewLocation",
    "esri/widgets/Zoom",
    "esri/widgets/Home",
    "esri/widgets/Search",
    "esri/tasks/Locator",
    "esri/geometry/Extent",
], function (
    config,
    { map, view },
    { enableDrawing },
    Zoom,
    Home,
    Search,
    Locator,
    Extent
) {
    //Add zoom widget
    var zoom = new Zoom({
        view,
    });
    view.ui.add(zoom, "top-left");

    //Add home widget
    var home = new Home({
        view,
    });
    view.ui.add(home, "top-left");

    //Add search widget
    let search = new Search({
        view,
        includeDefaultSources: false,
        locationEnabled: false,
        sources: [
            {
                locator: new Locator({
                    url:
                        "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
                }),
                singleLineFieldName: "SingleLine",
                outFields: ["Addr_type"],
                autoNavigate: true,
                searchExtent: config.initExtent,
                placeholder: "Address",
            },
        ],
    });
    view.ui.add(search, "bottom-left");

    let newLocationBtnId = "new-location-button";
    view.ui.add(newLocationBtnId, "top-right");
    let $newLocationBtn = $(`#${newLocationBtnId}`);
    $newLocationBtn.removeClass("hidden");
    $newLocationBtn.click(() => {
        enableDrawing();
    });
});
    }
);
