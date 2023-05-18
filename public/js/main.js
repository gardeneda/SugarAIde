
//Exercise Feature Card data, fetches data from the database and displays it on the card
window.addEventListener("load", getExerciseData);
async function getExerciseData() {
    const response = await fetch("http://localhost:5050/main/exerciseData");
    const data = await response.json();
    const exerciseLog = data.exercise;

    //Get the current date for the day
    const today = new Date();
    const todaysLogs = exerciseLog.filter(log => {
      const logDate = new Date(log.date);
      return (
        logDate.getDate() === today.getDate() &&
        logDate.getMonth() === today.getMonth() &&
        logDate.getFullYear() === today.getFullYear()
      );
    });
    //Display the data on the card 
    if (todaysLogs.length > 0) {
      let totalTime = 0;
      let totalCalories = 0;
  
      todaysLogs.forEach(log => {
        totalTime += log.duration;
        totalCalories += log.calories_burned;
      });
  
      document.getElementById("time").innerHTML = totalTime + (totalTime === 1 ? " hour" : " hours");
      document.getElementById("calories").innerHTML = totalCalories;
    } else {
      document.getElementById("time").innerHTML = "No exercise logged today";
      document.getElementById("calories").innerHTML = "No calories burned today";
    }
  }
  
var spinTimeout;

function startSpin() {
  spinTimeout = setTimeout(addSpinClass, 3000);
}

function stopSpin() {
    clearTimeout(spinTimeout);
    removeSpinClass();
}

function addSpinClass() {
    document.getElementById("chatButton").classList.add("spin");
}

function removeSpinClass() {
    document.getElementById("chatButton").classList.remove("spin");
}

function playSound() {
    var audio = document.getElementById("audio");
    audio.play();
}