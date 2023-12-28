
$(document).ready(() => {
    const stock_balance_cont = $(".stock-asset-worth-estimate span");
    const fiat_balance_cont = $(".fiat-asset-worth-estimate span");
    const pending_withdrawal_worth_estimate_cont = $(".pending-withdrawal-worth-estimate span");
    const total_asset_worth_estimate_cont = $(".total-asset-worth-estimate span");
    const user_transaction_records_cont = $(".user-records");
    
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
                let response = xmlHttp.responseText , parsed_response , transaction_records_db;
                if(response !== "incorrect-credentials") {
                    parsed_response = JSON.parse(response);
                    transaction_records_db = JSON.parse(parsed_response.transaction_records_db);
                    //handling data
                    //adjust the transaction records for deposits
                    $(".transaction-records-cont").html("")
                    if(transaction_records_db.length === 0) {
                        setTimeout(() => {
                            swal("Start trading!","Make a deposit to your wallet to start trading seamlessly.","info" , {
                                buttons : ["Not now" , "Deposit"]
                            })
                            .then((value) => {
                                if(value) {
                                    location.assign("../deposit");
                                }
                            })
                        }, 3000);
                        $(".user-records").append(`<p style="margin-top: 120px;" class="centered-text no-transaction-notification text-grey-variant-2-color">No transactions yet</p>`)
                    }
                    else {
                        let transactions = transaction_records_db.reverse();
                        if(transaction_records_db.length > 3) {
                            for(let i = 0; i < 3; i++) {
                                if(transactions[i].title === "received" || transactions[i].title === "deposited" || transactions[i].title === "sold") {
                                    $(".transaction-records-cont").append(`
                                    <div class="record-data-cont">
                                        <p class="record-type record-type-received">
                                            ${transactions[i].title}
                                        </p>
                                        <div class="flex-box record-data-main-cont text-grey-variant-2-color">
                                            <p class="mini-size">
                                                $ <span class="record-amount">
                                                    ${transactions[i].amount}
                                                </span>
                                            </p>
                                            <p class="record-date">
                                                ${transactions[i].date}
                                            </p>
                                        </div>
                                    </div>`);
                                }
                                else {
                                    $(".transaction-records-cont").append(`
                                    <div class="record-data-cont">
                                        <p class="record-type record-type-sent">
                                            ${transactions[i].title}
                                        </p>
                                        <div class="flex-box record-data-main-cont text-grey-variant-2-color">
                                            <p class="mini-size">
                                                $ <span class="record-amount">
                                                    ${transactions[i].amount}
                                                </span>
                                            </p>
                                            <p class="record-date">
                                                ${transactions[i].date}
                                            </p>
                                        </div>
                                    </div>`);
                                }
                            }
                        }
                        else {
                            for(let i = 0; i < transactions.length; i++) {
                                if(transactions[i].title === "received" || transactions[i].title === "deposited" || transactions[i].title === "sold") {
                                    $(".transaction-records-cont").append(`
                                    <div class="record-data-cont">
                                        <p class="record-type record-type-received">
                                            ${transactions[i].title}
                                        </p>
                                        <div class="flex-box record-data-main-cont text-grey-variant-2-color">
                                            <p class="mini-size">
                                                $ <span class="record-amount">
                                                    ${transactions[i].amount}
                                                </span>
                                            </p>
                                            <p class="record-date">
                                                ${transactions[i].date}
                                            </p>
                                        </div>
                                    </div>`);
                                }
                                else {
                                    $(".transaction-records-cont").append(`
                                    <div class="record-data-cont">
                                        <p class="record-type record-type-sent">
                                            ${transactions[i].title}
                                        </p>
                                        <div class="flex-box record-data-main-cont text-grey-variant-2-color">
                                            <p class="mini-size">
                                                $ <span class="record-amount">
                                                    ${transactions[i].amount}
                                                </span>
                                            </p>
                                            <p class="record-date">
                                                ${transactions[i].date}
                                            </p>
                                        </div>
                                    </div>`);
                                }
                            }
                        }
                    }
                    
                    stock_balance_cont.text((parsed_response.stock_balance * omcPrice).toFixed(2));
                    fiat_balance_cont.text(parsed_response.fiat_balance.toFixed(2));
                    pending_withdrawal_worth_estimate_cont.text(parsed_response.pending_withdrawal.toFixed(2));
                    total_asset_worth_estimate_cont.text(((parsed_response.stock_balance * omcPrice) + parsed_response.fiat_balance + parsed_response.pending_withdrawal).toFixed(2))
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
});