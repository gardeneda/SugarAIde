$(document).ready(function(){
  $("#update-weight-button").click(function(){
    var newWeight = $("#weight-input").val();
    $.post("/profile/updateHealthInfo", {weight: newWeight}, function(data){
      if(data=='success'){
        alert("Weight updated successfully!");
      }else {
        console.log('Failed to update activity');
      }
    });
  });

  $("#update-age-button").click(function(){
    var newAge = $("#age-input").val();
    $.post("/profile/updateHealthInfo", {age: newAge}, function(data){
      if(data=='success'){
        alert("Age updated successfully!");
      }else {
        console.log('Failed to update activity');
      }
    });
  });
});

$(document).ready(function() {
  // Update Activity Button Click Event
  $('#update-activity-button').on('click', function() {
    var newActivity = $('#activity-select').val();

    // Send a POST request to update activity
    $.post("/profile/updateHealthInfo", { activity: newActivity }, function(data) {
      if (data === 'success') {
        alert("Activity updated successfully!");
      } else {
        console.log('Failed to update activity');
      }
    });
  });
});