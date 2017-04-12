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

 var config2 = {
     apiKey: "AIzaSyC5FjqLE_GMe98pc1Q9BBEQwwM_MTsHtFs",
     authDomain: "recentsearches-aa729.firebaseapp.com",
     databaseURL: "https://recentsearches-aa729.firebaseio.com",
     projectId: "recentsearches-aa729",
     storageBucket: "recentsearches-aa729.appspot.com",
     messagingSenderId: "302929858382"
 };
 firebase.initializeApp(config2, "recentSearches");
 var database2 = firebase.database(firebase.app("recentSearches"));
 database2.ref(localStorage.getItem("yrKey")).on("value", function(snapshot) {
     console.log("hi");
     console.log(snapshot.val());
     $("#recentSearches").html("");
     for (var i = 0; i < snapshot.val().searches.length; i++) {
         var link = $("<span>");
         link.attr("class", "links");
         link.attr("id", "link" + i);
         link.html("<h4>" + (i + 1) + ". " + snapshot.val().searches[i].college + " (" + snapshot.val().searches[i].major + ")</h4>");
         if (i > 9) {
             $("#link" + (i - 10)).html("");
         }
         $("#recentSearches").append(link);
         $("#link" + i).click({ param1: i }, function(event) {
             localStorage.setItem("college", snapshot.val().searches[event.data.param1].college);
             localStorage.setItem("major", snapshot.val().searches[event.data.param1].major);
             localStorage.setItem("persContrib", snapshot.val().searches[event.data.param1].persContrib);
             localStorage.setItem("scholContrib", snapshot.val().searches[event.data.param1].scholContrib);
             localStorage.setItem("yearsAttend", snapshot.val().searches[event.data.param1].yearsAttend);
             localStorage.setItem("location", snapshot.val().searches[event.data.param1].location);
             localStorage.setItem("interest", snapshot.val().searches[event.data.param1].interest);
             location.replace("result.html");
         });
     }
 });


 var staticIncome = [1, 5, 10, 25];
 var averageIncome = [5, 10, 25];
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

 function validate() {
     database.ref("colleges").on("value", function(snapshot) {
         if (snapshot.val().indexOf($("#schoolName").val()) == -1) {
             $("#errors").text("College not valid. Please choose another.");
             return;
         }
     });
     if ($("#majorFill").text() == "Select a major") {
         $("#errors").text("Major not selected.");
         return;
     }
     if (isNaN($("#persContrib").val()) == true) {
         $("#errors").text("Personal contributions field is not a number. Do not include dollar signs or commas.");
         return;
     }
     if ($("#persContrib").val() < 0) {
         $("#errors").text("Please enter a non-negative number for the personal contributions field.");
         return;
     }
     if (isNaN($("#scholContrib").val()) == true) {
         $("#errors").text("Scholarship contributions field is not a number. Do not include dollar signs or commas.");
         return;
     }
     if ($("#scholContrib").val() < 0) {
         $("#errors").text("Please enter a non-negative number for the scholarship contributions field.");
         return;
     }
     if (isNaN($("#yearsAttend").val()) == true) {
         $("#errors").text("Years you plan to attend college field is not a number.");
         return;
     }
     if ($("#yearsAttend").val() <= 0) {
         $("#errors").text("Please enter a positive number for the years to attend college field.");
         return;
     }
     if (document.getElementById("in").checked == false && document.getElementById("out").checked == false) {
         $("#errors").text("Please select in or out-of-state for your college.");
         return;
     }
     if (isNaN($("#interest").val()) == true) {
         $("#errors").text("Interest field is not a number.");
         return;
     }
     if ($("#interest").val() < 0) {
         $("#errors").text("Please type a non-negative number for the interest field.");
         return;
     }
 }
 $("#submit").click(function() {
     $("#errors").text("");
     validate();
     if ($("#errors").text() !== "") {
         window.scrollTo(0, 0);
         return;
     } else {
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


         var searchArray = [];
         database2.ref(localStorage.getItem("yrKey")).on("value", function(snapshot) {
             searchArray = snapshot.val().searches;

         });

         if (searchArray == []) {
             searchArray = [{ college: $("#schoolName").val(), major: $("#majorFill").text(), persContrib: $("#persContrib").val(), scholContrib: $("#scholContrib").val(), yearsAttend: $("#yearsAttend").val(), location: localStorage.getItem("location"), interest: $("#interest").val() }];
         } else {
             searchArray.push({ college: $("#schoolName").val(), major: $("#majorFill").text(), persContrib: $("#persContrib").val(), scholContrib: $("#scholContrib").val(), yearsAttend: $("#yearsAttend").val(), location: localStorage.getItem("location"), interest: $("#interest").val() });
         }

         database2.ref(localStorage.getItem("yrKey")).set({
             searches: searchArray

         });
         setTimeout(function() { location.replace("result.html"); }, 1000);
     }
 });