const currentTime = document.querySelector("#current-time");
const hours = document.querySelector('#hours');
const minutes = document.querySelector('#minutes');
const seconds = document.querySelector('#seconds');
const AmPm = document.querySelector('#am-pm');
const setAlarmButton = document.querySelector('#submitButton');
const alarmContainer = document.querySelector('#alarms-container');
const alarmSound = document.getElementById('alarm-sound');


function getCurrentTime(){
    let time = new Date();
    time = time.toLocaleTimeString('en-US', {
        hour : "numeric",
        minute: "numeric",
        second:"numeric",
        hour12: true
    });
    // This updates the content of the HTML element to display the current time.
    currentTime.innerHTML = time;
    return time;
}


function dropDownMenu(start , end , element){
    for(let i = start; i<= end ; i++){
        const dropDown = document.createElement('option');
        dropDown.value = i < 10 ? "0" + i : i;
        // if(i<10){ 0"+i } else {i}
        dropDown.innerHTML = i < 10 ? "0" + i : i;
        element.appendChild(dropDown);
    }
}

// Adding Hours , minutes , seconds in dropdown menu

window.addEventListener('DOMContentLoaded',(event)=>{
    dropDownMenu(1, 12, hours);

    dropDownMenu(0, 59, minutes);

    dropDownMenu(0, 59, seconds);

    setInterval(getCurrentTime, 1000); //updates every second
    fetchAlarm();
});

// Event Listener added to set alarm button
setAlarmButton.addEventListener('click', getInput);

function getInput(e){
    e.preventDefault();
    const hourValue = hours.value;
    const minuteValue = minutes.value;
    const secondValue = seconds.value;
    const AmPmValue = AmPm.value;

    const alarmTime = convertToTime(
        hourValue,
        minuteValue,
        secondValue,
        AmPmValue
    );

     // check if alarm already exists
     const alarms = checkAlarms();
     const isAlarmAlreadySet = alarms.includes(alarmTime);
     if(isAlarmAlreadySet){
         alert('Alarm already set for this time');
     }else{
         setAlarm(alarmTime);
     }
}


// converting time to 24 hour format
function convertToTime(hour,minute,second,AmPm){
    hour = parseInt(hour); // Convert hour to integer
    if (hour < 10) {
        hour = "0" + hour; // Add leading zero if hour is a single digit number
    }
    return `${hour}:${minute}:${second} ${AmPm}`;
}

/*  if the function is called with the arguments 10, 30, 00, and PM,
 it will return the string "22:30:00 PM", which represents the same time in 24-hour format.
 Note that the function does not actually convert the time to 24-hour format, */

 
// set alarms 
function setAlarm(time, fetching = false){
    const alarm = setInterval(()=>{
        if(time === getCurrentTime()){
            // alert("Alarm Ringing");
            alarmSound.play(); // play the audio file
        }
        console.log('running');
    },500);
    
    addAlarmToDom(time , alarm);
    if(!fetching){
        saveAlarm(time);
    }
    return alarm;
}


// save alarm to local storage
function saveAlarm(time){
    const alarms = checkAlarms();
 
    alarms.push(time);
    localStorage.setItem('alarms',JSON.stringify(alarms)); // convert object to json
 }


// is alarms saved in local storage 
function checkAlarms(){
    let alarms = [];
    const isPresent = localStorage.getItem('alarms');
    if(isPresent) alarms = JSON.parse(isPresent); // convert json to object

    return alarms;
}

// fetching alarms from local storage
function fetchAlarm(){
    const alarms = checkAlarms();
    alarms.forEach((time)=>{
        setAlarm(time,true);
    });
}

// Alarm set by user Displayed in HTML
function addAlarmToDom(time, intervalId){
    const alarm = document.createElement('div');
    alarm.classList.add('alarm', 'margin-bottom','display-flex');
    alarm.innerHTML = `
    <div class ="time">${time}</div>
    <button class= "btn stop-alarm" data-id= ${intervalId}>Stop</button>
    <button class= "btn delete-alarm" data-id= ${intervalId}>Delete</button> `;
    
    
    const deleteButton = alarm.querySelector('.delete-alarm');
    deleteButton.addEventListener('click',(e)=> deleteAlarm(e, time ,intervalId));

    const stopButton = alarm.querySelector('.stop-alarm');
    stopButton.addEventListener('click', (e) => stopAlarm(e, intervalId));


    // The 'prepend()' method is used to add the new 'alarm' element as the first child of 'alarmContainer'.
    alarmContainer.prepend(alarm);
}

 // function to stop the alarm
function stopAlarm(event, intervalId) {
    clearInterval(intervalId);
    alarmSound.pause();
    alarmSound.currentTime = 0;
}

// delete alarm
function deleteAlarm(event,time ,intervalId){
    const self = event.target;

    clearInterval(intervalId);

    const alarm = self.parentElement;
    console.log(time);

    deleteAlarmFromLocal(time);
    alarm.remove();
}

// delete alarm from local storage
function deleteAlarmFromLocal(time){
    const alarms = checkAlarms();

    const index = alarms.indexOf(time);
    alarms.splice(index,1);
    localStorage.setItem('alarms', JSON.stringify(alarms));
}



























