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

async function getExerciseData() {
  const response = await fetch("http://localhost:5050/exercisePage/calendarData");
  const data = await response.json();

  const exerciseLog = data.exercise;

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

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
