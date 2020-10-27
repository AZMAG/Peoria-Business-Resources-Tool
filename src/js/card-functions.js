/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Peoria Business Resource Tool
 * @summary     Card Functions JavaScript file
 * @file        card-functions.js
 * ======================================================================== */

define(["mag/config", "mag/map"], function(config, { map, view }) {
    function titleCase(str) {
        str = str.toLowerCase().split(" ");
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(" ");
    }

    function formatPhoneNumber(phoneNumberString) {
        var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return "(" + match[1] + ") " + match[2] + "-" + match[3];
        }
        return "N/A";
    }

    function getCardsList(data) {
        return data.map(
            ({
                TableID,
                BusinessName,
                BusinessPhone,
                BusinessAddress,
                Category,
                Specials,
                BusinessWebsite,
                Status,
                TakeOutCbox,
                DeliveryCbox,
                MobileAppCbox,
                Highlight,
                Logo,
            }) => {
                return `
            <div data-objectid="${TableID}" class="card ${
                    Highlight ? "highlighted" : ""
                }">
              <div class="card-body">
                <div class="card-top">
                    <h5 class="card-title">${BusinessName}</h5>
                    <h6 class="catType">${Category}</h6>
                </div>
                <div class="card-info">
                    <div class="col col-sm-9">
                        <h6 class="card-subtitle text-muted mb-2">${BusinessAddress}</h6>
                        ${
                            BusinessPhone
                                ? `<p class="card-text"><em class="fa fa-phone"></em> ${formatPhoneNumber(
                                      BusinessPhone
                                  )}</p>`
                                : ""
                        }
                        ${
                            BusinessWebsite !== "N/A"
                                ? `<p class="card-text"><a href="https://${BusinessWebsite}" class="card-link" target="_blank"><em class="fa fa-link"></em> Website</a></p>`
                                : ""
                        }
                        ${
                            Specials !== null
                                ? `<p class="card-text sp"><b>Specials:</b> ${Specials}</p>`
                                : ""
                        }
                    </div>
                    <div class="col col-sm-3 text-center">
                        ${
                            Logo !== null
                                ? `<img class="logo-img" src="images/logos/${Logo}.png" alt="biz logo">`
                                : ""
                        }
                    </div>
                 </div>
                <div class="horizontalIconContainer">
                  ${
                      TakeOutCbox
                          ? `<span class="card-text horizontalIcon"><em class="fa fa-car"></em> Take out</span>`
                          : ""
                  }
                  ${
                      DeliveryCbox
                          ? `<span class="card-text horizontalIcon"><em class="fa fa-truck"></em> Delivery</span>`
                          : ""
                  }
                  ${
                      MobileAppCbox
                          ? `<span class="card-text horizontalIcon"><em class="fas fa-tablet-alt"></em> Mobile App</span>`
                          : ""
                  }
                  <button data-objectid="${TableID}" title="Edit this Business" class="btn btn-sm btn-primary pull-right editBtn"><i class="fas fa-edit"></i></button>
                </div>
              </div>
            </div>
          `;
            }
        );
    }

    return {
        getCardsList,
    };
});
