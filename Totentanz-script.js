/* Settings page code */

class settingsClass {
    constructor() {
        this.enanableSeverity = true;
        this.showSeverityResults = false;
        this.preventOutliers = true;
        this.hideTimer = false;
        this.cumulativeWounds = false;
        this.maxRetreats = 3;
        this.userName = "";
    }
}

let curSeverities = [];
let settings = new settingsClass();
let prevList = [];


document.getElementById("enableSeverityObj").querySelector('input').addEventListener('change', function () {
    settings.enableSeverity = this.checked;
    if (this.checked) {
        document.getElementById("showSeverityResultsObj").classList.remove('hidden');
        document.getElementById("preventOutliersObj").classList.remove('hidden');
    } else {
        document.getElementById("showSeverityResultsObj").classList.add('hidden');
        document.getElementById("preventOutliersObj").classList.add('hidden');
    }
});

document.getElementById("showSeverityResultsObj").querySelector('input').addEventListener('change', function () {
    settings.showSeverityResults = this.checked;
});

document.getElementById("preventOutliersObj").querySelector('input').addEventListener('change', function () {
    settings.preventOutliers = this.checked;
});

document.getElementById("cumulativeWoundsObj").querySelector('input').addEventListener('change', function () {
    settings.cumulativeWounds = this.checked;
});

document.getElementById("hideTimerObj").querySelector('input').addEventListener('change', function () {
    settings.hideTimer = this.checked;
});

document.getElementById("maxRetreatsObj").querySelector('input').addEventListener('change', function (event) {
    settings.maxRetreats = event.target.value;
});

document.getElementById("yourNameObj").querySelector('input').addEventListener('change', function (event) {
    settings.userName = event.target.value;
    if (settings.userName == "") {
        document.getElementById("deviceName").innerHTML = "";
    } else {
        document.getElementById("deviceName").innerHTML = "This device belongs to " + settings.userName;
    }
});

document.getElementById("settingsButton").addEventListener('click', function (event) {
    if (curPage !== "settingsPage") {
        prevPage = curPage;
        prevList.push(prevPage);
        showPage("settingsPage");
        document.getElementById("menu").classList.add('hidden')
    }
});

document.getElementById("aboutButton").addEventListener('click', function (event) {
    if (curPage !== "aboutPage") {
        prevPage = curPage;
        prevList.push(prevPage);
        showPage("aboutPage");
        document.getElementById("menu").classList.add('hidden')
    }
});

document.getElementById("instructionsButton").addEventListener('click', function (event) {
    if (curPage !== "instructionsPage") {
        prevPage = curPage;
        prevList.push(prevPage);
        showPage("instructionsPage");
        document.getElementById("menu").classList.add('hidden')
    }
});

/*control code for which page is visible */

let curPage = "hitPage";

function showPage(pageid) {
    if (curPage !== pageid) {
        if (prevList.length > 0 /*&& prevList[prevList.length - 1] !== curPage */) {
            document.getElementById("backButton").classList.remove('invisible');
        } else {
            document.getElementById("backButton").classList.add('invisible');
        }
        document.getElementById(curPage).style.display = "none";
        document.getElementById(pageid).style.display = "block";
        curPage = pageid;
        if (curPage == "tournamentPage") {
            document.getElementById("restartTournamentButton").classList.remove("hidden");
            document.getElementById("clearTournamentButton").classList.remove("hidden");
        } else {
            document.getElementById("restartTournamentButton").classList.add("hidden");
            document.getElementById("clearTournamentButton").classList.add("hidden");
        }
    }
}

document.getElementById("backButton").addEventListener("click", function () {
    if (curPage == "TournamentPage") {
        leaveTournament();
    } else {
        if (prevList.length == 0) {
            return;
        }
        showPage(prevList.pop());
    }
});

function hitButtonFunction(part) {
    if (settings.enanableSeverity) {
        let hitResults = [];
        if (settings.preventOutliers) {
            hitResults.push(getLight(part));
            hitResults.push(getNormal(part));
            hitResults.push(getSerious(part));
        } else {
            hitResults.push(getNormal(part));
            hitResults.push(getNormal(part));
            hitResults.push(getNormal(part));
        }
        let negOneCount = 0;
        for (i = 0; i < hitResults.length; i++) {
            if (hitResults[i] == -1) {
                negOneCount++;
            }
        }
        hitResults.sort((a, b) => b - a); /* Sorts in descending order, 0s at the end, then -1s after */
        for (i = 0; i < negOneCount; i++) {
            hitResults.pop();
        }
        setupSeverityScreen(negOneCount, hitResults);
    } else {
        goToTimer(getNormal(part));
    }
}

function textFromHitResult(hitResult) {
    if (hitResult == -1) {
        return "--";
    } else if (hitResult == 0) {
        return "X";
    } else {
        return String(hitResult);
    }
}

function setupSeverityScreen(negOneCount, hitResults) {
    console.assert(negOneCount + hitResults.length == 3, "The number of results should be 3, including nothing dones");
    curSeverities = [];
    for (let i = 0; i < negOneCount; i++) {
        curSeverities.push(-1);
    }
    for (let i = 0; i < hitResults.length; i++) {
        curSeverities.push(hitResults[i]);
    }
    document.getElementById("lightResult").innerHTML = textFromHitResult(curSeverities[0]);
    document.getElementById("normalResult").innerHTML = textFromHitResult(curSeverities[1]);
    document.getElementById("seriousResult").innerHTML = textFromHitResult(curSeverities[2]);
    if (settings.showSeverityResults) {
        document.querySelectorAll('.debugResults').forEach(element => element.classList.remove('invisible'))
    } else {
        document.querySelectorAll('.debugResults').forEach(element => element.classList.add('invisible'))
    }
    prevList.push("hitPage");
    showPage("severityPage");
}

document.getElementById("lightButton").addEventListener("click", function () { goToTimer(curSeverities[0]); });
document.getElementById("normalButton").addEventListener("click", function () { goToTimer(curSeverities[1]); });
document.getElementById("seriousButton").addEventListener("click", function () { goToTimer(curSeverities[2]); });


function goToTimer(hitResult) {
    document.getElementById("timerButton").disabled = false;
    if (hitResult == -1) {
        if (timer == -1) {
            document.getElementById("hitOutput").innerHTML = "No damage done";
        } else if (timer == 0) {
            document.getElementById("hitOutput").innerHTML = "No damage done, but you were incapacitated? Report this if you see it";
        } else {
            document.getElementById("hitOutput").innerHTML = "No damage done, keeping " + String(timer);
        }
    } else if (hitResult == 0) {
        document.getElementById("hitOutput").innerHTML = "Hit was an incapacitation";
        timer = 0;
    } else if (timer == 0) { /* A number was given, but they were already incapacitated. Should be impossible*/
        document.getElementById("hitOutput").innerHTML = "Hit was " + String(hitResult) + ", but you were incapacitated? Report this if you see it";
    } else if (timer == -1) { /* A number was given, and this is the first injuring hit*/
        document.getElementById("hitOutput").innerHTML = "Hit from healthy to " + String(hitResult);
        timer = hitResult;
    } else { /* A number was given, and and a timer was already in place */
        if (settings.cumulativeWounds) {
            let newTimer = 1 / ((1 / hitResult) + (1 / timer));
            document.getElementById("hitOutput").innerHTML = "Result was " + String(hitResult) + ", timer was " + String(timer) + ", kept " + String(newTimer);
            timer = newTimer;
        } else if (hitResult > timer) {
            document.getElementById("hitOutput").innerHTML = "Result was " + String(hitResult) + ", timer was " + String(timer) + ", kept " + String(timer);
        } else {
            document.getElementById("hitOutput").innerHTML = "Result was " + String(hitResult) + ", timer was " + String(timer) + ", kept " + String(hitResult);
            timer = hitResult;
        }
    }
    prevList = [];
    showPage("timerPage");
    if (timer == 0) {
        timerFinished();
    } else if (settings.hideTimer) {
        document.getElementById("timerLabel").innerHTML = "";
        document.getElementById("timer").innerHTML = "?";
    } else if (timer == -1) {
        document.getElementById("timerLabel").innerHTML = "Nothing done";
        document.getElementById("timer").innerHTML = "--";
        document.getElementById("timerButton").disabled = true;
    } else {
        curSecond = Math.ceil(timer);
        document.getElementById("timer").innerHTML = String(curSecond);
        if (curSecond == 1) {
            document.getElementById("timerLabel").innerHTML = "second";
        } else {
            document.getElementById("timerLabel").innerHTML = "seconds";
        }
    }
}

document.getElementById("headButton").addEventListener("click", function () { hitButtonFunction(head); });
document.getElementById("faceButton").addEventListener("click", function () { hitButtonFunction(face); });
document.getElementById("neckButton").addEventListener("click", function () { hitButtonFunction(neck); });
document.getElementById("chestThrustButton").addEventListener("click", function () { hitButtonFunction(chest); });
document.getElementById("otherTorsoButton").addEventListener("click", function () { hitButtonFunction(torso); });
document.getElementById("limbsCutButton").addEventListener("click", function () { hitButtonFunction(limbsCut); });
document.getElementById("limbsThrustButton").addEventListener("click", function () { hitButtonFunction(limbsThrust); });
document.getElementById("handsButton").addEventListener("click", function () { hitButtonFunction(hands); });

document.getElementById("setTimerButton").addEventListener("click", function () {
    if (settings.showSeverityResults) {
        document.getElementById("hitOutput").innerHTML = "Timer set to " + String(document.getElementById("timerInput").value);
    }
    timer = document.getElementById("timerInput").value;
    prevList = [];
    showPage("timerPage");
    if (timer == 0) {
        timerFinished();
    } else if (settings.hideTimer) {
        document.getElementById("timerLabel").innerHTML = "";
        document.getElementById("timer").innerHTML = "?";
    } else if (timer == -1) {
        document.getElementById("timerLabel").innerHTML = "Nothing done";
        document.getElementById("timer").innerHTML = "--";
    } else {
        curSecond = Math.ceil(timer);
        document.getElementById("timer").innerHTML = String(curSecond);
        if (curSecond == 1) {
            document.getElementById("timerLabel").innerHTML = "second";
        } else {
            document.getElementById("timerLabel").innerHTML = "seconds";
        }
    }
});



/*Code for getting times from a given hit */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



class bodyPart {
    constructor(name, xs, nones, times) {
        this.name = name;
        this.nones = nones;
        this.xs = xs;
        this.times = times;
    }
}

const chest = new bodyPart("chestThrust", 79, 40, [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 22, 22, 22, 22, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 26, 26, 26, 26, 27, 27, 27, 27, 29, 29, 29, 29, 29, 29, 29, 30, 30]);
const torso = new bodyPart("otherTorso", 0, 381, [30, 32, 33, 39, 41, 41, 41, 41, 43, 50, 51, 54, 57, 59, 60]);
const neck = new bodyPart("neck", 99, 39, [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 12, 12, 12, 12, 12, 13, 14, 14, 15, 15, 16, 16, 16, 16, 17, 17, 17, 18, 18, 18, 19, 19, 19, 20, 20, 20, 21, 21, 21, 21, 21, 22, 22, 24, 24, 25, 25, 25, 26, 26, 26, 26, 27, 27, 27, 28, 28, 28, 29, 29, 29, 29, 29, 30, 30]);
const head = new bodyPart("head", 119, 99, [10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 22, 22, 23, 23, 24, 24, 25, 25, 25, 26, 27, 27, 28, 28, 28, 28, 29, 29, 29, 30, 30, 30, 31, 32, 32, 32, 33, 33, 33, 33, 33, 34, 34, 35, 35, 36, 40, 41, 41, 41, 41, 41, 42, 42, 42, 43, 43, 43, 43, 45, 46, 47, 48, 48, 49, 49, 50, 50, 50, 50, 51, 51, 52, 52, 52, 52, 53, 53, 54, 55, 55, 55, 56, 57, 57, 58, 59, 60]);
const face = new bodyPart("face", 197, 40, [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 21, 21, 22, 22, 23, 24, 24, 27, 27, 27, 28, 29, 29, 29, 31, 31, 32, 32, 32, 33, 33, 34, 35, 37, 37, 38, 38, 39, 39, 39, 39, 39, 40, 40, 41, 41, 41, 41, 42, 42, 42, 42, 44, 45, 46, 46, 47, 48, 48, 51, 52, 55, 55, 56, 56, 56, 56, 58, 60, 60]);
const limbsCut = new bodyPart("limbsCut", 40, 196, [10, 10, 10, 11, 12, 12, 12, 12, 12, 12, 13, 14, 14, 14, 14, 14, 14, 15, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 21, 21, 21, 21, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 25, 25, 25, 25, 25, 26, 26, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 29, 29, 29, 29, 30, 30, 30, 30, 30, 30, 30, 31, 31, 33, 33, 33, 34, 34, 34, 34, 35, 35, 36, 36, 37, 38, 38, 38, 39, 39, 40, 40, 41, 41, 41, 41, 42, 42, 42, 42, 42, 42, 43, 43, 43, 43, 43, 44, 45, 45, 45, 45, 46, 46, 46, 47, 47, 47, 47, 48, 48, 49, 49, 50, 50, 51, 51, 51, 52, 53, 54, 54, 54, 54, 57, 57, 57, 57, 58, 58, 59, 59, 59, 59, 60, 60]);
const limbsThrust = new bodyPart("limbsThrust", 0, 267, [10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 15, 15, 16, 16, 16, 16, 16, 16, 17, 17, 17, 18, 18, 18, 18, 18, 19, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 25, 26, 26, 26, 27, 27, 27, 28, 29, 29, 30, 30, 30, 30, 30, 31, 31, 31, 31, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 32, 33, 33, 33, 33, 34, 34, 34, 34, 34, 34, 35, 35, 35, 36, 36, 36, 36, 36, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38, 39, 39, 39, 39, 39, 39, 40, 40, 40, 40, 40, 40]);
const hands = new bodyPart("hands", 119, 79, [10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 19, 19, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 23, 23, 23, 24, 24, 24, 24, 24, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 29, 29, 30, 30, 30, 31, 32, 33, 33, 34, 34, 34, 35, 36, 36, 37, 37, 37, 38, 38, 39, 39, 40, 40, 41, 43, 44, 45, 46, 48, 48, 49, 50, 50, 50, 50, 50, 50, 52, 52, 53, 54, 54, 54, 55, 56, 58, 59, 59, 59, 59, 59, 60, 61, 61, 61, 62, 64, 64, 66, 66, 67, 67, 68, 68, 69, 69, 69, 69, 70, 70, 70, 72, 72, 73, 74, 74, 74, 75, 78, 78, 78, 79, 79, 80, 80, 80, 80, 81, 81, 83, 83, 84, 85, 85, 86, 87, 88, 89, 90, 90]);


function getLight(hitBodyPart) {
    let maxNum = hitBodyPart.nones + hitBodyPart.times.length - 1;
    let hitNum = randomInt(0, maxNum);
    if (hitNum >= hitBodyPart.times.length) {
        return -1;
    } else {
        return hitBodyPart.times[hitNum];
    }
}

function getNormal(hitBodyPart) {
    let maxNum = hitBodyPart.nones + hitBodyPart.xs + hitBodyPart.times.length - 1;
    let hitNum = randomInt(0, maxNum);
    if (hitNum >= hitBodyPart.times.length + hitBodyPart.xs) {
        return -1;
    } else if (hitNum >= hitBodyPart.times.length) {
        return 0;
    } else {
        return hitBodyPart.times[hitNum];
    }
}

function getSerious(hitBodyPart) {
    let maxNum = hitBodyPart.xs + hitBodyPart.times.length - 1;
    let hitNum = randomInt(0, maxNum);
    if (hitNum >= hitBodyPart.times.length) {
        return 0;
    } else {
        return hitBodyPart.times[hitNum];
    }
}

/* Timer page code */
let timer = -1; // -1 means no time set, 0 means X, otherwise it is a number
let startTime = new Date();
let timeoutID = 0;
let curSecond = 0;

function runTimer() {
    startTime = new Date();
    document.getElementById("timer").innerHTML = String(curSecond);
    if (curSecond == 1) {
        document.getElementById("timerLabel").innerHTML = "second";
    } else {
        document.getElementById("timerLabel").innerHTML = "seconds";
    }
    timeoutID = setTimeout(() => {
        timer = timer - (new Date() - startTime) / 1000;
        curSecond = Math.ceil(timer);
        if (timer <= 0) { timerFinished(); }
        else { runTimer(); }
    }, 100);
}

function startTimer() {
    if (timer != -1) {
        document.getElementById("timerButton").innerHTML = "PAUSE";
        document.getElementById("timerButton").disabled = false;
        document.getElementById("nextHitButton").disabled = true;
        document.getElementById("endMatchButton").disabled = true;
    }
    document.getElementById("timerButton").removeEventListener("click", startTimer);
    setTimeout(() => {
        document.getElementById("timerButton").addEventListener("click", pauseTimer);
    }, 100); /*avoid accidental double click*/
    runTimer();
}



function timerFinished() {
    timer = 0;
    document.getElementById("timerLabel").innerHTML = "Incapacitated";
    document.getElementById("timer").innerHTML = "X";
    document.getElementById("timerButton").disabled = true;
    document.getElementById("nextHitButton").disabled = true;
    document.getElementById("endMatchButton").disabled = false;
    navigator.vibrate(500);
}

function pauseTimer() {
    if (timer > 0) {
        clearTimeout(timeoutID);
        timer = timer - (new Date() - startTime) / 1000;
        if (timer < 0) {
            timer = 0;
            timerFinished();
        }
    }
    document.getElementById("timerButton").removeEventListener("click", pauseTimer);
    setTimeout(() => {
        document.getElementById("timerButton").addEventListener("click", startTimer);
    }, 100); /*avoid accidental double click*/
    document.getElementById("timerButton").innerHTML = "START";
    document.getElementById("nextHitButton").disabled = false;
    document.getElementById("endMatchButton").disabled = false;
}

function endMatch() {
    document.getElementById("timerButton").innerHTML = "START";
    document.getElementById("timerButton").disabled = false;
    document.getElementById("nextHitButton").disabled = false;
    document.getElementById("endMatchButton").disabled = false;
    prevList = [];
    showPage("hitPage");
    timer = -1;
    curSeverities = [];
}

function nextHit() {
    prevList.push(timerPage);
    showPage("hitPage");
}

document.getElementById("timerButton").addEventListener("click", startTimer);
document.getElementById("endMatchButton").addEventListener("click", endMatch);
document.getElementById("nextHitButton").addEventListener("click", nextHit);

/* Tournament page code */

class Fighter {
    constructor(name, idNum) {
        this.name = name;
        this.id = idNum;
        this.wins = 0;
        this.retreats = 0;
        this.dead = false;
    }

    getScore() {
        if (this.wins == 0 && this.retreats == 0) {
            return 0; // No score if no wins or retreats, dont divide by zero
        }
        let score = (this.wins - this.retreats) / (this.wins + this.retreats);
        return score.toFixed(3); // Return score with 3 decimal places, should avoid rounding error for most tournament sizes
    }
}

let fighters = [];
let pairings = []; // list of pairings, with figher ids
let pairingOptions = []; // list of pairing options, with fighter structs
let reset_timeoutID = 0;
let resetTime = 2000; // 2 seconds to hold button

document.getElementById("addFighterButton").addEventListener("click", function () {
    let fighterName = document.getElementById("fighterInput").value;
    if (fighterName == "") {
        return;
    }
    let fighter = new Fighter(fighterName, fighters.length);
    fighters.push(fighter);
    let newDiv = document.createElement("div");
    newDiv.className = "fighter";
    newDiv.id = "fighterDiv" + String(fighter.id);
    let fighterNameText = document.createElement("p");
    fighterNameText.className = "fighterName";
    fighterNameText.id = "fighterName" + String(fighter.id);
    fighterNameText.innerHTML = fighter.name;
    newDiv.appendChild(fighterNameText);

    let winButton = document.createElement("button");
    winButton.className = "fighterObjButton";
    winButton.id = "winButton" + String(fighter.id);
    winButton.innerHTML = "<ion-icon name=\"chevron-up-outline\"></ion-icon>";
    winButton.addEventListener("mousedown", function () {
        let clickedFighter = fighters.find(f => f.id == this.id.replace("winButton", ""));
        clickedFighter.wins += 1;
        reset_timeoutID = setTimeout(() => { clickedFighter.wins = 0; updateFighterChart(); }, resetTime);
    });
    winButton.addEventListener("mouseup", function () {
        clearTimeout(reset_timeoutID);
        updateFighterChart();
    });
    newDiv.appendChild(winButton);

    let fighterScoreText = document.createElement("p");
    fighterScoreText.className = "fighterScore";
    fighterScoreText.id = "fighterScore" + String(fighter.id);
    newDiv.appendChild(fighterScoreText);

    let loseButton = document.createElement("button");
    loseButton.className = "fighterObjButton";
    loseButton.id = "loseButton" + String(fighter.id);
    loseButton.addEventListener("mousedown", function () {
        let clickedFighter = fighters.find(f => f.id == this.id.replace("loseButton", ""));
        if (clickedFighter.retreats >= settings.maxRetreats) {
            clickedFighter.retreats = 0; // Reset retreats if they have fled
        } else {
            clickedFighter.retreats += 1;
        }
        reset_timeoutID = setTimeout(() => { clickedFighter.retreats = 0; updateFighterChart(); }, resetTime);
    });
    loseButton.addEventListener("mouseup", function () {
        clearTimeout(reset_timeoutID);
        updateFighterChart();
    });
    newDiv.appendChild(loseButton);


    let deathButton = document.createElement("button");
    deathButton.className = "fighterObjButton";
    deathButton.id = "deathButton" + String(fighter.id);
    deathButton.addEventListener("click", function () {
        let clickedFighter = fighters.find(f => f.id == this.id.replace("deathButton", ""));
        if (clickedFighter.dead) {
            clickedFighter.dead = false;
        } else {
            clickedFighter.dead = true;
        }
        updateFighterChart();
    });
    newDiv.appendChild(deathButton);

    document.getElementById("fighterList").appendChild(newDiv);
    updateFighterChart();
    document.getElementById("fighterInput").value = ""; // Clear input field
});

document.getElementById("getPairingButton").addEventListener("click", function () {
    pairingOptions = getPairingsList();
    for (let i = 0; i < pairingOptions.length; i++) {
        //console.log("Option:" + pairingOptions[i][0].name + " vs " + pairingOptions[i][1].name);
    }
    if (pairingOptions.length == 0) {
        document.getElementById("pairingText").innerHTML = "No pairings available";
    } else {
        document.getElementById("pairingText").innerHTML = pairingOptions[0][0].name + " vs " + pairingOptions[0][1].name;
    }
    document.getElementById("pairingPopup").classList.remove("hidden");
});

document.getElementById("cancelPairingButton").addEventListener("click", function (event) {
    document.getElementById("pairingPopup").classList.add("hidden");
});

document.getElementById("nextPairingButton").addEventListener("click", function (event) {
    if (pairingOptions.length > 0) {
        pairingOptions.reverse();
        pairingOptions.pop();
        pairingOptions.reverse();
    }
    if (pairingOptions.length == 0) {
        document.getElementById("pairingText").innerHTML = "No pairings available";
    } else {
        document.getElementById("pairingText").innerHTML = pairingOptions[0][0].name + " vs " + pairingOptions[0][1].name;
    }
});

document.getElementById("confirmPairingButton").addEventListener("click", function (event) {
    if (pairingOptions.length > 0) {
        pairings.push([pairingOptions[0][0].id, pairingOptions[0][1].id]);
    }
    document.getElementById("pairingPopup").classList.add("hidden");
    //console.log("Pairings: ");
    for (let i = 0; i < pairings.length; i++) {
        //console.log(fighters.find(f => f.id == pairings[i][0]).name + " vs " + fighters.find(f => f.id == pairings[i][1]).name);
    }
});



function sortPairingsFunc(pairing1, pairing2) { /* True if pairing1 should appear higher than pairing2 */
    // Requires that the pairings are different, i.e. it wont be ([a,b], [b,a])
    // Assumes dead or fled fighters are excluded
    // First priority: fighters who haven't already fought each other
    /* The mins and maxes here are used for when the fighters are in different order, e.g. [a,b] vs [b,a]
    let id11 = Math.max(pairing1[0].id, pairing1[1].id);
    let id12 = Math.min(pairing1[0].id, pairing1[1].id);
    let id21 = Math.max(pairing2[0].id, pairing2[1].id);
    let id22 = Math.min(pairing2[0].id, pairing2[1].id); */
    let id11 = pairing1[0].id;
    let id12 = pairing1[1].id;
    let id21 = pairing2[0].id;
    let id22 = pairing2[1].id;
    let p1Fought = 0;
    let p2Fought = 0;
    for (let i = 0; i < pairings.length; i++) {
        if ((pairings[i][0] == id11 && pairings[i][1] == id12) || (pairings[i][0] == id12 && pairings[i][1] == id11)) {
            p1Fought++;
        }
        if ((pairings[i][0] == id21 && pairings[i][1] == id22) || (pairings[i][0] == id22 && pairings[i][1] == id21)) {
            p2Fought++;
        }
    }
    if (p1Fought < p2Fought) {
        return -1; // pairing1 should appear higher
    } else if (p1Fought > p2Fought) {
        return 1; // pairing2 should appear higher
    }
    // Second priority: if one of the fighters has just fought, favor other pairings
    let justFought1 = false;
    let justFought2 = false; //Don't need to check each individual fighter, becuse they will get caught by who-fought-latest later
    if (pairings.length > 0) { // If there are no pairing, then will cause error
        if (pairings[pairings.length - 1][0] == id11 || pairings[pairings.length - 1][1] == id11) {
            justFought1 = true;
        } else if (pairings[pairings.length - 1][0] == id12 || pairings[pairings.length - 1][1] == id12) {
            justFought1 = true;
        }
        if (pairings[pairings.length - 1][0] == id21 || pairings[pairings.length - 1][1] == id21) {
            justFought2 = true;
        } else if (pairings[pairings.length - 1][0] == id22 || pairings[pairings.length - 1][1] == id22) {
            justFought2 = true;
        }
        if (justFought1 && !justFought2) {
            return 1; // pairing2 should appear higher
        } else if (!justFought1 && justFought2) {
            return -1; // pairing1 should appear higher
        }
    }
    // Third priority: pairings with fewer fights
    let fights11 = 0;
    let fights12 = 0;
    let fights21 = 0;
    let fights22 = 0;
    for (let i = 0; i < pairings.length; i++) {
        if (pairings[i][0] == id11 || pairings[i][1] == id11) {
            fights11 += 1;
        }
        if (pairings[i][0] == id12 || pairings[i][1] == id12) {
            fights12 += 1;
        }
        if (pairings[i][0] == id21 || pairings[i][1] == id21) {
            fights21 += 1;
        }
        if (pairings[i][0] == id22 || pairings[i][1] == id22) {
            fights22 += 1;
        }
    }
    if (Math.min(fights11, fights12) < Math.min(fights21, fights22)) {
        return -1; // pairing1 should appear higher
    } else if (Math.min(fights11, fights12) > Math.min(fights21, fights22)) {
        return 1; // pairing2 should appear higher
    }
    if (fights11 + fights12 < fights21 + fights22) {
        return -1; // pairing1 should appear higher
    } else if (fights11 + fights12 > fights21 + fights22) {
        return 1; // pairing2 should appear higher
    }

    // Fourth priority: pairings with similar scores
    const scoreDiff1 = Math.abs(pairing1[0].getScore() - pairing1[1].getScore());
    const scoreDiff2 = Math.abs(pairing2[0].getScore() - pairing2[1].getScore());
    if (scoreDiff1 < scoreDiff2) {
        return -1; // pairing1 should appear higher
    } else if (scoreDiff1 > scoreDiff2) {
        return 1; // pairing2 should appear higher
    }

    // Fifth priority: pairings with lower scores
    const scoreMean1 = ((pairing1[0].getScore() + pairing1[1].getScore()) / 2).toFixed(3);
    const scoreMean2 = ((pairing2[0].getScore() + pairing2[1].getScore()) / 2).toFixed(3);
    if (scoreMean1 < scoreMean2) {
        return -1; // pairing1 should appear higher
    } else if (scoreMean1 > scoreMean2) {
        return 1; // pairing2 should appear higher
    }

    // Sixth priority: people who fought longest ago
    let lastFight11 = -1;
    let lastFight12 = -1;
    let lastFight21 = -1;
    let lastFight22 = -1;
    for (let i = 0; i < pairings.length; i++) {
        if (pairings[i][0] == id11 || pairings[i][1] == id11) {
            lastFight11 = i;
        }
        if (pairings[i][0] == id12 || pairings[i][1] == id12) {
            lastFight12 = i;
        }
        if (pairings[i][0] == id21 || pairings[i][1] == id21) {
            lastFight21 = i;
        }
        if (pairings[i][0] == id22 || pairings[i][1] == id22) {
            lastFight12 = i;
        }
    }
    if (Math.min(lastFight11, lastFight12) < Math.min(lastFight21, lastFight22)) {
        return -1; // pairing1 should appear higher
    } else if (Math.min(lastFight11, lastFight12) > Math.min(lastFight21, lastFight22)) {
        return 1; // pairing2 should appear higher
    }
    if (lastFight11 + lastFight12 < lastFight21 + lastFight22) {
        return -1; // pairing1 should appear higher
    } else if (lastFight11 + lastFight12 > lastFight21 + lastFight22) {
        return 1; // pairing2 should appear higher
    }

    // If all else fails, random
    return (Math.random() - 0.5)
}

function getPairingsList() {
    let fightersCopy = fighters;
    let elligibleFighters = fightersCopy.filter(f => !f.dead && f.retreats < settings.maxRetreats);
    pairingOptions = [];
    if (elligibleFighters.length < 2) {
        return [];
    }
    for (let i = 0; i < elligibleFighters.length; i++) {
        //console.log("elligibleFighter " + String(i) + ": " + elligibleFighters[i].name);
        for (let j = i + 1; j < elligibleFighters.length; j++) {
            if (elligibleFighters[i].id < elligibleFighters[j].id) {
                pairingOptions.push([elligibleFighters[i], elligibleFighters[j]]);
            } else if (elligibleFighters[i].id > elligibleFighters[j].id) {
                pairingOptions.push([elligibleFighters[j], elligibleFighters[i]]);
            }
        }
    }
    return pairingOptions.sort(sortPairingsFunc);
}



function fighterViewSortFunc(fighter1, fighter2) { /* True if fighter1 should appear higher than fighter 2 */
    if (fighter2.dead && !(fighter1.dead)) {
        return 1
    } else if (fighter1.dead && !(fighter2.dead)) {
        return -1
    } else if ((fighter2.retreats >= settings.maxRetreats) && !(fighter1.retreats >= settings.maxRetreats)) { /* Fighter2 has fled, 1 has not*/
        return 1
    } else if ((fighter1.retreats >= settings.maxRetreats) && !(fighter2.retreats >= settings.maxRetreats)) { /* Fighter 1 has fled*/
        return -1
    } else { /*do it based on score */
        const score1 = fighter1.wins - fighter1.retreats
        const score2 = fighter2.wins - fighter2.retreats
        if (score1 == score2) {
            if (fighter1.wins == fighter2.wins) { /* The two fighters have the same record */
                if (fighter1.id > fighter2.id) {
                    return 1;
                } else {
                    return -1
                }
            } else {
                if (fighter1.wins > fighter2.wins) {
                    return 1;
                } else {
                    return -1;
                }
            }
        } else if (score1 > score2) {
            return 1
        } else {
            return -1
        }
    }
}



function updateFighterChart() {
    let sortedFighters = fighters;
    sortedFighters.sort(fighterViewSortFunc, true).reverse();
    let elemList = new Array(fighters.length);
    for (let i = 0; i < sortedFighters.length; i++) {
        document.getElementById("fighterName" + String(sortedFighters[i].id)).innerHTML = sortedFighters[i].name;
        document.getElementById("fighterScore" + String(sortedFighters[i].id)).innerHTML = String(sortedFighters[i].wins) + "-" + String(sortedFighters[i].retreats);
        if (sortedFighters[i].dead) {
            document.getElementById("deathButton" + String(sortedFighters[i].id)).innerHTML = "<ion-icon name=\"arrow-undo\"></ion-icon>";
            document.getElementById("fighterDiv" + String(sortedFighters[i].id)).classList.add("fighter--dead");
        } else {
            document.getElementById("deathButton" + String(sortedFighters[i].id)).innerHTML = "<ion-icon name=\"skull-sharp\"></ion-icon>";
            document.getElementById("fighterDiv" + String(sortedFighters[i].id)).classList.remove("fighter--dead");
        }
        if (sortedFighters[i].retreats >= settings.maxRetreats) {
            document.getElementById("loseButton" + String(sortedFighters[i].id)).innerHTML = "<ion-icon name=\"arrow-undo\"></ion-icon>";
            document.getElementById("fighterDiv" + String(sortedFighters[i].id)).classList.add("fighter--retreated");
        } else {
            document.getElementById("loseButton" + String(sortedFighters[i].id)).innerHTML = "<ion-icon name=\"chevron-down-outline\"></ion-icon>";
            document.getElementById("fighterDiv" + String(sortedFighters[i].id)).classList.remove("fighter--retreated");
        }
        elemList[i] = document.getElementById("fighterDiv" + String(sortedFighters[i].id));
    }
    let fighterView = document.getElementById("fighterList");
    fighterView.innerHTML = "";
    for (let i = 0; i < sortedFighters.length; i++) {
        fighterView.appendChild(elemList[i]);
    }
    if (fighters.length == 0) {
        document.getElementById("tournamentTitle").classList.remove("hidden");
        document.getElementById("clearTournamentButton").disabled = true;
    } else {
        document.getElementById("tournamentTitle").classList.add("hidden");
        document.getElementById("clearTournamentButton").disabled = false;
    }
}


function goToTournament() {
    document.getElementById("switchModeButton").innerHTML = "<ion-icon name=\"timer-outline\"></ion-icon>";
    document.getElementById("restartTournamentButton").classList.remove("hidden");
    document.getElementById("clearTournamentButton").classList.remove("hidden");
    prevList.push(curPage);
    showPage("tournamentPage");
}

function leaveTournament() {
    document.getElementById("switchModeButton").innerHTML = "<ion-icon name=\"trophy-outline\"></ion-icon>";
    if (prevList.length > 0) {
        showPage(prevList.pop());
    } else {
        showPage("hitPage");
    }
}

document.getElementById("clearTournamentButton").addEventListener("click", function (event) {
    fighters = [];
    pairings = [];
    updateFighterChart();
    document.getElementById("menu").classList.add('hidden')
});

document.getElementById("restartTournamentButton").addEventListener("click", function (event) {
    for (let i = 0; i < fighters.length; i++) {
        fighters[i].wins = 0;
        fighters[i].retreats = 0;
        fighters[i].dead = false;
    }
    pairings = [];
    updateFighterChart();
    document.getElementById("menu").classList.add('hidden')
});

document.getElementById("switchModeButton").addEventListener("click", function () {
    if (curPage == "tournamentPage") {
        leaveTournament();
    } else {
        goToTournament();
    }
});


/* Code for dropdown menu */

window.addEventListener("click", function (event) {
    if (!document.getElementById("menu").classList.contains("hidden")) {
        document.getElementById("menu").classList.add("hidden");
    }
});



document.getElementById("menu").addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent the click from propagating to the window
});

document.getElementById("menuButton").addEventListener("click", function () {
    event.stopPropagation(); // Prevent the click from propagating to the window
    if (document.getElementById("menu").classList.contains("hidden")) {
        document.getElementById("menu").classList.remove("hidden");
    } else {
        document.getElementById("menu").classList.add("hidden");
    }
});


/* Startup code */
document.getElementById("severityPage").style.display = "none";
document.getElementById("settingsPage").style.display = "none";
document.getElementById("timerPage").style.display = "none";
document.getElementById("aboutPage").style.display = "none";
document.getElementById("instructionsPage").style.display = "none";
document.getElementById("tournamentPage").style.display = "none";

showPage("hitPage");
showPage("settingsPage");
showPage("hitPage");