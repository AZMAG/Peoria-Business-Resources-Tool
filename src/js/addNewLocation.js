/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Peoria Business Resource Tool
 * @summary     Add New Location JavaScript file
 * @file        addNewLocation.js
 * ======================================================================== */
define([
    "mag/config",
    "mag/map",
    "esri/views/2d/draw/Draw",
    "esri/geometry/geometryEngine",
    "esri/Graphic",
    "esri/layers/FeatureLayer",
    "esri/geometry/Point",
], function(
    config, { view },
    Draw,
    geometryEngine,
    Graphic,
    FeatureLayer,
    Point
) {
    const $commentPin = $(".commentPin");
    const $iconTooltip = $(".iconTooltip");
    const $modalForm = $("#modalForm");
    let $newBusinessForm;
    const $btnCancelDrawing = $("#btnCancelDrawing");

    function setup() {
        $newBusinessForm = $("#newBusinessForm");
        $newBusinessForm.submit(formSubmitted);
    }

    let drawing = false;
    let currCoordinate;
    let action;

    let editLayer = new FeatureLayer({
        url: config.editLayer,
    });

    async function addMissingBusiness(data) {
        data.businessname = data.BusinessName;
        data.businessaddress = data.BusinessAddress;
        data.businesswebsite = data.BusinessWebsite;
        data.businessphone = data.BusinessPhone;
        data.takeoutcbox = data.takeOutCbox;
        data.deliverycheckbox = data.deliveryCheckBox;
        data.mobileapp = data.mobileApp;
        data.name = data.NAME;
        data.email = data.EMAIL;

        data.takeoutcbox = data.takeOutCbox ? 1 : 0;
        data.deliverycheckbox = data.deliveryCheckBox ? 1 : 0;
        data.mobileapp = data.mobileApp ? 1 : 0;

        delete data.BusinessName;
        delete data.BusinessAddress;
        delete data.BusinessWebsite;
        delete data.BusinessPhone;
        delete data.takeOutCbox;
        delete data.deliveryCheckBox;
        delete data.mobileApp;
        delete data.NAME;
        delete data.EMAIL;

        let newGraphic = new Graphic({
            geometry: currCoordinate.geometry,
            attributes: data,
        });

        let res = await editLayer.applyEdits({
            addFeatures: [newGraphic],
        });
    }

    function enableDrawing(id) {
        drawing = true;
        // $btnCancelDrawing.show();
        const draw = new Draw({
            view,
        });

        action = draw.create("point");
        action.on("cursor-update", function(evt) {
            if (drawing) {
                $iconTooltip.css({
                    display: "block",
                    left: evt.native.pageX + 20,
                    top: evt.native.pageY - 10,
                });
                createPointGraphic(evt.coordinates);
            }
        });

        $("#mapViewDiv").click(() => {
            if (drawing) {
                view.graphics.removeAll();
                drawing = false;
            }
        });

        action.on("draw-complete", function(evt) {
            $commentPin.removeClass("active");
            $btnCancelDrawing.hide();
            $iconTooltip.hide();
            drawing = true;
            currCoordinate = createPointGraphic(evt.coordinates);
            drawing = false;

            $modalForm.modal("show");
        });
    }

    function ResetForm() {
        $newBusinessForm.removeClass("was-validated");
        $newBusinessForm[0].reset();
        $modalForm.modal("hide");
        view.graphics.removeAll();
    }

    function createPointGraphic(coordinates) {
        if (drawing) {
            view.graphics.removeAll();
            const point = {
                type: "point",
                x: coordinates[0],
                y: coordinates[1],
                spatialReference: view.spatialReference,
            };

            const graphic = new Graphic({
                geometry: point,
                symbol: {
                    type: "simple-marker",
                    size: 8,
                    color: "#00008b",
                    outline: {
                        color: [255, 255, 0],
                        width: 2,
                    },
                },
            });
            view.graphics.add(graphic);
            return graphic;
        }
    }

    async function formSubmitted(e) {
        e.preventDefault();
        e.stopPropagation();

        const $form = $(e.currentTarget);
        const form = $form[0];

        const formValid = form.checkValidity();
        $form.addClass("was-validated");
        if (formValid) {
            let BusinessName = $('input[name="BusinessName"]').val();
            let BusinessAddress = $("input[name=BusinessAddress]").val();
            let BusinessWebsite = $("input[name=BusinessWebsite]").val();
            let BusinessPhone = $("input[name=BusinessPhone]").val();
            let takeOutCbox = $("#takeOutCbox").prop("checked");
            let deliveryCheckBox = $("#deliveryCheckBox").prop("checked");
            let mobileApp = $("#mobileApp").prop("checked");
            let NAME = $("input[name=NAME]").val();
            let EMAIL = $("input[name=EMAIL]").val();

            addMissingBusiness({
                BusinessName,
                BusinessAddress,
                BusinessWebsite,
                BusinessPhone,
                takeOutCbox,
                deliveryCheckBox,
                mobileApp,
                NAME,
                EMAIL,
            });

            ResetForm();

            $(".successMessage").fadeIn(300, function() {
                var message = this;
                setTimeout(function() {
                    $(message).fadeOut(500);
                }, 3000);
            });
        }
    }

    return { addMissingBusiness, enableDrawing, setup };
});