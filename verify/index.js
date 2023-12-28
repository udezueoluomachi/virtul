
$("*").ready(
    () => {
        const arrayOfInputFields = Array.from($("input"));
        const verification_code_input = $("#verification-code-input");
        const formSubmitionBtn = arrayOfInputFields[arrayOfInputFields.length -1];
        const wrongCodeNotifyer = $("#wrong-code");
        const email_address_container = $('.email-address-cont');
        const resend_code_trigger = $(".resend-verification-code-tigger");
        
        let verification_code_input_IsLongEnough = false , verification_code_input_IsEmpty = true;

        arrayOfInputFields.forEach( e => e.addEventListener("input" , validateFormData) );
        
        function validateFormData() {
            verification_code_input.val().trim().length === 5 ? verification_code_input_IsLongEnough = true : verification_code_input_IsLongEnough = false;
            
            verification_code_input.val().trim() === "" ? verification_code_input_IsEmpty = true : verification_code_input_IsEmpty = false;

            if(verification_code_input_IsLongEnough) {
                wrongCodeNotifyer.css("color","#00aa00");
            } else {
                wrongCodeNotifyer.css("color","#c44500");
            }
            
            if(!verification_code_input_IsEmpty && verification_code_input_IsLongEnough ) {
                formSubmitionBtn.disabled = false;
            } else {
                formSubmitionBtn.disabled = true;
            }
        }
        
        let credentials = JSON.parse(localStorage.getItem("credentials"));
        
        function make_request(data , callback) {
            const xhttp = new XMLHttpRequest();
            xhttp.onload = function () { callback(this)};
            xhttp.open("POST",user_authentication_server,true);
            xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhttp.send(data);
        }

        resend_code_trigger.click(() => {
            resend_code_trigger.text("resending...")
            resend_code_trigger.attr("disabled","true");
            make_request(`email_address=${credentials.email_address}&password=${credentials.password}&request_name=resend-verification-code` , (e) => {
                let response =  e.responseText;
                if(response === "resent-code")  {
                    resend_code_trigger.text("resent code");
                    setTimeout(() => {
                        resend_code_trigger.text("resend");
                        resend_code_trigger.attr("disabled","false");
                    } , 10000);
                }
            });
        });
        formSubmitionBtn.addEventListener("click",
            (event) => {
                event.preventDefault();
                $(".loader-box-cont").css("display","flex");
                make_request(`email_address=${credentials.email_address}&password=${credentials.password}&request_name=email-verification-form&verification_code=${verification_code_input.val().trim()}` , (e) => {
                    $(".loader-box-cont").css("display","none");
                    let response = e.responseText , parsed_response = JSON.parse(response);
                    
                    if(localStorage) {
                        localStorage.setItem("credentials",response);
                        if(parsed_response.verified_email !== 1) {
                            wrongCodeNotifyer.css("color","#c44500");
                            formSubmitionBtn.disabled = true;
                        }
                        else {
                            localStorage.setItem("credentials", response);
                            location.assign("../dashboard");
                        }
                    } else {
                        swal("Session canceled" , "Your browser does not support cookies or it has been disabled. Try enabling all cookies and try again" , "warning");
                    }
                });
            }
        );
        if(!localStorage) {
            swal("Session canceled" , "Your browser does not support cookies or it has been disabled. Try enabling all cookies and try again" , "warning");
        }
        if(localStorage.getItem("credentials")) {
            //email_address_container.text(JSON.parse(localStorage.getItem("credentials")).email_address);
            //remember o add a censor to the email address displayed using asteriks
            if(JSON.parse(localStorage.getItem("credentials")).verified_email !== 0) {
                location.assign("../dashboard");
            }
        }
    }
);