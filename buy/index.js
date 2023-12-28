$("*").ready(
    () => {
        const xmlHttp = new XMLHttpRequest();
        const arrayOfInputFields = Array.from($("input"));
        const formSubmitionBtn = arrayOfInputFields[arrayOfInputFields.length -1];
        const omcInput = $("#amount-to-buy-in-omc");
        const usdInput = $("#amount-to-buy-in-usd");
        const maximum = $("#not-enough-balance-notifiyer");
        const transaction_fee_cont = $(".transaction-fee-cont");

        let fiatBalance = 0;
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

        function transact(message , callback) {
            xmlHttp.onload = function() {
                let response = this.responseText;
                callback(response);
            };
            xmlHttp.open("POST", transactions_server_url,true);
            xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlHttp.send(`content=${message}`);
        }
        
        formSubmitionBtn.addEventListener("click" , e => {
            e.preventDefault();
            swal("Type password" , {
                content : {
                    element : "input",
                    attributes : {
                        type : "password",
                        placeholder : "*******"
                    }
                },
                button : "Continue"
            })
            .then(password => {
                $(".loader-box-cont").css("display","flex");
                transact(JSON.stringify({
                    req_name : "purchase-of-omc",
                    usd_amount : usdInput.val().trim(),
                    transaction_fee : ((usdInput.val() * 10) / 100),
                    email_address : credentials.email_address,
                    password : `${password}`.trim()
                }),
                response => {
                    let message = JSON.parse(response);
                    if((message.auth.email_address === credentials.email_address && message.auth.password === credentials.password) || message.auth.email_address === credentials.email_address) {
                        if(message.server_res === true) {
                            swal("Transaction successful","Your purchase of stocks was successful","success");
                        }
                        if(message.server_res === "insufficient-funds") {
                            swal("Insufficient funds","You do not have sufficient funds in your fiat balance for this transaction","warning");
                        }
                        if(message.server_res === "incorrect-credentials") {
                            swal("Incorrect password" , "Try again" , "error");
                        }
                        $(".loader-box-cont").css("display","none");
                    }
                    fetch_user_data();
                });
            });
        });

        const fiat_balance_cont = $(".fiat-balance-in-usd-cont");

        function fetch_user_data() {
            run_price_tracker(() => {
                xmlHttp.onload = () => {
                    let response = xmlHttp.responseText , parsed_response;
                    if(response !== "incorrect-credentials") {
                        parsed_response = JSON.parse(response);
                        //handling data
                        fiatBalance = parsed_response.fiat_balance;
                        fiat_balance_cont.text(parsed_response.fiat_balance.toFixed(2));
                        let maxUsdValue = fiatBalance - ((fiatBalance * 10) / 100);
                        let omcMax = maxUsdValue / omcPrice;
    
                        let omcInputIsEmpty = true , usdInputIsEmpty = true , usdIsNotExceedingUsdMax = true , omcIsNotExceedingomcMax = true , numbersAreValidNumbers = false;
    
                        arrayOfInputFields.forEach( e => e.addEventListener("input" , e => validateFormData(e.target.id)) );
    
                        function validateFormData(inputFieldId) {
                            transaction_fee_cont.text("$ " + ((usdInput.val() * 10) / 100));
                            omcInput.val() != "" ? omcInputIsEmpty = false : omcInputIsEmpty = true;
                            usdInput.val() != "" ? usdInputIsEmpty = false : usdInputIsEmpty = true;
    
                            usdInput.val() >= maxUsdValue ? usdIsNotExceedingUsdMax = false : usdIsNotExceedingUsdMax = true;
                            omcInput.val() >= omcMax ? omcIsNotExceedingomcMax = false : omcIsNotExceedingomcMax = true;
    
                            inputFieldId == "amount-to-buy-in-usd" ? processBasedOnUsdMax() : 1 + 1;
                            inputFieldId == "amount-to-buy-in-omc" ? processBasedOnOmcMax() : 1 + 1;
    
                            !isNaN(Number(omcInput.val())) && !isNaN(usdInput.val()) ? numbersAreValidNumbers = true : numbersAreValidNumbers = false;
                            
                            (numbersAreValidNumbers && !omcInputIsEmpty && !usdInputIsEmpty) ? formSubmitionBtn.disabled = false : formSubmitionBtn.disabled = true;
                            omcInput.val(Math.abs(Number(omcInput.val())));
                            usdInput.val(Math.abs(Number(usdInput.val())));
                        }
                        function processBasedOnUsdMax() {
                            if(!usdIsNotExceedingUsdMax) {
                                usdInput.val(maxUsdValue);
                                omcInput.val(eval(usdInput.val()) / omcPrice);
                                maximum.css("display","list-item");
                            } else {
                                omcInput.val(eval(usdInput.val()) / omcPrice);
                                maximum.css("display","none");
                            }
                        }
                        function processBasedOnOmcMax() {
                            if(!omcIsNotExceedingomcMax) {
                                omcInput.val(omcMax);
                                usdInput.val(eval(omcInput.val()) * omcPrice);
                                maximum.css("display","list-item");
                            } else {
                                usdInput.val(eval(omcInput.val()) * omcPrice);
                                maximum.css("display","none");
                            }
                        }
                        
                    }
                    else {
                        //create pop up menu to warn client about this using sweetalert.js
                    }
                };
                xmlHttp.open("POST" , "https://user-data-api.Virtul.net", true);
                xmlHttp.setRequestHeader("Content-type" , "application/x-www-form-urlencoded");
                xmlHttp.send(`email_address=${credentials.email_address}&password=${credentials.password}&request_name=user-data`)
            });
        }
        fetch_user_data();

    }
);