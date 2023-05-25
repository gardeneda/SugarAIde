//Sets the default tab to be the weekly chart
window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("defaultOpen").click();
});


function openPage(evt, tabName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Here is the AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById(tabName).innerHTML = this.responseText;
    }
  };

  var url = (tabName == 'diet') ? '/checkCalories' : '/foodHistory';
  xhttp.open("GET", url, true);
  xhttp.send();

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";

  if (tabName === 'diet') {
    loadDietContent();
}
}

function loadDietContent() {
  fetch('/checkCalories', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {
      // Check if user.healthinfo?.activity exists
      console.log("activity:" + data.activity);
      if (data.activity) {
          // User health info exists, load calorieRequirement page
          loadPage('/calorieRequirement', 'dietContent');
      } else {
          // User health info does not exist, update the diet tab content with the received HTML
          document.getElementById('dietContent').innerHTML = data.html;

          // If the response contains a redirect, extract the URL and load the page
          if (data.redirectURL) {
            loadPage(data.redirectURL, 'dietContent');
          }
      }
  });
}


function loadPage(url, containerId) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById(containerId).innerHTML = data;
    });
}
