/* 
    CSS and JS reagarding how to implement the Circular Progress Bar has been attained from: 
      https://www.youtube.com/watch?v=SKU2gExpkPI&ab_channel=CodingLab

    All code has been tweaked and added upon with the core functionality from the above retained.
*/

const riskLevel = document.querySelector("#risk-after").textContent;

console.log(riskLevel);
console.log(typeof riskLevel);

let circularProgress = document.querySelector(".circular-progress"),
	progressValue = document.querySelector(".progress-value");

progressValue.textContent = `${(riskLevel)}`;

const riskForGradient = riskLevel.replace('%', '')
circularProgress.style.background = `conic-gradient( #F9858b ${Number(riskForGradient) * 3.6}deg, #efefef 0deg )`;

console.log(riskForGradient);
// let progress = setInterval(() => {
// 	progressStartValue++;

// 	progressValue.textContent = `${progressStartValue}%`;
// 	circularProgress.style.background = `conic-gradient( #F9858b ${
// 		progressStartValue * 3.6
// 	}deg, #efefef 0deg)`;

// 	if (progressStartValue == Math.trunc(progressEndValue)) {
// 		clearInterval(progress);
// 		progressValue.textContent = `${progressEndValue}%`;
// 	}
// }, speed);
