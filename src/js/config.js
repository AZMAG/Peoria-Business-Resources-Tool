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
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return 'N/A';
    }

    var popContent = ({ graphic }) => {
        let { Business_Address, Phone_Number_Redone, Link } = graphic.attributes;
        return `
                <div>
                <span><b>Address: </b>${Business_Address}</span></br>
                <span><b>Phone: </b>${formatPhoneNumber(Phone_Number_Redone)}</span></br>
                ${Link !== 'N/A' ? `<span><a target="_blank" href="https://${Link}" class="card-link"><em class="fa fa-link"></em> Website</a></span>` : '' }
                </div>
            `;
    }

    return {
        version: "v0.0.3 | 2020-04-20",
        copyright: "2020",

        peoriaURL: "https://www.peoriaaz.gov/",

        pBoundaryLayer: "https://geo.azmag.gov/arcgis/rest/services/maps/RegionalBoundaries/MapServer/3",

        pBusinessLayer: "https://geo.azmag.gov/arcgis/rest/services/maps/PeoriaBusinesses/MapServer/0",

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
            title: "<span style='display: none;'>{*}</span>{Restaurant_Name}",
            content: popContent,
        },



    };
});
