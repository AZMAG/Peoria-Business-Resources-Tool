/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Peoria Business Resource Tool
 * @summary     Map controls JavaScript file
 * @file        controls.js
 * ======================================================================== */

define(["mag/config", "mag/map", "mag/card-functions"], function(
    config, { map, view },
    cards
) {
    var getCardsList = cards.getCardsList;
    var peoriaBusinessesLayer = map.peoriaBusinessesLayer;
    let lyrView = null;
    let selectedId;

    async function getCardListData(lyrView) {
        let { features } = await lyrView.queryFeatures({
            where: "active=1",
            outFields: lyrView.availableFields,
        });
        if (features && features.length > 0) {
            return features.map(({ attributes }) => attributes);
        }
        return null;
    }



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
                bizCatogory(cardData);
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

    $(".filterControl").change(() => {
        peoriaBusinessesLayer.definitionExpression = getCurrentDefinitionExpression();
    });

    function getCurrentDefinitionExpression() {
        let definitionExpression = "active=1";
        let checkboxes = filters
            .map((filter) => {
                let val = filter.getValue();
                return val ? `${filter.field} = ${val}` : null;
            })
            .filter((fltr) => fltr);
        var dropdown = $("#bizCat");
        var bizData = dropdown.data("kendoComboBox");
        var dataItem = bizData.dataItem();

        if (checkboxes.length > 0) {
            definitionExpression += " AND " + checkboxes.join(" AND ");
        }
        if (dataItem) {
            definitionExpression += ` AND Category = '${dataItem}'`;
        }
        console.log(definitionExpression);
        return definitionExpression;
    }

    var sortType = sortPos;

    function sortPos(a, b) {
        // Use toUpperCase() to ignore character casing
        const BusinessNameA = a.BusinessName.toUpperCase();
        const BusinessNameB = b.BusinessName.toUpperCase();

        let comparison = 0;
        if (BusinessNameA > BusinessNameB) {
            comparison = 1;
        } else if (BusinessNameA < BusinessNameB) {
            comparison = -1;
        }
        return comparison;
    }

    function sortNeg(a, b) {
        // Use toUpperCase() to ignore character casing
        const BusinessNameA = a.BusinessName.toUpperCase();
        const BusinessNameB = b.BusinessName.toUpperCase();

        let comparison = 0;
        if (BusinessNameA > BusinessNameB) {
            comparison = 1;
        } else if (BusinessNameA < BusinessNameB) {
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
        // console.log(toggleStatus);
    });

    // Search by Business Function
    function setupBizDropdown(data) {
        // console.log(data);
        var dropdown = $("#inputBiz");
        dropdown.kendoComboBox({
            dataTextField: "BusinessName",
            dataValueField: "BusinessName",
            filter: "none",
            suggest: true,
            template: "${data.BusinessName}",
            dataSource: {
                data: data,
                sort: {
                    field: "BusinessName",
                    dir: "asc",
                },
            },
            placeholder: "Select a Business",
            change: onChange,
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

    function bizCatogory(data) {
        // console.log(data);
        let unique = [...new Set(data.map((item) => item.Category))];
        // console.log(unique);
        // create ComboBox from input HTML element
        $("#bizCat").kendoComboBox({
            dataSource: {
                data: unique,
                sort: {
                    dir: "asc",
                },
            },
            placeholder: "Select a Category",
            change: onChange,
        });

        function onChange() {
            const peoriaBusinessesLayer = map.findLayerById("peoriaBusinesses");
            peoriaBusinessesLayer.definitionExpression = getCurrentDefinitionExpression();
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
        }
    }

    let highlight;

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
});
