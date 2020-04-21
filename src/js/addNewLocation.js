define([
    "mag/config",
    "mag/map",
    "esri/views/2d/draw/Draw",
    "esri/geometry/geometryEngine",
    "esri/Graphic",
    "esri/geometry/Point",
], function (config, { view }, Draw, geometryEngine, Graphic, Point) {
    async function addNewBusiness() {
        alert("dfs");
    }
    const $commentPin = $(".commentPin");
    const $iconTooltip = $(".iconTooltip");
    const $modalForm = $("#modalForm");
    const $newBusinessForm = $("#newBusinessForm");
    const $btnCancelDrawing = $("#btnCancelDrawing");

    let drawing = false;
    let currComment;
    let currCommentType;
    let currCommentIndex;
    let action;

    // let commentsLyr = app.map.findLayerById("mainLayer");

    $newBusinessForm.submit(FormSubmitted);

    function enableDrawing(id) {
        drawing = true;
        // $btnCancelDrawing.show();
        const draw = new Draw({
            view,
        });

        action = draw.create("point");
        action.on("cursor-update", function (evt) {
            if (drawing) {
                $iconTooltip.css({
                    display: "block",
                    left: evt.native.pageX + 20,
                    top: evt.native.pageY - 10,
                });
                createPointGraphic(evt.coordinates, currCommentType);
            }
        });

        $("#mapViewDiv").click(() => {
            if (drawing) {
                view.graphics.removeAll();
                drawing = false;
            }
        });

        action.on("draw-complete", function (evt) {
            $commentPin.removeClass("active");
            $btnCancelDrawing.hide();
            $iconTooltip.hide();
            drawing = true;
            currComment = createPointGraphic(evt.coordinates);
            drawing = false;

            $modalForm.modal("show");
        });
    }
    function ResetForm() {
        // $newBusinessForm.removeClass("was-validated");
        // $newBusinessForm[0].reset();
        // let formNAME = localStorage.getItem("form-NAME");
        // let formPHONE = localStorage.getItem("form-PHONE");
        // let formEMAIL = localStorage.getItem("form-EMAIL");
        // $newBusinessForm.find("input[name=NAME]").val(formNAME);
        // $newBusinessForm.find("input[name=PHONE]").val(formPHONE);
        // $newBusinessForm.find("input[name=EMAIL]").val(formEMAIL);
        // $modalForm.modal("hide");
        // app.view.graphics.removeAll();
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

    async function FormSubmitted(e) {
        e.preventDefault();
        e.stopPropagation();

        const $form = $(e.currentTarget);
        const form = $form[0];

        const formValid = form.checkValidity();
        $form.addClass("was-validated");
        if (formValid) {
            const formData = $form.getFormObject();

            formData["COMMENT_TYPE"] = Number(currCommentIndex);
            formData["COMMENT_DATE"] = new Date();
            formData["AGENCY_RESPONSE"] = "";
            formData["PROJECT_NAME"] = config.projectName;
            formData["PUBLIC_VIEW"] = 0;
            formData["VOTES"] = 1;
            formData["COMMENT_"] += " -- Purpose=" + formData["COMMENT2"];
            localStorage.setItem("form-NAME", formData["NAME"]);
            localStorage.setItem("form-PHONE", formData["PHONE"]);
            localStorage.setItem("form-EMAIL", formData["EMAIL"]);

            if (currComment) {
                formData["REGIONWIDE"] = 0;
                currComment.attributes = formData;
                SubmitNewComment(currComment);
            } else {
                formData["REGIONWIDE"] = 1;
                SubmitAreaComment(formData);
            }

            ResetForm();

            $(".successMessage").fadeIn(300, function () {
                var message = this;
                setTimeout(function () {
                    $(message).fadeOut(500);
                }, 3000);
            });
        }
    }

    return { addNewBusiness, enableDrawing };
});
