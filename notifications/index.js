
$(document).ready(() => {
    const notification_cont = $(".user-notification-records div");
    if(!localStorage) {
        swal("Session canceled" , "Your browser does not support cookies or it has been disabled. Try enabling all cookies and try again" , "warning");
    }

    let credentials;
    if(localStorage.getItem("credentials")) {
        credentials = JSON.parse(localStorage.getItem("credentials"));
        if(JSON.parse(localStorage.getItem("credentials")).verified_email === 0) {
            location.assign("../verify");
        }
    }
    else {
        location.assign("../login");
    }

    const xmlHttp = new XMLHttpRequest();

    function fetch_user_data() {
        xmlHttp.onload = () => {
            let response = xmlHttp.responseText , parsed_response , transaction_records_db;
            if(response !== "incorrect-credentials") {
                parsed_response = JSON.parse(response);
                notification_db = JSON.parse(parsed_response.notification_db).reverse();
                //handling data
                notification_cont.html("");
                if(notification_db.length === 0) {
                    notification_cont.html(`<p style="margin:30px auto;">No notifications</p>`);
                }
                else {
                    notification_db.forEach( e => {
                        notification_cont.append(`
                            <div class="record-data-cont">
                                <p class="record-type-notification text-grey-variant-2-color" style="font-weight: bold; opacity: 0.7;">
                                    ${e.title}
                                </p>
                                <div class="flex-box record-data-main-cont text-grey-variant-2-color">
                                    <p>
                                        <span class="record-body">
                                            ${e.body}
                                        </span>
                                    </p>
                                    <p class="record-date">
                                        ${e.date}
                                    </p>
                                </div>
                            </div>
                        `)
                    })
                }
            }
            else {
                //create pop up menu to warn client about this using sweetalert.js
            }
        };
        xmlHttp.open("POST" , user_data_api_server, true);
        xmlHttp.setRequestHeader("Content-type" , "application/x-www-form-urlencoded");
        xmlHttp.send(`email_address=${credentials.email_address}&password=${credentials.password}&request_name=user-data`)
    }
    fetch_user_data();
});