//insert after
$("#san").click(function() {
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

  var newPostRef = database2.ref().push({
    searches: ""
  })
  localStorage.setItem("yrKey", newPostRef.key);
  setTimeout(function() {location.replace("input.html");}, 1000);
});


//insert before