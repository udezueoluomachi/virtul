
$("*").ready(
    () => {
        const xmlHttp = new XMLHttpRequest();
        const arrayOfInputFields = Array.from($("input"));
        const formSubmitionBtn = arrayOfInputFields[arrayOfInputFields.length -1];
        const omcInput = $("#amount-to-sell-in-omc");
        const usdInput = $("#amount-to-sell-in-usd");
        const maximum = $("#not-enough-balance-notifiyer");
        const transaction_fee_cont = $(".transaction-fee-cont");

        let stockBalanceInOmc = 0;

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
                    req_name : "sale-of-omc",
                    omc_amount : omcInput.val().trim(),
                    transaction_fee : ((omcInput.val() * 10) / 100),
                    email_address : credentials.email_address,
                    password : `${password}`.trim()
                }) , 
                response => {
                    let message = JSON.parse(response);
                    if((message.auth.email_address === credentials.email_address && message.auth.password === credentials.password) || message.auth.email_address === credentials.email_address) {
                        if(message.server_res === true) {
                            swal("Transaction successful","Your sale of stocks was successful","success");
                        }
                        if(message.server_res === "insufficient-funds") {
                            swal("Insufficient funds","You do not have sufficient funds in your stock balance for this transaction","warning");
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

        const stock_balance_cont = $(".stock-balance-in-usd-cont");
        const stock_balance_in_omc = $(".stock-balance-in-omc-cont");

        function fetch_user_data() {
            run_price_tracker(() => {
                xmlHttp.onload = () => {
                    let response = xmlHttp.responseText , parsed_response;
                    if(response !== "incorrect-credentials") {
                        parsed_response = JSON.parse(response);
                        //handling data
                        stock_balance_in_omc.text(parsed_response.stock_balance);
                        stock_balance_cont.text(parsed_response.stock_balance * omcPrice);
                        stockBalanceInOmc = parsed_response.stock_balance;
                        let stockBalanceInUsd = omcPrice * stockBalanceInOmc;
                        let maxUsdValue = stockBalanceInUsd - ((stockBalanceInUsd * 10) / 100);
                        let omcMax = stockBalanceInOmc - ((stockBalanceInOmc * 10) / 100);
    
                        let omcInputIsEmpty = true , usdInputIsEmpty = true , usdIsNotExceedingUsdMax = true , omcIsNotExceedingomcMax = true , numbersAreValidNumbers = false;
    
                        arrayOfInputFields.forEach( e => e.addEventListener("input" , e => validateFormData(e.target.id)) );
    
                        function validateFormData(inputFieldId) {
                            transaction_fee_cont.text("$ " + ((usdInput.val() * 10) / 100));
                            omcInput.val() != "" ? omcInputIsEmpty = false : omcInputIsEmpty = true;
                            usdInput.val() != "" ? usdInputIsEmpty = false : usdInputIsEmpty = true;
    
                            usdInput.val() >= maxUsdValue ? usdIsNotExceedingUsdMax = false : usdIsNotExceedingUsdMax = true;
                            omcInput.val() >= omcMax ? omcIsNotExceedingomcMax = false : omcIsNotExceedingomcMax = true;
    
                            inputFieldId == "amount-to-sell-in-usd" ? processBasedOnUsdMax() : 1 + 1;
                            inputFieldId == "amount-to-sell-in-omc" ? processBasedOnOmcMax() : 1 + 1;
    
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
                xmlHttp.open("POST" , user_data_api_server, true);
                xmlHttp.setRequestHeader("Content-type" , "application/x-www-form-urlencoded");
                xmlHttp.send(`email_address=${credentials.email_address}&password=${credentials.password}&request_name=user-data`)
            });
        }
        fetch_user_data();

    }
)