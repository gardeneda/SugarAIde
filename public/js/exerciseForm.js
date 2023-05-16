window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("defaultOpen").click();
});

function openExercise(evt, exercise) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(exercise).style.display = "block";
    evt.currentTarget.className += " active";
  }

