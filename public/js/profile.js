$(document).ready(function(){
  $("#update-weight-button").click(function(){
    var newWeight = $("#weight-input").val();
    $.post("/profile/updateHealthInfo", {weight: newWeight}, function(data){
      if(data=='success'){
        alert("Weight updated successfully!");
      }
    });
  });

  $("#update-age-button").click(function(){
    var newAge = $("#age-input").val();
    $.post("/profile/updateHealthInfo", {age: newAge}, function(data){
      if(data=='success'){
        alert("Age updated successfully!");
      }
    });
  });
});

