define([
    "mag/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/geometry/Extent"
], function(config, Map, MapView, FeatureLayer, Extent, ) {

    const maxExtent = new Extent(config.maxExtent);
    const initExtent = new Extent(config.intExtent);

    var map = new Map({
        basemap: "osm",
        // basemap: "gray",
    });

    var view = new MapView({
        container: "mapView",
        map,
        extent: initExtent,
        zoom: 8,
        constraints: {
            rotationEnabled: false,
            minZoom: 10
        },
        ui: {
            components: []
        },
        popup: {
            dockEnabled: false,
            collapseEnabled: false,
            dockOptions: {
                buttonEnabled: false,
                breakpoint: false,
            }
        }
    });

    var peoriaBoundaryLayer = new FeatureLayer({
        url: config.pBoundaryLayer,
        definitionExpression: "Juris = 'PEORIA'",
    });
    map.add(peoriaBoundaryLayer);

    var peoriaBusinessesLayer = new FeatureLayer({
        url: config.pBusinessLayer,
        outFields: ["*"],
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",
                size: 8,
                color: "#00008b",
                outline: {
                    width: 1,
                    color: "#dadaff",
                },
            },
        },
        popupTemplate: config.popTemplate
    });
    map.add(peoriaBusinessesLayer);

    let lyrView = null;

    view.watch('extent', function(extent) {
        let currentCenter = extent.center;
        if (!maxExtent.contains(currentCenter)) {
            let newCenter = extent.center;
            if (currentCenter.x < maxExtent.xmin) {
                newCenter.x = maxExtent.xmin;
            }
            if (currentCenter.x > maxExtent.xmax) {
                newCenter.x = maxExtent.xmax;
            }
            if (currentCenter.y < maxExtent.ymin) {
                newCenter.y = maxExtent.ymin;
            }
            if (currentCenter.y > maxExtent.ymax) {
                newCenter.y = maxExtent.ymax;
            }

            let newExtent = view.extent.clone();
            newExtent.centerAt(newCenter);
            view.extent = newExtent;
        }
    });

    view.whenLayerView(peoriaBusinessesLayer).then((layerView) => {
        lyrView = layerView;
        lyrView.watch("updating", function(value) {
            // once the layer view finishes updating
            if (!value) {
                lyrView
                    .queryFeatures({
                        where: "1=1",
                        outFields: lyrView.availableFields,
                    })
                    .then(({ features }) => {
                        let data = features.map(({ attributes }) => attributes);
                        let cardsList = getCardsList(data);
                        $("#cardsList").html(cardsList.join(""));
                    });
            }
        });
    });

    let $cboxTakeOut = $("#cboxTakeOut");
    let $cboxDelivery = $("#cboxDelivery");
    let $cboxApp = $("#cboxApp");

    let filters = [{
            field: "TakeOut",
            getValue: () => {
                return $cboxTakeOut.prop("checked") ? 1 : 0;
            },
        },
        {
            field: "Delivery",
            getValue: () => {
                return $cboxDelivery.prop("checked") ? 1 : 0;
            },
        },
        {
            field: "ThirdPartyApp",
            getValue: () => {
                return $cboxApp.prop("checked") ? 1 : 0;
            },
        },
    ];

    let highlight;

    $("body").on("click", ".card", async (e) => {
        let objectId = $(e.currentTarget).data("objectid");
        if (lyrView) {
            let { features } = await lyrView.queryFeatures({
                objectIds: [objectId],
                returnGeometry: true,
            });
            if (features[0]) {
                view.goTo({
                    target: features[0],
                    zoom: 15,
                });
            }
        }
    });

    $("body").on("mouseenter", ".card", async (e) => {
        let objectId = $(e.currentTarget).data("objectid");
        if (lyrView) {
            let { features } = await lyrView.queryFeatures({
                objectIds: [objectId],
            });
            if (features[0]) {
                if (highlight) {
                    highlight.remove();
                }
                highlight = lyrView.highlight(features[0]);
            }
        }
    });

    $("body").on("mouseleave", ".card", (e) => {
        if (highlight) {
            highlight.remove();
        }
    });

    $(".filterControl").change(() => {
        let filterComponents = filters
            .map((filter) => {
                let val = filter.getValue();
                return val ? `${filter.field} = ${val}` : null;
            })
            .filter((fltr) => fltr);
        peoriaBusinessesLayer.definitionExpression = filterComponents.join(
            " AND "
        );
        // console.log(filterComponents.join(" OR "));
    });

    return {
        map,
        view
    };
});


function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return 'N/A';
}

function formatWebsite() {

}

function getCardsList(data) {
    return data.map(
        ({
            OBJECTID,
            Name,
            Phone_Number,
            Address,
            Specials,
            Website,
            Opn_for,
            TakeOut,
            Delivery,
            ThirdPartyApp,
        }) => {
            return `
            <div data-objectid="${OBJECTID}" class="card">
              <div class="card-body">
                <h5 class="card-title">${titleCase(Name)}</h5>
                <h6 class="card-subtitle text-muted mb-2">${Address}</h6>
                ${
                    Phone_Number
                        ? `<p class="card-text"><em class="fa fa-phone"></em> ${formatPhoneNumber(Phone_Number)}</p>`
                        : ""
                }
                 ${
                    Website
                        ? `<p class="card-text"><a href="https://${Website}" class="card-link" target="_blank"><em class="fa fa-link"></em> Website</a></p>`
                        : ""
                }
                <div class="horizontalIconContainer">
                  ${
                      TakeOut
                          ? `<span class="card-text horizontalIcon"><em class="fa fa-car"></em> Take out</span>`
                          : ""
                  }
                  ${
                      Delivery
                          ? `<span class="card-text horizontalIcon"><em class="fa fa-truck"></em> Delivery</span>`
                          : ""
                  }
                  ${
                      ThirdPartyApp
                          ? `<span class="card-text horizontalIcon"><em class="fas fa-tablet-alt"></em> Mobile App</span>`
                          : ""
                  }
                </div>

              </div>
            </div>
          `;
        }
    );
}
