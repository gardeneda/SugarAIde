let calendar;

////////////////////Load the calendar and chart using the user exerciseLog data//////////////////
document.addEventListener("DOMContentLoaded", async function () {
  var calendarEl = document.getElementById("calendar");
  var {eventArray, weeklyLogs} = await getExerciseData();
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: eventArray,
  });

  calendar.render();
//////////////////Render the Chart using the user exerciseLog data///////////////
  let myChart = document.getElementById('chart').getContext('2d');
  let exerciseChart = new Chart(myChart, {
    type: 'bar',
    responsive: true,
    data: {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [{
        label: 'Time (Hours)',
        data: weeklyLogs[weeklyLogs.length - 1].durations,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    }
  });
});

//Sets the default tab to be the weekly chart
window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("defaultOpen").click();
});



///////////////////////////Function to open the tabs//////////////////////////////
function openLog(evt, view) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(view).style.display = "block";
  evt.currentTarget.className += " active";
}


//Retrieves the exercise data from the database and formats it for the calendar and chart
async function getExerciseData() {
  const response = await fetch(`/exercisePage/calendarData`);
  
  const data = await response.json();

  const exerciseLog = data.exercise;
  //Get the current date for the day
  const today = new Date();
  const todaysLogs = exerciseLog.filter(log => {
  const logDate = new Date(log.date);
  return logDate.getDate() === today.getDate() &&
    logDate.getMonth() === today.getMonth() &&
    logDate.getFullYear() === today.getFullYear();
  });
  //Display the exercise data for the day
  displayDailyLogs(todaysLogs);


  const eventArray = [];
  let weeklyLogs = [];
  //Format the date from string to YYYY-MM-DD
  for (const key in exerciseLog) {
    if (Object.prototype.hasOwnProperty.call(exerciseLog, key)) {
      const entry = exerciseLog[key];
      const date = new Date(entry.date);
      const formattedDate = formatDate(date);

      const event = {
        id: entry.id,
        title: entry.exercise,
        start: formattedDate,
        end: formattedDate,
      };

      eventArray.push(event);
      //Function to display the weekly hours of exercise in the chart
      let week = weeklyLogs.find(w => date >= new Date(w.start) && date <= new Date(w.end));

      if (!week) {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        week = { start: formatDate(weekStart), end: formatDate(weekEnd), durations: [0, 0, 0, 0, 0, 0, 0] };
        weeklyLogs.push(week);
      }

      const dayOfWeek = date.getDay();
      week.durations[dayOfWeek] += parseFloat(entry.duration);
    }
  }

  return { eventArray, weeklyLogs };
}

//////////////////////////SVG icons for the edit, save, and delete buttons//////////////////////////

const saveIcon= `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-save" viewBox="0 0 16 16">
<path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1H2z"/>
</svg>`;
const updateIcon=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
<path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
</svg>`;
const deleteIcon= `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg>`;



///////////////////////Function to add update and delete buttons to the table///////////////////////
function attachButtonListeners() {
  document.querySelectorAll(".delete-btn").forEach(button => {
    const id = button.getAttribute("data-id");
    button.addEventListener("click", () => deleteExerciseEntry(id));
  });

  document.querySelectorAll(".update-btn").forEach(button => {
    const id = button.getAttribute("data-id");
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const row = this.closest("tr");

      if (this.querySelector('.bi-pencil-square')) {
        // Make the row editable
        row.contentEditable = "true";
        row.style.backgroundColor = "#fafafa";

        // Change the button text to "Save"
        this.innerHTML = `${saveIcon}`;
      } else {
        // Get the new exercise log data from the row
        const cells = row.children;
        const newLog = {
          id: id,
          exercise: cells[0].textContent,
          duration: parseInt(cells[1].textContent, 10),
          caloriesBurned: parseInt(cells[2].textContent, 10),
        };
        if (isNaN(newLog.duration) || isNaN(newLog.caloriesBurned)) {
          alert('Invalid input: Duration and calories burned must be numbers');
          return;
        }
        // Send a PUT request to the server with the new data

        fetch(`${process.env.API_BASE_URL}/exercisePage/calendarData/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newLog),
        });

        // Make the row uneditable
        row.contentEditable = "false";
        row.style.backgroundColor = "";

        // Change the button text back to "Update"
        this.innerHTML = updateIcon;
      }
    });
  });
}


////////////////////Function to format the table /////////////////////////////
function displayDailyLogs(dailyLogs) {
  console.log(dailyLogs);
  const dailyLogsDiv = document.getElementById("dailyLogs");
  let content = `<div class="table-responsive"><table class="table"><thead><tr><th>Exercise</th><th>Hours</th><th>Calories</th><th>Update</th><th>Remove</th></tr></thead><tbody>`;

  dailyLogs.forEach(log => {
    console.log(log);
    content += `<tr>
                <td>${log.exercise}</td>
                <td>${log.duration}</td>
                <td>${log.caloriesBurned}</td>
                <td>
                <form class="update-form">
                <button class="update-btn" data-id="${log.id}">${updateIcon}
                </button></form></td>
                <td><button class="delete-btn" data-id="${log.id}">${deleteIcon}</button></td>
                </tr>`;
  });

  content += "</tbody></table></div>";

  dailyLogsDiv.innerHTML = content;
  attachButtonListeners();
}



///////////////////////Function to delete entries from table and database//////////////////////
async function deleteExerciseEntry(id) {
  // Select the button and the row
  const confirmed = confirm("Are you sure you want to delete this entry?");
// Only proceed if the user confirmed
  if (confirmed) {
  // Select the button and the row
    const button = document.querySelector(`button[data-id="${id}"]`);
    const row = button ? button.closest("tr") : null;

    if (button && row) {
      row.remove();
    }

  try {
    await fetch(`${process.env.API_BASE_URL}/exercisePage/calendarData/${id}`, {
      method: "DELETE",
    });


      let event = calendar.getEventById(id);
      if (event) {
        event.remove();
      }
  
    } catch (error) {
      console.error("Failed to delete exercise entry", error);
    }
  }
}


let currentDay = new Date().getDate();
let currentWeek = getWeekNumber(new Date());

/////////////////Function to reset the table based on the day//////////////////////
setInterval(() => {
  const now = new Date();
  if (now.getDate() !== currentDay) {
    currentDay = now.getDate();
    document.getElementById("dailyLogs").innerHTML = '';
  }
}, 60 * 60000); 

////////////////Function to reset the chart based on the week////////////////////
setInterval(async () => {
  const now = new Date();
  const nowWeek = getWeekNumber(now);
  
  if (nowWeek !== currentWeek) {
    currentWeek = nowWeek;
    var {eventArray, weeklyLogs} = await getExerciseData();
    exerciseChart.data.datasets[0].data = weeklyLogs[weeklyLogs.length - 1].durations;
    exerciseChart.update();
  }
}, 60 * 60000); 



//////////////////////Function to get the week number///////////////////////
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}



/////////////////////Function to format the date//////////////////////////
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

