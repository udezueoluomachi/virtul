const date = new Date();
let currentYear = date.getFullYear();
const $only = e => document.querySelector(e);
const $all = e => document.querySelectorAll(e);
let omcPrice = 0;
function track_price(message, callback) {
    const price_tracker = new XMLHttpRequest();
    price_tracker.onload = function() {
        let response = this.responseText;
        callback(response);
    };
    price_tracker.open("POST", price_api_url, true);
    price_tracker.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    price_tracker.send(`content=${message}`);
}
function run_price_tracker(callback) {
    //omc_price
    track_price(JSON.stringify({req_name : "omc-value"}) , response => {
        let message = JSON.parse(response);
        if(message.name === "omc-value") {
            omcPrice = message.omcPrice;
            if($only(".current-price-of-omc-cont")) $only(".current-price-of-omc-cont").innerText = omcPrice;
            if(callback) callback();
        }
        //price chart
        track_price(JSON.stringify({req_name : "omc-analysis-chart"}) , response => {
            let message = JSON.parse(response);
            if(message.name === "omc-analysis-chart") {
                let xArray = message.chart_axises.xAxis;
                let yArray = message.chart_axises.yAxis;
                if($only("#canvas-statistics-cont")) {
                    new Chart("canvas-statistics-cont", {
                        type : "line",
                        data : {
                            labels : xArray,
                            datasets : [{
                                backgroundColor : "#0022ff11",
                                borderColor : "#0022ffaa",
                                data : yArray,
                                label : "Price vs Day"
                            }]
                        },
                        options : {}
                    });
                }
            }
        });
    });
}
run_price_tracker(null);
setInterval(() => run_price_tracker(null), 50000);

$("*").ready(
    () => {
        if(localStorage.getItem("dark_theme")) {
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
        
        const sideMenuVisibilityToggleBtn = $(".menu-or-menu-btn-toggle");
        const sideMenu = $(".side-menu");

        let menuIsDisplayed = false;
        sideMenuVisibilityToggleBtn.click(
            () => {
                if(menuIsDisplayed) {
                    sideMenu.css("left","100vw");
                    menuIsDisplayed = false;
                } else {
                    sideMenu.css("left","0");
                    menuIsDisplayed = true;
                }
            }
        )
        //params text,type,element
        const logout_btn = $(".logout-btn");

        logout_btn.click(() => {
            swal("Are you sure you want to logout ?", {
                icon : "warning",
                buttons : ["Cancel" , "Logout"],
                dangerMode : true
            })
            .then((value) => {
                if(value) {
                    localStorage.removeItem("credentials");
                    location.assign("../login");
                }
            })
        })
        
        $(".modal-toggle-btn").click(() => {
            $(".modal-box-cont").css("display","none");
        })
        
        $(".logout-btn").click(() => {
            $(".logout-confirmatory").css("display","flex");
            $(".logout-confirmatory").addClass(["animate__animated","animate__fadeIn"])
        });

        const loaderBalls = Array.from($(".loader-ball"));
        
        $("*").ready(
            () => {
                setTimeout(
                    () => $(".loader-box-cont").css("display","none") , 700
                );
            }
        )

        const randomLoaderBallIndex = () => Math.floor(Math.random() * loaderBalls.length);
        const randomPercentage = () => Math.floor(Math.random() * 100 + 1);

        loaderBalls.forEach(
            e => {
                e.style.height = randomPercentage() + "%";
            }
        )
        
        $(".loader-box-cont").css("display") == "flex" ? function () {
            window.setInterval(
                () => {
                    loaderBalls[randomLoaderBallIndex()].style.height = randomPercentage() + "%";
                }, 10
            );
        }() : null ;/*
        $("body").on("load",
            () => $("body").addClass(["animate__animated" , "animate__slideInRight"])
        )*/
        document.body.onbeforeunload = () => {
            $(".loader-box-cont").css("display","flex");
        }
        if($("input[type='submit']")) {
            $("input[type='submit']").click(
                event => {
                    event.preventDefault();
                }
            )
        }
    }
);