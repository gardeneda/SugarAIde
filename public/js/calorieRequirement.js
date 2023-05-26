/* 
    CSS and JS reagarding how to implement the Circular Progress Bar has been attained from: 
      https://www.youtube.com/watch?v=SKU2gExpkPI&ab_channel=CodingLab

    All code has been tweaked and added upon with the core functionality from the above retained.
*/
let circularProgress = document.querySelector(".circular-progress");
let progressValue = document.querySelector(".progress-value");

let progressStartValue = 0;
let progressEndValue = parseFloat(document.querySelector("#calorie-require").innerHTML);
let maxAngle = 360; // Maximum angle for the progress bar to complete a full circle
let speed = 1;

let progress = setInterval(() => {
  progressStartValue++;
  progressValue.textContent = `${progressStartValue} cal`;

  let progressRatio = progressStartValue / progressEndValue;
  let progressAngle = progressRatio * maxAngle;
  let gradientAngle = 90 + (progressAngle / 2); // Adjusting the starting angle of the gradient

  circularProgress.style.background = `conic-gradient(#F9858b ${gradientAngle}deg, #efefef 0deg)`;

  if (progressStartValue >= progressEndValue) {
    clearInterval(progress);
  }
}, speed);
