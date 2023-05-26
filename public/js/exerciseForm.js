
//This function is used to open the tab for the exercise form when the page is loaded
window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("defaultOpen").click();
});
//This function is used to set up the tabs for the exercise form  
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
//This function is used to disable the button after the submission of the form.
  function disableSubmitButton(button) {
    var form = button.form;
      // Perform form validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    button.disabled = true;
    button.form.submit();
}