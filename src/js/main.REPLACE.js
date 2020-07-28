/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Peoria Business Resource Tool
 * @summary     Main JavaScript file
 * @file        main.js
 * ======================================================================== */

require([
    "mag/config",
    "mag/addNewLocation",
    "mag/map",
    "mag/widgets",
    "mag/card-functions",
    // "mag/controls"
], function(config, addNewLocation) {
    "use strict";
    $(document).ready(function() {
        $("#modalForm").load("views/feedback-view.html", function() {
            addNewLocation.setup();
        });

        $("#modalHelp").load("views/modal-help.html", function() {

        });

        //*** terms binding
        $("#modalTerms").load("views/modal-help.html", function() {});
        //*** privacy binding
        $("#modalPrivacy").load("views/modal-privacy.html", function() {});
        //*** legal binding
        $("#modalLegal").load("views/modal-legal.html", function() {});


        $("#page_footer").load("views/footer-view.html", function() {
            //*** version binding
            $(".version").html(config.version);
            //*** copy write binding
            $(".copyright").html(config.copyright);
        });


    });

    return;
});
