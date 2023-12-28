$("*").ready(
    () => {
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
        function send_data(data, callback) {
            const xhttp = new XMLHttpRequest();
            xhttp.onload = function() {
                $(".loader-box-cont").css("display","none");
                let response = this.responseText;
                callback(response);
            };
            xhttp.open("POST",user_authentication_server,true);
            xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhttp.send(`${data}`);
        }
        const account_deletion_trigger = $("#account-deletion-triggger");
        account_deletion_trigger.click(() => {
            swal("You are about to delete your account","You'll loose your account for life if you continue", "info", {
                buttons : ["Cancel","Continue"],
                dangerMode : true
            })
            .then(
                resolvement => {
                    if(resolvement === true) {
                        swal("Type password to continue account deletion" , {
                            content : {
                                element : "input",
                                attributes : {
                                    type : "password",
                                    placeholder : "*******"
                                }
                            },
                            button : "Delete account",
                            dangerMode : true
                        })
                        .then(
                            password => {
                                if(password) {
                                    $(".loader-box-cont").css("display","flex");
                                    send_data(`email_address=${credentials.email_address}&password=${password}&request_name=delete-account`, response => {
                                        if(response == "wrong-password") {
                                            swal("Wrong password", "Could not delete your account", "error");
                                        }
                                        else {
                                            swal("Deleted","Your account was deleted successfully","success");
                                            localStorage.removeItem("credentials");
                                            setTimeout( () => location.assign("../login") , 200);
                                        }
                                    })
                                }
                                else {
                                    swal("You didn't type a password",{icon : "info"});
                                }
                            }
                        )
                    }
                }
            );
        });
        if(!localStorage) {
            swal("Session canceled" , "Your browser does not support cookies or it has been disabled. Try enabling all cookies and try again" , "warning");
        }
        const dark_theme_toggle = $("#dark-theme-toggle");
        if(localStorage.getItem("dark_theme")) {
            dark_theme_toggle.attr("checked",true);
        }
        dark_theme_toggle.on("click",() => {
            if(dark_theme_toggle.is(":checked")) {
                localStorage.setItem("dark_theme","true");
                $(":root").css({
                    "--blue-variant-grad-1": "#9ec1f7",
                    "--Virtul-default-blue" : "#0066ffaa",
                    "--blue-variant-1" :  "#136aecaa",
                    "--blue-variant-2" : "#1962cfaa",
                    "--blue-variant-3" : "#115cccaa",
                    "--blue-variant-4" : "#004ec4aa",
                    "--blue-input-shadow" : "#0066ff15",
                    "--light-grey" : "#212121",
                    "--pure-white" : "#101010",
                    "--pure-white-transparency-4" : "#303030ee",
                    "--grey-variant-1" : "#fffef6",
                    "--grey-variant-2" : " #dfdfdf",
                    "--green" : "#35fb75aa",
                    "--orange" : "#ff9800aa",
                    "--purple-variant" : "#ff00b3",
                    "--brown-variant" : "#ff6600",
                    "--reddish-purple" : "#ff2d73",
                    "--black-variant-1" : "#aaaaaa",
                    "--black-variant-1-alpha-3" : "#9c929246",
                    "--black-variant-1-alpha-4" : "#d1d1d1a2",
                    "--scroll-t" : "#303030",
                    "--scroll-tr" : "#808080",
                    "--input-color" : "var(--black-variant-1)"
                });
                $(".links-to-buy-and-sell , input[type='submit'], a[href='../trade']").css("color","var(--grey-variant-1)")
                $("*").css({
                    "scrollbar-color" : "#303030 #808080",
                    "scroll-behaviour" : "smooth",
                });
            }
            else {
                localStorage.removeItem("dark_theme");
                $(":root").css({
                    "--blue-variant-grad-1": "#9ec1f7",
                    "--Virtul-default-blue" : "#0066ff",
                    "--blue-variant-1" :  "#136aec",
                    "--blue-variant-2" : "#1962cf",
                    "--blue-variant-3" : "#115ccc",
                    "--blue-variant-4" : "#004ec4",
                    "--blue-input-shadow" : "#0066ff15",
                    "--light-grey" : "#f1f1f1",
                    "--pure-white" : "#ffffff",
                    "--pure-white-transparency-4" : "#ffffffee",
                    "--grey-variant-1" : "#c5c4bb",
                    "--grey-variant-2" : "#504f4f",
                    "--green" : "#20b144",
                    "--orange" : "#ff9100",
                    "--purple-variant" : "#f75dc8",
                    "--brown-variant" : "#ff6600",
                    "--reddish-purple" : "#e00b52",
                    "--black-variant-1" : "#101010",
                    "--black-variant-1-alpha-3" : "#00000046",
                    "--black-variant-1-alpha-4" : "#2e2d2da2",
                    "--scroll-t" : "var(--black-variant-1-alpha-3)",
                    "--scroll-tr" : "var(--grey-variant-1)",
                    "--input-color" : "var(--grey-variant-2)"
                });
                $(".links-to-buy-and-sell , input[type='submit'], a[href='../trade']").css("color","var(--pure-white)");
            }
        });
    }
);