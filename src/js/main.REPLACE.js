/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Peoria Business Resource Tool
 * @summary     Main JavaScript file
 * @file        main.js
 * ======================================================================== */

require([
        "mag/config",
        "mag/map",
        "mag/widgets",
        "mag/card-functions",
        // "mag/controls"
    ], function(config) {
        "use strict";
        $(document).ready(function() {

            $("#modalForm").load("views/feedback-view.html", function() {

            });

            $("#page_footer").load("views/footer-view.html", function() {

            });





        });

        return;
    }

);
