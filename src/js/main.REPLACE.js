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

        $("#page_footer").load("views/footer-view.html", function() {});
    });

    return;
});
