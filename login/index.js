
$("*").ready(
    () => {
        const arrayOfInputFields = Array.from($("input"));
        const passwordInput = $("#password");
        const emailInput = $("#email");
        const formSubmitionBtn = arrayOfInputFields[arrayOfInputFields.length -1];
        const wrongEmailNotifyer = $("#email-check");
        const wrongPasswordNotifyer = $("#password-check");
        
        let passwordIsLongEnough = false , emailIsEmpty = true , passwordIsWrong = false , emailIsWrong = false;

        arrayOfInputFields.forEach( e => e.addEventListener("input" , validateFormData) );
        arrayOfInputFields.forEach( e => e.addEventListener("blur" , validateFormData) );
        arrayOfInputFields.forEach( e => e.addEventListener("focus" , validateFormData) );
        arrayOfInputFields.forEach( e => e.addEventListener("change" , validateFormData) );
        arrayOfInputFields.forEach( e => e.addEventListener("keyup" , validateFormData) );
        
        function validateFormData() {
            passwordInput.val().trim().length >= 8 ? passwordIsLongEnough = true : passwordIsLongEnough = false;

            emailInput.val().trim() ==="" ? emailIsEmpty = true : emailIsEmpty = false;

            if(!passwordIsWrong) {
                wrongPasswordNotifyer.css("display","none");
            } else {
                wrongPasswordNotifyer.css("display","list-item");
            }

            if(!emailIsWrong) {
                wrongEmailNotifyer.css("display","none");
            } else {
                wrongEmailNotifyer.css("display","list-item");
            }
            
            if(!emailIsEmpty && passwordIsLongEnough) {
                formSubmitionBtn.disabled = false;
            } else {
                formSubmitionBtn.disabled = true;
            }
        }
        formSubmitionBtn.addEventListener("click",
            (event) => {
                event.preventDefault();
                $(".loader-box-cont").css("display","flex");

                //send form data
                const xhttp = new XMLHttpRequest();

                xhttp.onload = function() {
                    $(".loader-box-cont").css("display","none");
                    let response = this.responseText , parsed_response = JSON.parse(response);
                    if(parsed_response.email_address === "wrong") {
                        wrongEmailNotifyer.css("display","list-item")
                    }
                    else {
                        wrongEmailNotifyer.css("display","none");
                    }
                    if(parsed_response.password === "wrong") {
                        wrongPasswordNotifyer.css("display","list-item")
                    }
                    else {
                        wrongPasswordNotifyer.css("display","none");
                    }
                    if( parsed_response.password !== "wrong" && parsed_response.email_address !== "wrong" ) {
                        wrongEmailNotifyer.css("display","none");
                        wrongPasswordNotifyer.css("display","none");
                        if(localStorage) {
                            localStorage.setItem("credentials",response);
                            if(parsed_response.verified_email === 0) {
                                location.assign("../verify");
                            }
                            else {
                                localStorage.setItem("credentials", response);
                                location.assign("../dashboard");
                            }
                        }
                        else {
                            swal("Session canceled" , "Your browser does not support cookies or it has been disabled. Try enabling all cookies and try again" , "warning");
                        }
                    }
                };
                xhttp.open("POST",user_authentication_server,true);
                xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xhttp.send(`email_address=${emailInput.val().trim()}&password=${passwordInput.val().trim()}&request_name=login-form`);
            }
        );
        if(!localStorage) {
            swal("Session canceled" , "Your browser does not support cookies or it has been disabled. Try enabling all cookies and try again" , "warning");
        }
        if(localStorage.getItem("credentials")) {
            if(JSON.parse(localStorage.getItem("credentials")).verified_email === 0) {
                location.assign("../verify");
            }
            else {
                location.assign("../dashboard");
            }
        }
    }
)