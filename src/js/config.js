/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Peoria Business Resource Tool
 * @summary     Config file for project
 * @file        config.js
 * ======================================================================== */

define([], function() {
    "use strict";

    function formatPhoneNumber(phoneNumberString) {
        var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return "(" + match[1] + ") " + match[2] + "-" + match[3];
        }
        return "N/A";
    }

    var popContent = ({ graphic }) => {
        let {
            businessaddress,
            businessphone,
            businesswebsite,
        } = graphic.attributes;
        return `
                <div>
                <span><b>Address: </b>${businessaddress}</span></br>
                <span><b>Phone: </b>${formatPhoneNumber(
                    businessphone
                )}</span></br>
                ${
                    businesswebsite !== "N/A"
                        ? `<span><a target="_blank" href="https://${businesswebsite}" class="card-link"><em class="fa fa-link"></em> Website</a></span>`
                        : ""
                }
                </div>
            `;
    };

    return {
        version: "v1.3.3 | 2020-10-22",
        copyright: "2020",

        peoriaURL: "https://www.peoriaaz.gov/",

        editLayer: "https://geo.azmag.gov/arcgis/rest/services/Hosted/Peoria_Buisness_Locations_TEST/FeatureServer/0",

        pBoundaryLayer: "https://geo.azmag.gov/arcgis/rest/services/maps/RegionalBoundaries/MapServer/3",

        pBusinessLayer: "https://geo.azmag.gov/arcgis/rest/services/Hosted/Peoria_Buisness_Locations_TEST/FeatureServer/0",

        intExtent: {
            xmin: -12532415.067261647,
            ymin: 3954353.6294668326,
            xmax: -12455978.038976442,
            ymax: 4030790.657752038,
            spatialReference: { wkid: 3857 },
        },

        maxExtent: {
            xmin: -12532415.067261647,
            ymin: 3954353.6294668326,
            xmax: -12455978.038976442,
            ymax: 4030790.657752038,
            spatialReference: { wkid: 3857 },
        },

        popTemplate: {
            title: "<span style='display: none;'>{*}</span>{businessname}",
            content: popContent,
            actions: [{
                // This text is displayed as a tooltip
                title: "Edit",
                // The ID by which to reference the action in the event handler
                id: "edit",
                // Sets the icon font used to style the action button
                className: "esri-icon-edit",
            }, ],
        },
    };
});
