
$(document).ready(() => {
    const stock_balance_cont = $(".stock-balance-in-usd-cont");
    const stock_balance_in_omc = $(".stock-balance-in-omc-cont");
    
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
        run_price_tracker(() => {
            xmlHttp.onload = () => {
                let response = xmlHttp.responseText , parsed_response;
                if(response !== "incorrect-credentials") {
                    parsed_response = JSON.parse(response);
                    //handling data
                    stock_balance_in_omc.text(parsed_response.stock_balance);
                    stock_balance_cont.text(parsed_response.stock_balance * omcPrice)
                    //remember to adjust the price in accordance with the stocks
                }
                else {
                    //create pop up menu to warn client about this using sweetalert.js
                }
            };
            xmlHttp.open("POST" , user_data_api_server, true);
            xmlHttp.setRequestHeader("Content-type" , "application/x-www-form-urlencoded");
            xmlHttp.send(`email_address=${credentials.email_address}&password=${credentials.password}&request_name=user-data`)
        });
    }
    fetch_user_data();
})