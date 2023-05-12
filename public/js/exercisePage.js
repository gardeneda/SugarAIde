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
        backgroundColor: '#e77076',
        borderWidth: 1,
      }]
    },
    options: {}
  });
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
  const response = await fetch("https://prickly-plum-tiara.cyclic.app/calendarData");
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

function displayDailyLogs(dailyLogs) {
  const dailyLogsDiv = document.getElementById("dailyLogs");
  let content = "<table><thead><tr><th>Exercise</th><th>Duration (hours)</th><th>Calories</th></tr></thead><tbody>";

  dailyLogs.forEach(log => {
    content += `<tr>
                <td>${log.exercise}</td>
                <td>${log.duration}</td>
                <td>${log.calories_burned}</td>
                </tr>`;
  });

  content += "</tbody></table>";

  dailyLogsDiv.innerHTML = content;
}

let currentDay = new Date().getDate();

setInterval(() => {
  const now = new Date();
  if (now.getDate() !== currentDay) {
    currentDay = now.getDate();
    document.getElementById("dailyLogs").innerHTML = '';
  }
}, 60 * 60000); // check every hour



function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
