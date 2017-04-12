# aardy-look
Aardvark is a user friendly college debt analysis tool

##screenshots

See screenshots folder in repository


## Technologies used

The technologies that made this project possible are 

firebase
CollegeScorecard API
Inflation API
trillo (not used)

## Built With 

How Aardvark came together

VS Code/Sumblime Text
Bootstrap
Jquery
awesomplete

## Code Example

(Grabbing the college and major you chose from local storage)

$('#yourCollege').html(localStorage.getItem("college"));
$('#yourMajor').html(localStorage.getItem("major"));

(Reaches into your firebase database to grab the pertaining information)

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


## Contributors

Samantha Scapps
Brian Manchester
Zachary Bartlett

## License

none
