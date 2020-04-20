/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Peoria Business Resource Tool
 * @summary     Map JavaScript file
 * @file        map.js
 * ======================================================================== */

define([
        "mag/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/geometry/Extent",
        "mag/card-functions",
    ],
    function(config, Map, MapView, FeatureLayer, Extent, cards) {
        "use strict";

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
                minZoom: 10,
            },
            ui: {
                components: [],
            },
            popup: {
                dockEnabled: false,
                collapseEnabled: false,
                dockOptions: {
                    buttonEnabled: false,
                    breakpoint: false,
                },
            },
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
            popupTemplate: config.popTemplate,
        });
        map.add(peoriaBusinessesLayer);

        let lyrView = null;

        view.watch("extent", function(extent) {
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

        let selectedId;

        view.popup.watch("visible", async (visible) => {
            if (visible) {
                selectedId = view.popup.selectedFeature.attributes.TableID;
            } else {
                selectedId = null;
            }

            let cardData = await getCardListData(lyrView);
            if (cardData) {
                let cardsList = getCardsList(cardData, selectedId);
                $("#cardsList").html(cardsList.join(""));
            }
        });

        async function getCardListData(lyrView) {
            let { features } = await lyrView.queryFeatures({
                where: "1=1",
                outFields: lyrView.availableFields,
            });
            if (features && features.length > 0) {
                return features.map(({ attributes }) => attributes);
            }
            return null;
        }

        var sortType = sortPos;

        function sortPos(a, b) {
            // Use toUpperCase() to ignore character casing
            const Restaurant_NameA = a.Restaurant_Name.toUpperCase();
            const Restaurant_NameB = b.Restaurant_Name.toUpperCase();

            let comparison = 0;
            if (Restaurant_NameA > Restaurant_NameB) {
                comparison = 1;
            } else if (Restaurant_NameA < Restaurant_NameB) {
                comparison = -1;
            }
            return comparison;
        }

        function sortNeg(a, b) {
            // Use toUpperCase() to ignore character casing
            const Restaurant_NameA = a.Restaurant_Name.toUpperCase();
            const Restaurant_NameB = b.Restaurant_Name.toUpperCase();

            let comparison = 0;
            if (Restaurant_NameA > Restaurant_NameB) {
                comparison = 1;
            } else if (Restaurant_NameA < Restaurant_NameB) {
                comparison = -1;
            }
            //invert return value by multiplying by -1
            return comparison * -1;
        }

        //sort button
        $("#sort-biz").on("click", function() {
            var toggleStatus = $("#sort-biz").attr("data-status");
            if (toggleStatus === "on") {
                $("#sort-biz").attr("data-status", "off");
                sortType = sortPos;
            } else {
                $("#sort-biz").attr("data-status", "on");
                sortType = sortNeg;
            }

            console.log(toggleStatus);
        });


        var getCardsList = cards.getCardsList;

        view.whenLayerView(peoriaBusinessesLayer).then((layerView) => {
            lyrView = layerView;
            lyrView.watch("updating", async function(value) {
                // once the layer view finishes updating
                if (!value) {
                    let cardData = await getCardListData(lyrView);
                    cardData.sort(sortType);
                    if (cardData) {
                        let cardsList = getCardsList(cardData, selectedId);
                        // console.log(cardData);
                        $("#cardsList").html(cardsList.join(""));
                    }
                    setupBizDropdown(cardData);
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

        // Search by Business Function
        function setupBizDropdown(data) {
            // console.log(data);
            var dropdown = $("#inputBiz");
            dropdown.kendoComboBox({
                dataTextField: "Restaurant_Name",
                dataValueField: "Restaurant_Name",
                filter: "none",
                suggest: true,
                template: "${data.Restaurant_Name}",
                dataSource: {
                    data: data,
                    sort: {
                        field: "Restaurant_Name",
                        dir: "asc"
                    }
                },
                placeholder: "Select a Business",
                change: onChange
            });

            function onChange() {
                var dropdown = $("#inputBiz");
                var bizData = dropdown.data("kendoComboBox");
                var dataItem = bizData.dataItem();
                // console.log(dataItem, dataItem.TableID);
                if (dataItem !== undefined) {
                    var e = dataItem.TableID;
                    gotoBiz(e);
                } else {
                    return;
                }
            }
        }

        async function gotoBiz(e) {
            let objectId = e;
            // console.log(objectId);
            if (lyrView) {
                let { features } = await lyrView.queryFeatures({
                    objectIds: [objectId],
                    returnGeometry: true,
                });

                if (features[0]) {
                    await view.goTo({
                        target: features[0],
                        zoom: 15,
                    });

                    view.popup.open({
                        location: features[0].geometry,
                        features: features,
                    });

                    selectedId = objectId;
                }
            };
        };

        let highlight;

        //Click on card and zoom to point on map
        $("body").on("click", ".card", async (e) => {
            let objectId = $(e.currentTarget).data("objectid");
            // console.log(objectId);
            if (lyrView) {
                let { features } = await lyrView.queryFeatures({
                    objectIds: [objectId],
                    returnGeometry: true,
                });

                if (features[0]) {
                    await view.goTo({
                        target: features[0],
                        zoom: 15,
                    });

                    view.popup.open({
                        location: features[0].geometry,
                        features: features,
                    });

                    selectedId = objectId;
                }
            }
        });

        //hover card and highlights point on map
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
        //hover card remove and remove highlighted point on map
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
            view,
        };
    });
