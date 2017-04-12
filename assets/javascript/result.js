var config1 = {
    apiKey: "AIzaSyAnIDNBZUFPnCWqUZSpLLjp1GF4umID3Zw",
    authDomain: "aardvark-college-debt.firebaseapp.com",
    databaseURL: "https://aardvark-college-debt.firebaseio.com",
    projectId: "aardvark-college-debt",
    storageBucket: "aardvark-college-debt.appspot.com",
    messagingSenderId: "582943288825"
};
firebase.initializeApp(config1);

var database1 = firebase.database();
var staticIncome = [1, 5, 10, 25];
var averageIncome = [5, 10, 25];
var college = localStorage.getItem("college").split(" ");
college = college.join("%20");

$('#yourCollege').html(localStorage.getItem("college"));
$('#yourMajor').html(localStorage.getItem("major"));

$.ajax({
    url: "https://aardvark-college-debt.firebaseio.com/income-by-major/" + localStorage.getItem("major") + "/static-median-income/year1.json",
    method: "GET"
}).done(function(response) {
    var initialIncome = response;
    var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';
    $.getJSON(apiUrl, {
        country: 'united-states',
        start: "2017/1/1",
        end: (2017 + 1) + "/1/1",
        amount: response,
        format: true
    }).done(function(data) {
        $('#yourIncome').html(data.replace(" ", ""));
    });
});


$.ajax({
    url: "https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=laoOF5Sp6MOWzUvnPi53y2EYv2PNL4ju9HCla52z&school.name=" + localStorage.getItem("college") + "&_fields=school.school_url",
    method: "GET"
}).done(function(response) {

    var url = response.results[0]["school.school_url"];
    var logo = $("<img>").attr("id", "logo");
    logo.attr('src', 'https://logo.clearbit.com/' + url);
    logo.css('margin', '30px');
    $("#logoGoesHere").html(logo);
});

$.ajax({
    url: "https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=laoOF5Sp6MOWzUvnPi53y2EYv2PNL4ju9HCla52z&school.name=" + college + "&_fields=2013.cost.tuition.in_state,2013.cost.tuition.out_of_state,school.school_url",
    method: "GET"
}).done(function(response) {

    if (localStorage.getItem("location") == "out") {
        var cost = response.results[0]["2013.cost.tuition.out_of_state"];
    } else {
        var cost = response.results[0]["2013.cost.tuition.in_state"];
    }
    cost = Number(cost);
    cost = ((cost * localStorage.getItem("yearsAttend")) - (localStorage.getItem("persContrib") * 4) - (localStorage.getItem("scholContrib") * 4));
    $('#yourDebt').html("$" + cost);
});

function compare(money, cost) {
    if (money < cost) {
        $("#errorResults").html("Your starting monthly income is less than your monthly loan payment. Please select another repayment plan or click New Profile to try something else.");
        setTimeout(function() {
            $('.all').html("");
        }, 300);
    }
}

//5 Year Button Click
$("#5").click(function() {
    $("#errorResults").text("");
    window.scrollTo(0, 1000);

    var staticMonthly = 0;

    $.ajax({
        url: "https://aardvark-college-debt.firebaseio.com/income-by-major/" + localStorage.getItem("major") + "/static-median-income/year1.json",
        method: "GET"
    }).done(function(response) {
        var initialIncome = response;
        var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';
        $.getJSON(apiUrl, {
            country: 'united-states',
            start: "2017/1/1",
            end: (2017 + 1) + "/1/1",
            amount: response,
            format: true
        }).done(function(data) {
            data = data.split(" ").join("").split("$").join("");
            data = Number(data);
            staticMonthly = (data / 12);
            staticMonthly = staticMonthly.toFixed(2);
            $('#monthly0').html("<h4>Monthly Income: $" + staticMonthly + "</h4>");
        });
    });

    function callForAllSI(i) {
        var majorQueryURL_stat = "https://aardvark-college-debt.firebaseio.com/income-by-major/" + currentMajor + "/static-median-income/year" + staticIncome[i] + ".json";
        $.ajax({
            url: majorQueryURL_stat,
            method: "GET"
        }).done(function(response) {
            var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';


            $.getJSON(apiUrl, {
                country: 'united-states',
                start: "2017/1/1",
                end: (2017 + staticIncome[i]) + "/1/1",
                amount: response,
                format: true
            }).done(function(data) {
                var money = data;
                var text = $('<h4>').html('Median Income for Year ' + staticIncome[i] + ': <br>' + money.replace(" ", ""));
                $('#mi' + i).html(text);
            });
        });
    }


    var currentMajor = localStorage.getItem("major");

    function callForSI(i) {
        var majorQueryURL_stat = "https://aardvark-college-debt.firebaseio.com/income-by-major/" + currentMajor + "/static-median-income/year" + staticIncome[i] + ".json";
        $.ajax({
            url: majorQueryURL_stat,
            method: "GET"
        }).done(function(response) {
            var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';


            $.getJSON(apiUrl, {
                    country: 'united-states',
                    start: "2017/1/1",
                    end: (2017 + staticIncome[i]) + "/1/1",
                    amount: response,
                    format: true
                })
                .done(function(data) {
                    var money = data;
                    var text = $('<h4>').html('Median Income for Year ' + staticIncome[i] + ': <br>' + money.replace(" ", ""));
                    $('#mi' + i).html(text);


                    $.ajax({
                        url: "https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=laoOF5Sp6MOWzUvnPi53y2EYv2PNL4ju9HCla52z&school.name=" + college + "&_fields=2013.cost.tuition.in_state,2013.cost.tuition.out_of_state,school.school_url",
                        method: "GET"
                    }).done(function(response) {

                        if (localStorage.getItem("location") == "out") {
                            var cost = response.results[0]["2013.cost.tuition.out_of_state"];
                        } else {
                            var cost = response.results[0]["2013.cost.tuition.in_state"];
                        }
                        money = money.split(" ");
                        money = money.join("");
                        money = money.split("$");
                        money = money.join("");
                        money = money / 12;
                        interest = localStorage.getItem("interest");
                        yearsRepay = 5;
                        cost = Number(cost);
                        interest = Number(interest);
                        yearsRepay = Number(yearsRepay);
                        cost = ((cost * localStorage.getItem("yearsAttend")) - (localStorage.getItem("persContrib") * 4) - (localStorage.getItem("scholContrib") * 4));
                        console.log((interest / 12) * cost);
                        console.log(Math.pow(1 + (interest / 12), -yearsRepay * 12));
                        cost = ((interest / 12) * cost) / (1 - Math.pow(1 + (interest / 12), -yearsRepay * 12));
                        //money = money.toFixed(0);
                        money = Number(money);
                        cost = Number(cost);
                        money = money.toFixed(2);
                        cost = cost.toFixed(2);
                        money = Number(money);
                        cost = Number(cost);
                        compare(money, cost);
                        if ($("#errorResults").text() !== "") {
                            return;
                        }
                        $("#payment").html("<h3>$" + cost + "</h3>");
                        var myData = new Array(['', cost], ['', money - cost]);
                        var colors = ['#F7FF58', '#FF934F'];
                        var myChart = new JSChart('un', 'pie');
                        myChart.setDataArray(myData);
                        myChart.colorizePie(colors);
                        myChart.setTitleColor('#000000');
                        myChart.setPieUnitsColor('#000000');
                        myChart.setPieValuesColor('#343434');
                        myChart.setSize(250, 250);
                        //myChart.setBackgroundImage("money.jpg");
                        //myChart.set3D(true);
                        myChart.setPieRadius(100);
                        myChart.setPieValuesPrefix("$");
                        myChart.setPieValuesFontSize(12);
                        myChart.setPieValuesOffset(-50);
                        myChart.setTitle("");
                        myChart.draw();
                    });

                });
        });
    }

    function callForAI(i) {
        var majorQueryURL_stat = "https://aardvark-college-debt.firebaseio.com/income-by-major/" + currentMajor + "/average-income/year" + averageIncome[i] + ".json";
        $.ajax({
            url: majorQueryURL_stat,
            method: "GET"
        }).done(function(response) {
            var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';


            $.getJSON(apiUrl, {
                    country: 'united-states',
                    start: "2017/1/1",
                    end: (2017 + averageIncome[i]) + "/1/1",
                    amount: response,
                    format: true
                })
                .done(function(data) {
                    var money = data;

                    var text = $('<h4>').html('Avg. Yearly Income over ' + averageIncome[i] + ' Years: <br>' + money.replace(" ", ""));
                    $('#ni' + i).html(text);
                    $.ajax({
                        url: "https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=laoOF5Sp6MOWzUvnPi53y2EYv2PNL4ju9HCla52z&school.name=" + college + "&_fields=2013.cost.tuition.in_state,2013.cost.tuition.out_of_state,school.school_url",
                        method: "GET"
                    }).done(function(response) {

                        if (localStorage.getItem("location") == "out") {
                            var cost = response.results[0]["2013.cost.tuition.out_of_state"];
                        } else {
                            var cost = response.results[0]["2013.cost.tuition.in_state"];
                        }
                        money = money.split(" ");
                        money = money.join("");
                        money = money.split("$");
                        money = money.join("");
                        money = money / 12;
                        interest = localStorage.getItem("interest");
                        yearsRepay = 5;
                        cost = Number(cost);
                        interest = Number(interest);
                        yearsRepay = Number(yearsRepay);
                        cost = ((cost * localStorage.getItem("yearsAttend")) - (localStorage.getItem("persContrib") * 4) - (localStorage.getItem("scholContrib") * 4));
                        console.log((interest / 12) * cost);
                        console.log(Math.pow(1 + (interest / 12), -yearsRepay * 12));
                        cost = ((interest / 12) * cost) / (1 - Math.pow(1 + (interest / 12), -yearsRepay * 12));

                        //money = money.toFixed(0);
                        money = Number(money);
                        cost = Number(cost);
                        money = money.toFixed(2);
                        cost = cost.toFixed(2);
                        money = Number(money);
                        cost = Number(cost);
                        if (money < cost) {
                            return;
                        }
                        var myData = new Array(['', cost], ['', money - cost]);
                        var colors = ['#F7FF58', '#FF934F'];
                        var myChart = new JSChart('deux' + i, 'pie');
                        myChart.setDataArray(myData);
                        myChart.colorizePie(colors);
                        myChart.setTitleColor('#000000');
                        myChart.setPieUnitsColor('#000000');
                        myChart.setPieValuesColor('#343434');
                        myChart.setSize(250, 250);
                        //myChart.setBackgroundImage("money.jpg");
                        //myChart.set3D(true);
                        myChart.setPieRadius(100);
                        myChart.setPieValuesPrefix("$");
                        myChart.setPieValuesFontSize(12);
                        myChart.setPieValuesOffset(-50);
                        myChart.setTitle("");
                        myChart.draw();

                        //average monthly income
                        $('#monthly' + (i + 1)).html("<h4>Average Monthly Income: $" + money + "</h4>");
                    });
                });
        });
    }

    callForSI(0);

    for (var i = 0; i < staticIncome.length; i++) {
        callForAllSI(i);
    }

    for (var i = 0; i < 1; i++) {
        callForAI(i);
    }

    $('#monthly2').html("<h3>Years 6-10 will be school loan debt free!");
    $('#monthly3').html("<h3>Years 11-25 will be school loan debt free!");
    $('.forFive').html("");

});

//Ten Year Button Click
$("#10").click(function() {
    $("#errorResults").text("");
    window.scrollTo(0, 1000);

    var staticMonthly = 0;

    $.ajax({
        url: "https://aardvark-college-debt.firebaseio.com/income-by-major/" + localStorage.getItem("major") + "/static-median-income/year1.json",
        method: "GET"
    }).done(function(response) {
        var initialIncome = response;
        var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';
        $.getJSON(apiUrl, {
            country: 'united-states',
            start: "2017/1/1",
            end: (2017 + 1) + "/1/1",
            amount: response,
            format: true
        }).done(function(data) {
            data = data.split(" ").join("").split("$").join("");
            data = Number(data);
            staticMonthly = (data / 12);
            staticMonthly = staticMonthly.toFixed(2);
            $('#monthly0').html("<h4>Monthly Income: $" + staticMonthly + "</h4>");
        });
    });

    function callForAllSI(i) {
        var majorQueryURL_stat = "https://aardvark-college-debt.firebaseio.com/income-by-major/" + currentMajor + "/static-median-income/year" + staticIncome[i] + ".json";
        $.ajax({
            url: majorQueryURL_stat,
            method: "GET"
        }).done(function(response) {
            var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';


            $.getJSON(apiUrl, {
                country: 'united-states',
                start: "2017/1/1",
                end: (2017 + staticIncome[i]) + "/1/1",
                amount: response,
                format: true
            }).done(function(data) {
                var money = data;
                var text = $('<h4>').html('Median Income for Year ' + staticIncome[i] + ': <br>' + money.replace(" ", ""));
                $('#mi' + i).html(text);
            });
        });
    }

    var currentMajor = localStorage.getItem("major");

    function callForSI(i) {
        var majorQueryURL_stat = "https://aardvark-college-debt.firebaseio.com/income-by-major/" + currentMajor + "/static-median-income/year" + staticIncome[i] + ".json";
        $.ajax({
            url: majorQueryURL_stat,
            method: "GET"
        }).done(function(response) {
            var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';


            $.getJSON(apiUrl, {
                    country: 'united-states',
                    start: "2017/1/1",
                    end: (2017 + staticIncome[i]) + "/1/1",
                    amount: response,
                    format: true
                })
                .done(function(data) {
                    var money = data;
                    var text = $('<h4>').html('Median Income for Year ' + staticIncome[i] + ': <br>' + money.replace(" ", ""));
                    $('#mi' + i).html(text);


                    $.ajax({
                        url: "https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=laoOF5Sp6MOWzUvnPi53y2EYv2PNL4ju9HCla52z&school.name=" + college + "&_fields=2013.cost.tuition.in_state,2013.cost.tuition.out_of_state,school.school_url",
                        method: "GET"
                    }).done(function(response) {

                        if (localStorage.getItem("location") == "out") {
                            var cost = response.results[0]["2013.cost.tuition.out_of_state"];
                        } else {
                            var cost = response.results[0]["2013.cost.tuition.in_state"];
                        }
                        money = money.split(" ");
                        money = money.join("");
                        money = money.split("$");
                        money = money.join("");
                        money = money / 12;
                        interest = localStorage.getItem("interest");
                        yearsRepay = 10;
                        cost = Number(cost);
                        interest = Number(interest);
                        yearsRepay = Number(yearsRepay);
                        cost = ((cost * localStorage.getItem("yearsAttend")) - (localStorage.getItem("persContrib") * 4) - (localStorage.getItem("scholContrib") * 4));
                        console.log((interest / 12) * cost);
                        console.log(Math.pow(1 + (interest / 12), -yearsRepay * 12));
                        cost = ((interest / 12) * cost) / (1 - Math.pow(1 + (interest / 12), -yearsRepay * 12));
                        //money = money.toFixed(0);
                        money = Number(money);
                        cost = Number(cost);
                        money = money.toFixed(2);
                        cost = cost.toFixed(2);
                        money = Number(money);
                        cost = Number(cost);
                        compare(money, cost);
                        if ($("#errorResults").text() !== "") {
                            return;
                        }
                        $("#payment").html("<h3>$" + cost + "</h3>");
                        var myData = new Array(['', cost], ['', money - cost]);
                        var colors = ['#F7FF58', '#FF934F'];
                        var myChart = new JSChart('un', 'pie');
                        myChart.setDataArray(myData);
                        myChart.colorizePie(colors);
                        myChart.setTitleColor('#000000');
                        myChart.setPieUnitsColor('#000000');
                        myChart.setPieValuesColor('#343434');
                        myChart.setSize(250, 250);
                        //myChart.setBackgroundImage("money.jpg");
                        //myChart.set3D(true);
                        myChart.setPieRadius(100);
                        myChart.setPieValuesPrefix("$");
                        myChart.setPieValuesFontSize(12);
                        myChart.setPieValuesOffset(-50);
                        myChart.setTitle("");
                        myChart.draw();
                    });

                });
        });
    }

    function callForAI(i) {
        var majorQueryURL_stat = "https://aardvark-college-debt.firebaseio.com/income-by-major/" + currentMajor + "/average-income/year" + averageIncome[i] + ".json";
        $.ajax({
            url: majorQueryURL_stat,
            method: "GET"
        }).done(function(response) {
            var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';


            $.getJSON(apiUrl, {
                    country: 'united-states',
                    start: "2017/1/1",
                    end: (2017 + averageIncome[i]) + "/1/1",
                    amount: response,
                    format: true
                })
                .done(function(data) {
                    var money = data;

                    var text = $('<h4>').html('Avg. Yearly Income over ' + averageIncome[i] + ' Years: <br>' + money.replace(" ", ""));
                    $('#ni' + i).html(text);
                    $.ajax({
                        url: "https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=laoOF5Sp6MOWzUvnPi53y2EYv2PNL4ju9HCla52z&school.name=" + college + "&_fields=2013.cost.tuition.in_state,2013.cost.tuition.out_of_state,school.school_url",
                        method: "GET"
                    }).done(function(response) {

                        if (localStorage.getItem("location") == "out") {
                            var cost = response.results[0]["2013.cost.tuition.out_of_state"];
                        } else {
                            var cost = response.results[0]["2013.cost.tuition.in_state"];
                        }
                        money = money.split(" ");
                        money = money.join("");
                        money = money.split("$");
                        money = money.join("");
                        money = money / 12;
                        interest = localStorage.getItem("interest");
                        yearsRepay = 10;
                        cost = Number(cost);
                        interest = Number(interest);
                        yearsRepay = Number(yearsRepay);
                        cost = ((cost * localStorage.getItem("yearsAttend")) - (localStorage.getItem("persContrib") * 4) - (localStorage.getItem("scholContrib") * 4));
                        console.log((interest / 12) * cost);
                        console.log(Math.pow(1 + (interest / 12), -yearsRepay * 12));
                        cost = ((interest / 12) * cost) / (1 - Math.pow(1 + (interest / 12), -yearsRepay * 12));

                        //money = money.toFixed(0);
                        money = Number(money);
                        cost = Number(cost);
                        money = money.toFixed(2);
                        cost = cost.toFixed(2);
                        money = Number(money);
                        cost = Number(cost);
                        if (money < cost) {
                            return;
                        }
                        var myData = new Array(['', cost], ['', money - cost]);
                        var colors = ['#F7FF58', '#FF934F'];
                        var myChart = new JSChart('deux' + i, 'pie');
                        myChart.setDataArray(myData);
                        myChart.colorizePie(colors);
                        myChart.setTitleColor('#000000');
                        myChart.setPieUnitsColor('#000000');
                        myChart.setPieValuesColor('#343434');
                        myChart.setSize(250, 250);
                        //myChart.setBackgroundImage("money.jpg");
                        //myChart.set3D(true);
                        myChart.setPieRadius(100);
                        myChart.setPieValuesPrefix("$");
                        myChart.setPieValuesFontSize(12);
                        myChart.setPieValuesOffset(-50);
                        myChart.setTitle("");
                        myChart.draw();

                        //average monthly income
                        $('#monthly' + (i + 1)).html("<h4>Average Monthly Income: $" + money + "</h4>");
                    });
                });
        });
    }

    callForSI(0);

    for (var i = 0; i < staticIncome.length; i++) {
        callForAllSI(i);
    }
    for (var i = 0; i < 2; i++) {
        callForAI(i);
    }

    $('#monthly3').html("<h3>Years 11-25 will be school loan debt free!");
    $('.forTen').html("");
});

//25 Year Button Click
$("#25").click(function() {
    $("#errorResults").text("");
    window.scrollTo(0, 1000);
    var staticMonthly = 0;

    $.ajax({
        url: "https://aardvark-college-debt.firebaseio.com/income-by-major/" + localStorage.getItem("major") + "/static-median-income/year1.json",
        method: "GET"
    }).done(function(response) {
        var initialIncome = response;
        var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';
        $.getJSON(apiUrl, {
            country: 'united-states',
            start: "2017/1/1",
            end: (2017 + 1) + "/1/1",
            amount: response,
            format: true
        }).done(function(data) {
            data = data.split(" ").join("").split("$").join("");
            data = Number(data);
            staticMonthly = (data / 12);
            staticMonthly = staticMonthly.toFixed(2);
            $('#monthly0').html("<h4>Monthly Income: $" + staticMonthly + "</h4>");
        });
    });

    function callForAllSI(i) {
        var majorQueryURL_stat = "https://aardvark-college-debt.firebaseio.com/income-by-major/" + currentMajor + "/static-median-income/year" + staticIncome[i] + ".json";
        $.ajax({
            url: majorQueryURL_stat,
            method: "GET"
        }).done(function(response) {
            var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';


            $.getJSON(apiUrl, {
                country: 'united-states',
                start: "2017/1/1",
                end: (2017 + staticIncome[i]) + "/1/1",
                amount: response,
                format: true
            }).done(function(data) {
                var money = data;
                var text = $('<h4>').html('Median Income for Year ' + staticIncome[i] + ': <br>' + money.replace(" ", ""));
                $('#mi' + i).html(text);
            });
        });
    }

    var currentMajor = localStorage.getItem("major");

    function callForSI(i) {
        var majorQueryURL_stat = "https://aardvark-college-debt.firebaseio.com/income-by-major/" + currentMajor + "/static-median-income/year" + staticIncome[i] + ".json";
        $.ajax({
            url: majorQueryURL_stat,
            method: "GET"
        }).done(function(response) {
            var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';


            $.getJSON(apiUrl, {
                    country: 'united-states',
                    start: "2017/1/1",
                    end: (2017 + staticIncome[i]) + "/1/1",
                    amount: response,
                    format: true
                })
                .done(function(data) {
                    var money = data;
                    var text = $('<h4>').html('Median Income for Year ' + staticIncome[i] + ': <br>' + money.replace(" ", ""));
                    $('#mi' + i).html(text);


                    $.ajax({
                        url: "https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=laoOF5Sp6MOWzUvnPi53y2EYv2PNL4ju9HCla52z&school.name=" + college + "&_fields=2013.cost.tuition.in_state,2013.cost.tuition.out_of_state,school.school_url",
                        method: "GET"
                    }).done(function(response) {

                        if (localStorage.getItem("location") == "out") {
                            var cost = response.results[0]["2013.cost.tuition.out_of_state"];
                        } else {
                            var cost = response.results[0]["2013.cost.tuition.in_state"];
                        }
                        money = money.split(" ");
                        money = money.join("");
                        money = money.split("$");
                        money = money.join("");
                        money = money / 12;
                        interest = localStorage.getItem("interest");
                        yearsRepay = 25;
                        cost = Number(cost);
                        interest = Number(interest);
                        yearsRepay = Number(yearsRepay);
                        cost = ((cost * localStorage.getItem("yearsAttend")) - (localStorage.getItem("persContrib") * 4) - (localStorage.getItem("scholContrib") * 4));
                        console.log((interest / 12) * cost);
                        console.log(Math.pow(1 + (interest / 12), -yearsRepay * 12));
                        cost = ((interest / 12) * cost) / (1 - Math.pow(1 + (interest / 12), -yearsRepay * 12));
                        //money = money.toFixed(0);
                        money = Number(money);
                        cost = Number(cost);
                        money = money.toFixed(2);
                        cost = cost.toFixed(2);
                        money = Number(money);
                        cost = Number(cost);
                        console.log(money, cost);
                        if ($("#errorResults").text() !== "") {
                            return;
                        }
                        $("#payment").html("<h3>$" + cost + "</h3>");
                        var myData = new Array(['', cost], ['', money - cost]);
                        var colors = ['#F7FF58', '#FF934F'];
                        var myChart = new JSChart('un', 'pie');
                        myChart.setDataArray(myData);
                        myChart.colorizePie(colors);
                        myChart.setTitleColor('#000000');
                        myChart.setPieUnitsColor('#000000');
                        myChart.setPieValuesColor('#343434');
                        myChart.setSize(250, 250);
                        //myChart.setBackgroundImage("money.jpg");
                        //myChart.set3D(true);
                        myChart.setPieRadius(100);
                        myChart.setPieValuesPrefix("$");
                        myChart.setPieValuesFontSize(12);
                        myChart.setPieValuesOffset(-50);
                        myChart.setTitle("");
                        myChart.draw();
                    });

                });
        });
    }

    function callForAI(i) {
        var majorQueryURL_stat = "https://aardvark-college-debt.firebaseio.com/income-by-major/" + currentMajor + "/average-income/year" + averageIncome[i] + ".json";
        $.ajax({
            url: majorQueryURL_stat,
            method: "GET"
        }).done(function(response) {
            var apiUrl = 'https://www.statbureau.org/calculate-inflation-price-jsonp?jsoncallback=?';


            $.getJSON(apiUrl, {
                    country: 'united-states',
                    start: "2017/1/1",
                    end: (2017 + averageIncome[i]) + "/1/1",
                    amount: response,
                    format: true
                })
                .done(function(data) {
                    var money = data;

                    var text = $('<h4>').html('Avg. Yearly Income over ' + averageIncome[i] + ' Years: <br>' + money.replace(" ", ""));
                    $('#ni' + i).html(text);
                    $.ajax({
                        url: "https://api.data.gov/ed/collegescorecard/v1/schools.json?api_key=laoOF5Sp6MOWzUvnPi53y2EYv2PNL4ju9HCla52z&school.name=" + college + "&_fields=2013.cost.tuition.in_state,2013.cost.tuition.out_of_state,school.school_url",
                        method: "GET"
                    }).done(function(response) {

                        if (localStorage.getItem("location") == "out") {
                            var cost = response.results[0]["2013.cost.tuition.out_of_state"];
                        } else {
                            var cost = response.results[0]["2013.cost.tuition.in_state"];
                        }
                        money = money.split(" ");
                        money = money.join("");
                        money = money.split("$");
                        money = money.join("");
                        money = money / 12;
                        interest = localStorage.getItem("interest");
                        yearsRepay = 25;
                        cost = Number(cost);
                        interest = Number(interest);
                        yearsRepay = Number(yearsRepay);
                        cost = ((cost * localStorage.getItem("yearsAttend")) - (localStorage.getItem("persContrib") * 4) - (localStorage.getItem("scholContrib") * 4));
                        console.log((interest / 12) * cost);
                        console.log(Math.pow(1 + (interest / 12), -yearsRepay * 12));
                        cost = ((interest / 12) * cost) / (1 - Math.pow(1 + (interest / 12), -yearsRepay * 12));

                        //money = money.toFixed(0);
                        money = Number(money);
                        cost = Number(cost);
                        money = money.toFixed(2);
                        cost = cost.toFixed(2);
                        money = Number(money);
                        cost = Number(cost);
                        if (money < cost) {
                            return;
                        }
                        var myData = new Array(['', cost], ['', money - cost]);
                        var colors = ['#F7FF58', '#FF934F'];
                        var myChart = new JSChart('deux' + i, 'pie');
                        myChart.setDataArray(myData);
                        myChart.colorizePie(colors);
                        myChart.setTitleColor('#000000');
                        myChart.setPieUnitsColor('#000000');
                        myChart.setPieValuesColor('#343434');
                        myChart.setSize(250, 250);
                        //myChart.setBackgroundImage("money.jpg");
                        //myChart.set3D(true);
                        myChart.setPieRadius(100);
                        myChart.setPieValuesPrefix("$");
                        myChart.setPieValuesFontSize(12);
                        myChart.setPieValuesOffset(-50);
                        myChart.setTitle("");
                        myChart.draw();

                        //average monthly income
                        $('#monthly' + (i + 1)).html("<h4>Average Monthly Income: $" + money + "</h4>");
                    });
                });
        });
    }

    callForSI(0);

    for (var i = 0; i < staticIncome.length; i++) {
        callForAllSI(i);
    }
    for (var i = 0; i < averageIncome.length; i++) {
        callForAI(i);
    }
});
