
$("*").ready(
    () => {
        const totalOfAllAssetsCont = $(".total-of-all-assets-cont");
        const visibilityToggleBtnForTotalOfAllAssetsCont = $(".visibility-toggle-btn-for-total-of-all-assets-cont");
        let totalOfAllAssets = "32,993.00";
        visibilityToggleBtnForTotalOfAllAssetsCont.click(
            () => {
                $(".visibility-toggle-btn-for-total-of-all-assets-cont .fas").toggleClass("fa-eye-slash");
                $(".visibility-toggle-btn-for-total-of-all-assets-cont .fas").toggleClass("fa-eye");
                totalOfAllAssetsCont.text() === "*** *** ***" ? totalOfAllAssetsCont.text(totalOfAllAssets) : totalOfAllAssetsCont.text("*** *** ***");
            }
        )

        const yarr = [0,0]
        const xarr = ["Stock %", "Fiat %"]
        const colors = ["#e6870b","#2b9952"]
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
            run_price_tracker(()=> {
                xmlHttp.onload = () => {
                    let response = xmlHttp.responseText , parsed_response;
                    if(response !== "incorrect-credentials") {
                        parsed_response = JSON.parse(response);
                        //handling data
                        totalOfAllAssetsCont.text(((parsed_response.stock_balance * omcPrice) + parsed_response.fiat_balance + parsed_response.pending_withdrawal).toFixed(2))
                        totalOfAllAssets = ((parsed_response.stock_balance * omcPrice) + parsed_response.fiat_balance + parsed_response.pending_withdrawal).toFixed(2);
                        yarr[0] = (parsed_response.stock_balance * omcPrice) / totalOfAllAssets * 100;
                        yarr[1] = parsed_response.fiat_balance / totalOfAllAssets * 100;
                        
                        new Chart("pie-chart-representation-of-wallet-constituents-percentege-cont",{
                            type : "pie",
                            data : {
                                labels : xarr,
                                datasets : [{
                                    backgroundColor : colors,
                                    data : yarr
                                }]
                            },
                            options : {
                                title : {
                                    display : true,
                                    text : "Percentage"
                                }
                            }
                        });
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
    }
);