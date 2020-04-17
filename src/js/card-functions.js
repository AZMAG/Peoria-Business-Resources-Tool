/* ========================================================================
 * Maricopa Association of Governments
 * JS document
 * @project     MAG Peoria Business Resource Tool
 * @summary     Card Functions JavaScript file
 * @file        card-functions.js
 * ======================================================================== */

define([
        "mag/config",
        "mag/map",
    ],
    function(config, { map, view }) {

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
                    OBJECTID,
                    Name,
                    Phone_Number,
                    Address,
                    Specials,
                    Website,
                    Opn_for,
                    TakeOut,
                    Delivery,
                    ThirdPartyApp,
                    highlight
                }) => {
                    return `
            <div data-objectid="${OBJECTID}" class="card ${highlight ? 'highlighted' : ''}">
              <div class="card-body">
                <h5 class="card-title">${titleCase(Name)}</h5>
                <h6 class="card-subtitle text-muted mb-2">${Address}</h6>
                ${
                    Phone_Number
                        ? `<p class="card-text"><em class="fa fa-phone"></em> ${formatPhoneNumber(
                              Phone_Number
                          )}</p>`
                        : ""
                }
                 ${
                     Website !== 'N/A'
                         ? `<p class="card-text"><a href="https://${Website}" class="card-link" target="_blank"><em class="fa fa-link"></em> Website</a></p>`
                         : ""
                 }
                <div class="horizontalIconContainer">
                  ${
                      TakeOut
                          ? `<span class="card-text horizontalIcon"><em class="fa fa-car"></em> Take out</span>`
                          : ""
                  }
                  ${
                      Delivery
                          ? `<span class="card-text horizontalIcon"><em class="fa fa-truck"></em> Delivery</span>`
                          : ""
                  }
                  ${
                      ThirdPartyApp
                          ? `<span class="card-text horizontalIcon"><em class="fas fa-tablet-alt"></em> Mobile App</span>`
                          : ""
                  }
                </div>

              </div>
            </div>
          `;
                }
            );
        }



        return {
            getCardsList
        };



    });
