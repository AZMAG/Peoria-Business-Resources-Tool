define([], function() {

    var popContent = `
            <div>
            <span><b>Address: </b>{Address}</span></br>
            <span><b>Phone: </b>{Phone_Number}</span></br>
            <span><b> Website: </b><a target="_blank" href="https://{Website}">Business Link</a></span></br >
            </div>
         `;

    return {
        version: "v0.0.2 | 2020-04-14",
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
            title: "{NAME}",
            content: popContent,
        },



    };
});
