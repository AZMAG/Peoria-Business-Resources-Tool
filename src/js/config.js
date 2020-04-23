/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Peoria Business Resource Tool
 * @summary     Config file for project
 * @file        config.js
 * ======================================================================== */

define([], function () {
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
        let { Address, Phone_Number, Website } = graphic.attributes;
        return `
                <div>
                <span><b>Address: </b>${Address}</span></br>
                <span><b>Phone: </b>${formatPhoneNumber(
                    Phone_Number
                )}</span></br>
                ${
                    Website !== "N/A"
                        ? `<span><a target="_blank" href="https://${Website}" class="card-link"><em class="fa fa-link"></em> Website</a></span>`
                        : ""
                }
                </div>
            `;
    };

    return {
        version: "v0.0.2 | 2020-04-14",
        copyright: "2020",

        peoriaURL: "https://www.peoriaaz.gov/",

        editLayer:
            "https://geo.azmag.gov/arcgis/rest/services/Hosted/Peoria_Business_Locations/FeatureServer/0",

        pBoundaryLayer:
            "https://geo.azmag.gov/arcgis/rest/services/maps/RegionalBoundaries/MapServer/3",

        pBusinessLayer:
            "https://geo.azmag.gov/arcgis/rest/services/maps/PeoriaBusinesses/MapServer/0",

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
            title: "<span style='display: none;'>{*}</span>{NAME}",
            content: popContent,
        },
    };
});
