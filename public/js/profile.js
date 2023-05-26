$(document).ready(function () {
  // Function to update the risk value on the page
  function updateRiskValue(risk) {
    $("#risk-value").text(risk + "%");
  }

  // Function to handle the response from the server
  function handleResponse(data) {
    if (data === "success") {
      alert("Update successful!");

      // Retrieve the updated risk value from the server
      $.get("/profile/risk", { _t: new Date().getTime() }, function (data) {
        updateRiskValue(data.risk);
      });
    } else {
      console.log("Failed to update");
    }
  }

  const weightInput = document.getElementById('weight-input');
  const updateWeightButton = document.getElementById('update-weight-button');
  const ageInput = document.getElementById('age-input');
  const updateAgeButton = document.getElementById('update-age-button');

  // Weight input validation
  weightInput.addEventListener('input', function() {
      if (weightInput.value < 0) {
          weightInput.value = '';
      } else if (weightInput.value.length > 3) {
          weightInput.value = weightInput.value.slice(0, 3);
      }
  });

  // Age input validation
  ageInput.addEventListener('input', function() {
      if (ageInput.value < 0) {
          ageInput.value = '';
      } else if (ageInput.value.length > 3) {
          ageInput.value = ageInput.value.slice(0, 3);
      }
  });

  // Update Weight Button Click Event
  $("#update-weight-button").on("click", function () {
    var newWeight = $("#weight-input").val();

    $.post("/profile/updateHealthInfo", { weight: newWeight }, function (data) {
      handleResponse(data);

      // Retrieve the updated risk value from the server
      $.get("/profile/risk", { _t: new Date().getTime() }, function (data) {
        updateRiskValue(data.risk);
      });
    });
  });

  // Update Age Button Click Event
  $("#update-age-button").on("click", function () {
    var newAge = $("#age-input").val();
    $.post("/profile/updateHealthInfo", { age: newAge }, function (data) {
      handleResponse(data);

      // Retrieve the updated risk value from the server
      $.get("/profile/risk", { _t: new Date().getTime() }, function (data) {
        updateRiskValue(data.risk);
      });
    });
  });

  // Update Activity Button Click Event
  $("#update-activity-button").on("click", function () {
    var newActivity = $("#activity-select").val();

    $.post(
      "/profile/updateHealthInfo",
      { activity: newActivity },
      function (data) {
        handleResponse(data);

        // Retrieve the updated risk value from the server
        $.get("/profile/risk", { _t: new Date().getTime() }, function (data) {
          updateRiskValue(data.risk);
        });
      }
    );
  });

  $.get("/profile/risk", { _t: new Date().getTime() }, function (data) {
    updateRiskValue(data.risk);
  });
});
