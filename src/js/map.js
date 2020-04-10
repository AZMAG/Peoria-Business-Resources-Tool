require([
    "mag/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/geometry/Extent",
    "esri/widgets/Search",
    "esri/tasks/Locator",
], function (config, Map, MapView, FeatureLayer, Extent, Search, Locator) {
    var map = new Map({
        basemap: "gray",
    });

    const extent = new Extent({
        xmin: -12532415.067261647,
        ymin: 3954353.6294668326,
        xmax: -12455978.038976442,
        ymax: 4030790.657752038,
        spatialReference: { wkid: 3857 },
    });

    var view = (window.view = new MapView({
        container: "mapView",
        map,
        extent,
    }));

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
                size: 6,
                color: "#00008b",
                outline: {
                    width: 1,
                    color: "#dadaff",
                },
            },
        },
    });
    map.add(peoriaBusinessesLayer);

    let lyrView = null;

    view.whenLayerView(peoriaBusinessesLayer).then((layerView) => {
        lyrView = layerView;
        lyrView.watch("updating", function (value) {
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
                        $("#numFeatures").html(cardsList.length);
                        $("#cardsList").html(cardsList.join(""));
                    });
            }
        });
    });

    let $cboxTakeOut = $("#cboxTakeOut");
    let $cboxDelivery = $("#cboxDelivery");
    let $cboxApp = $("#cboxApp");

    let filters = [
        {
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
                searchExtent: extent,
                placeholder: "Address",
            },
        ],
    });

    view.ui.add(search, "bottom-left");

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
        console.log(filterComponents.join(" OR "));
    });
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
                <h6 class="card-subtitle mb-2 text-muted">${Address}</h6>
                ${
                    Phone_Number
                        ? `<p class="card-text"><em class="fa fa-phone"></em> ${formatPhoneNumber(Phone_Number)}</p>`
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
                          ? `<span class="card-text horizontalIcon"><em class="fas fa-tablet-alt"></em> App</span>`
                          : ""
                  }
                </div>
                ${
                    Website
                        ? `<a href="${Website}" class="card-link"><em class="fa fa-link"></em> Website</a>`
                        : ""
                }
              </div>
            </div>
          `;
        }
    );
}
