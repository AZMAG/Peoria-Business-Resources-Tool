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
        let {
            businessaddress,
            businessphone,
            businesswebsite,
            cluster_pe,
            subcluster_pe,
        } = graphic.attributes;
        return `
                <div class='popinfo'>
                <span><b>Address: </b>${businessaddress}</span></br>
                <span><b>Phone: </b>${formatPhoneNumber(
                    businessphone
                )}</span></br>
                ${
                    businesswebsite !== "N/A"
                        ? `<span><a target="_blank" href="https://${businesswebsite}" class="card-link"><em class="fa fa-link"></em> Website</a></span>`
                        : ""
                }</br>
                <span class='poptext'><hr>Category: ${cluster_pe}</span></br>
                ${
                    subcluster_pe !== null
                        ? `<span class='poptext'>Subcategory: ${subcluster_pe}</span>`
                        : ""
                }
                </div>
                `;
    };

    return {
        version: "v2.2.0 | 2021-12-13",
        copyright: "2021",

        peoriaURL: "https://www.peoriaaz.gov/",

        editLayer:
            "https://geo.azmag.gov/arcgis/rest/services/Hosted/PeoriaBusinessesUpdate/FeatureServer",

        pBoundaryLayer:
            "https://geo.azmag.gov/arcgis/rest/services/maps/RegionalBoundaries/MapServer/3",

        pBusinessLayer:
            "https://geo.azmag.gov/arcgis/rest/services/Hosted/PeoriaBusinessesUpdate/FeatureServer",

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
            actions: [
                {
                    // This text is displayed as a tooltip
                    title: "Edit",
                    // The ID by which to reference the action in the event handler
                    id: "edit",
                    // Sets the icon font used to style the action button
                    className: "esri-icon-edit",
                },
            ],
        },

        cluster: [
            // { clusterId: 0, text: "All" },
            { clusterId: 1, text: "Business Services" },
            { clusterId: 2, text: "Construction" },
            { clusterId: 3, text: "Consumer Services" },
            { clusterId: 4, text: "Education" },
            { clusterId: 5, text: "Finance, Insurance, & Real Estate (FIRE)" },
            { clusterId: 6, text: "Government, Social, & Advocacy Services" },
            { clusterId: 7, text: "Health Care" },
            { clusterId: 8, text: "Hospitality, Tourism, & Recreation" },
            { clusterId: 9, text: "Manufacturing" },
            { clusterId: 10, text: "Media, Publishing, & Entertainment" },
            { clusterId: 11, text: "Retail" },
            { clusterId: 12, text: "Telecommunications" },
            { clusterId: 13, text: "Transportation & Distribution" },
        ],

        subcluster: [
            { subId: 0, text: "Car Dealerships", clusterId: 13 },
            { subId: 1, text: "Consumer Goods/Grocery Stores", clusterId: 11 },
            { subId: 2, text: "Department Store", clusterId: 11 },
            {
                subId: 3,
                text: "Food Services and Drinking Places",
                clusterId: 3,
            },
            { subId: 4, text: "Fuel", clusterId: 13 },
            {
                subId: 5,
                text: "Motorcycle, ATV, and All Other Motor Vehicle Dealers",
                clusterId: 13,
            },
            { subId: 6, text: "Other", clusterId: 3 },
            { subId: 7, text: "Other", clusterId: 11 },
            { subId: 8, text: "Other", clusterId: 13 },
            { subId: 9, text: "Personal Services", clusterId: 3 },
            { subId: 10, text: "Pet Services & Supplies", clusterId: 11 },
            { subId: 11, text: "Repair & Maintenance", clusterId: 3 },
            { subId: 12, text: "Tire Shop", clusterId: 13 },
            { subId: 13, text: "Vehicle Maintenance/Repair", clusterId: 13 },
        ],
    };
});
