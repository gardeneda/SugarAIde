/* 
    CSS and JS reagarding how to implement the Circular Progress Bar has been attained from: 
      https://www.youtube.com/watch?v=SKU2gExpkPI&ab_channel=CodingLab

    All code has been tweaked and added upon with the core functionality from the above retained.
*/

console.log(document.querySelector("#calorie-require").innerHTML);

let circularProgress = document.querySelector(".circular-progress"),
    progressValue = document.querySelector(".progress-value");


let progressStartValue = 0,
    progressEndValue = document.querySelector("#calorie-require").innerHTML;
    speed = 1;

let progress = setInterval(() => {
    progressStartValue++;
    progressValue.textContent = `${progressStartValue} cal`;
    circularProgress.style.background = `conic-gradient( #F9858b ${progressStartValue * 0.18}deg, #efefef 0deg)`

    if (progressStartValue == Math.trunc(progressEndValue)) {
        clearInterval(progress);
    }
}, speed);