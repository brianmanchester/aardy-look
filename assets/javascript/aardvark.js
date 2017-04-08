var config1 = {
    apiKey: "AIzaSyAnIDNBZUFPnCWqUZSpLLjp1GF4umID3Zw",
    authDomain: "aardvark-college-debt.firebaseapp.com",
    databaseURL: "https://aardvark-college-debt.firebaseio.com",
    projectId: "aardvark-college-debt",
    storageBucket: "aardvark-college-debt.appspot.com",
    messagingSenderId: "582943288825"
  };
  firebase.initializeApp(config1, "cool");

var database1 = firebase.database(firebase.app("cool"));
var staticIncome = [1, 5, 10, 25];
var averageIncome = [5, 10, 25];

$(document).ready(function() {
database1.ref("income-by-major").once("value").then(function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var key = childSnapshot.key;
    var listItem = $('<li>');
    var linkForItem = $('<a>').addClass('majorChosen').attr('href', '#').text(key);
    listItem.append(linkForItem);
    $('#majorDropdown').append(listItem);
  });
  $('.majorChosen').on('click', function(event) {
    event.preventDefault();
    var major = $(this).text();
    console.log(major);
    $('#majorFill').text(major);
  });
});
    $("#submit").click(function() {
      localStorage.setItem("college", $("#schoolName").val());
      localStorage.setItem("major", $("#majorFill").text());
      localStorage.setItem("persContrib", $("#persContrib").val());
      localStorage.setItem("scholContrib", $("#scholContrib").val());
      localStorage.setItem("yearsAttend", $("#yearsAttend").val());
      if (document.getElementById("in").checked == true) {
        localStorage.setItem("location", "in");
      } else if (document.getElementById("out").checked == true) {
        localStorage.setItem("location", "out");
      }
      localStorage.setItem("interest", $("#interest").val());
      location.replace("page3.html");
    });
});