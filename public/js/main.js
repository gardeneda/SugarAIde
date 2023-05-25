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
        totalCalories += log.caloriesBurned;
      });
      document.getElementById("exerciseCalories").innerHTML = totalCalories;
      document.getElementById("time").innerHTML = totalTime + (totalTime === 1 ? " hour" : " hours");
      document.getElementById("calories").innerHTML = totalCalories;
    } else {
      document.getElementById("exerciseCalories").innerHTML = 0;
      document.getElementById("time").innerHTML = "No exercise logged today";
      document.getElementById("calories").innerHTML = "No calories burned today";
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  // Button Animation and play Feature 
  var spinTimeout;
  var musicTimeout;
  var audio = document.getElementById("audio");
  var audioUnlocked = false;
  
  //Function to handle audio on mobile devices
  function handleInteraction(isMobile) {
    if (!audioUnlocked) {
      // Unmute the audio for subsequent plays
      audio.muted = false;
      audioUnlocked = true;
    }
    startSpin(isMobile);
  }
  //Main function, spins and plays the audio after 3 second press
  function startSpin(isMobile) {
    spinTimeout = setTimeout(function() {
      addSpinClass();
      playSound();
    }, 3000);
  }
  //Stops the spin and audio
  function stopSpin() {
    clearTimeout(spinTimeout);
    clearTimeout(musicTimeout);
    removeSpinClass();
    stopSound();
  }
  //Adds spin class to button
  function addSpinClass() {
    document.getElementById("chatButton").classList.add("spin");
  }
  //Removes spin class from button
  function removeSpinClass() {
    document.getElementById("chatButton").classList.remove("spin");
  }
  //Plays the audio
  function playSound() {
    musicTimeout = setTimeout(function() {
      audio.play();
    }, 500); // Adjust this delay if needed
  }
  //Stops the audio
  function stopSound() {
    audio.pause();
    audio.currentTime = 0;
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////