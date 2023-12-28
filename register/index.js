
$("*").ready(
    () => {
        const arrayOfInputFields = Array.from($("input"));
        const passwordInput = $("#password");
        const passwordConfirmation = $("#retyped-password");
        const aggrementWithtermsInput = $("#understands-policies");
        const emailInput = $("#email");
        const formSubmitionBtn = arrayOfInputFields[arrayOfInputFields.length -1];
        const passwordLengthNotifyer = $("#password-length");
        const passwordCharacterNotifyer = $("#password-special-characters");
        const passwordsMatchNotifyer = $("#password-match");
        
        let passwordIsLongEnough = false , passwordsMatch = false , passwordContainsNumbers = false , passwordContainsAlpha = false , passwordContainsSpecialCharacters = false , emailIsEmpty = true;

        arrayOfInputFields.forEach( e => e.addEventListener("input" , validateFormData) );

        const numberValues = /[0-9]/;
        const alphaValues = /[a-z]/i;
        const characterValues = /[!@#$%&()]/;
        
        function validateFormData() {
            passwordInput.val().trim().length >= 8 ? passwordIsLongEnough = true : passwordIsLongEnough = false;

            passwordInput.val().trim() === passwordConfirmation.val().trim() && passwordInput.val().trim() !== "" ? passwordsMatch = true : passwordsMatch = false;
            numberValues.test(passwordInput.val().trim()) ? passwordContainsNumbers = true : passwordContainsNumbers = false;
            alphaValues.test(passwordInput.val().trim()) ? passwordContainsAlpha = true : passwordContainsAlpha = false;

            characterValues.test(passwordInput.val().trim()) ? passwordContainsSpecialCharacters = true : passwordContainsSpecialCharacters = false;
            emailInput.val().trim() === "" ? emailIsEmpty = true : emailIsEmpty = false;

            if(passwordIsLongEnough) {
                passwordLengthNotifyer.css("color","#00aa00");
            } else {
                passwordLengthNotifyer.css("color","#c44500");
            }

            if(passwordContainsNumbers && passwordContainsAlpha && passwordContainsSpecialCharacters) {
                passwordCharacterNotifyer.css("color","#00aa00");
            } else {
                passwordCharacterNotifyer.css("color","#c44500");
            }

            if(passwordsMatch) {
                passwordsMatchNotifyer.css("color","#00aa00");
            } else {
                passwordsMatchNotifyer.css("color","#c44500");
            }
            
            if(!emailIsEmpty && passwordsMatch && passwordContainsNumbers && passwordContainsAlpha && passwordContainsSpecialCharacters && $only("input[type='checkbox']").checked === true ) {
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
                    let response = this.responseText , parsed_response;
                    if(response == "account_exists") {
                        swal("Opps!","An account already exists for this email address", "error");
                    }
                    else {
                        parsed_response = JSON.parse(response);
                        if(localStorage) {
                            localStorage.setItem("credentials",response);
                            if(parsed_response.verified_email === 0) {
                                location.assign("../verify");
                            }
                            else {
                                localStorage.setItem("credentials", response);
                                location.assign("../dashboard");
                            }
                        } else {
                            swal("Session canceled" , "Your browser does not support cookies or it has been disabled. Try enabling all cookies and try again" , "warning");
                        }
                    }
                };
                xhttp.open("POST",user_authentication_server,true);
                xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                xhttp.send(`email_address=${emailInput.val().trim()}&password=${passwordInput.val().trim()}&request_name=registration-form`);
            }
        );
        if(!localStorage) {
            swal("Session canceled" , "Your browser does not support cookies or it has been disabled. Try enabling all cookies and try again" , "warning");
        }
        /* if(localStorage.getItem("credentials")) {
            if(JSON.parse(localStorage.getItem("credentials")).verified_email === 0) {
                location.assign("../verify");
            }
            else {
                location.assign("../dashboard");
            }
        }*/
    }
);