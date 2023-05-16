document.addEventListener("DOMContentLoaded", async function () {
  var calendarEl = document.getElementById("calendar");
  var {eventArray, weeklyLogs} = await getExerciseData();
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: eventArray,
  });
  calendar.render();

  let myChart = document.getElementById('chart').getContext('2d');
  let exerciseChart = new Chart(myChart, {
    type: 'bar',
    responsive: true,
    data: {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [{
        label: 'Time (Hours)',
        data: weeklyLogs[weeklyLogs.length - 1].durations,
        backgroundColor: 'blue',
        borderWidth: 1,
      }]
    },
    options: {}
  });
});
window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("defaultOpen").click();
});

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

async function getExerciseData() {
  const response = await fetch("http://localhost:5050/exercisePage/calendarData");
  const data = await response.json();

  const exerciseLog = data.exercise;

  const today = new Date();
  const todaysLogs = exerciseLog.filter(log => {
  const logDate = new Date(log.date);
  return logDate.getDate() === today.getDate() &&
    logDate.getMonth() === today.getMonth() &&
    logDate.getFullYear() === today.getFullYear();
  });

  displayDailyLogs(todaysLogs);


  const eventArray = [];
  let weeklyLogs = [];

  for (const key in exerciseLog) {
    if (Object.prototype.hasOwnProperty.call(exerciseLog, key)) {
      const entry = exerciseLog[key];
      const date = new Date(entry.date);
      const formattedDate = formatDate(date);

      const event = {
        title: entry.exercise,
        start: formattedDate,
        end: formattedDate,
      };

      eventArray.push(event);

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

function attachDeleteButtonListeners() {
  document.querySelectorAll(".delete-btn").forEach(button => {
    const id = button.getAttribute("data-id");
    button.addEventListener("click", () => deleteExerciseEntry(id));
  });
}



function displayDailyLogs(dailyLogs) {
  console.log(dailyLogs);
  const dailyLogsDiv = document.getElementById("dailyLogs");
  let content = "<table><thead><tr><th>Exercise</th><th>Duration (hours)</th><th>Calories</th><th>Remove</th></tr></thead><tbody>";

  dailyLogs.forEach(log => {
    console.log(log);
    content += `<tr>
                <td>${log.exercise}</td>
                <td>${log.duration}</td>
                <td>${log.calories_burned}</td>
                <td><button class="delete-btn" data-id="${log.id}">X</button></td>
                </tr>`;
  });

  content += "</tbody></table>";

  dailyLogsDiv.innerHTML = content;
  attachDeleteButtonListeners();
}

async function deleteExerciseEntry(id) {
  // Select the button and the row
  const button = document.querySelector(`button[data-id="${id}"]`);
  const row = button.closest("tr");

  // If they exist, remove the row
  if (button && row) {
    row.remove();
  }

  try {
    // Now make the request
    await fetch(`http://localhost:5050/exercisePage/calendarData/${id}`, {
      method: "DELETE",
    });

  } catch (error) {
    console.error("Failed to delete exercise entry", error);
    // Handle the error here, e.g., alert the user, reload the list, etc.
  }
}


let currentDay = new Date().getDate();
let currentWeek = getWeekNumber(new Date());


setInterval(() => {
  const now = new Date();
  if (now.getDate() !== currentDay) {
    currentDay = now.getDate();
    document.getElementById("dailyLogs").innerHTML = '';
  }
}, 60 * 60000); // check every hour

setInterval(async () => {
  const now = new Date();
  const nowWeek = getWeekNumber(now);
  
  if (nowWeek !== currentWeek) {
    currentWeek = nowWeek;

    // Fetch new data and update the chart
    var {eventArray, weeklyLogs} = await getExerciseData();
    exerciseChart.data.datasets[0].data = weeklyLogs[weeklyLogs.length - 1].durations;
    exerciseChart.update();
  }
}, 60 * 60000); // check every hour

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

