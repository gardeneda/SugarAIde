/* 
    CSS and JS reagarding how to implement the Circular Progress Bar has been attained from: 
      https://www.youtube.com/watch?v=SKU2gExpkPI&ab_channel=CodingLab

    All code has been tweaked and added upon with the core functionality from the above retained.
*/
let circularProgress = document.querySelector(".circular-progress");
let progressValue = document.querySelector(".progress-value");
let maxCalories = document.querySelector("#calorie-max").innerHTML;

maxCalories = Number(maxCalories);
if (maxCalories == NaN || maxCalories == undefined || maxCalories == null) {
  maxCalories = 1;
}


let progressStartValue = 0;
let progressEndValue = parseFloat(document.querySelector("#calorie-consumed").innerHTML);
const angleConstant = 360 / maxCalories; // Maximum angle for the progress bar to complete a full circle
let speed = 1;

let progress = setInterval(() => {
  progressStartValue++;
  progressValue.textContent = `${progressStartValue} cal`;
  circularProgress.style.background = `conic-gradient(#F9858b ${progressStartValue * angleConstant}deg, #efefef 0deg)`;

  if (progressStartValue >= progressEndValue) {
    clearInterval(progress);
  }
}, speed);
