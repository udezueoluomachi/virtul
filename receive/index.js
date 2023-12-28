
$(document).ready(() => {
    const wallet_address_cont = $(".wallet-address-cont");
    const wallet_address_copy_trigger = $(".copy-wallet-address")

    wallet_address_copy_trigger.click( () => {
        navigator.clipboard.writeText(wallet_address_cont.text());
        swal("Copied to clipboard","","success")
    } )//use sweetalertjs to notify that user has copied it
    .css({"cursor":"pointer"})
    .attr("title","click to copy wallet address");

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
            let response = xmlHttp.responseText , parsed_response;
            if(response !== "incorrect-credentials") {
                parsed_response = JSON.parse(response);
                //handling data
                wallet_address_cont.text(parsed_response.wallet_address);
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
})