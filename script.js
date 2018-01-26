/**
*
* Script for Web Chat!
* By Brian Hall
* 10/20/2017
*
**/
var modals = [];
var lastPost;
var chatBackup;
var versionInfo = '1.0.0';
var characterName = '';

function confirmExit() {
  return "Write something clever here...";
}

// store the chat log and post for the undo function.
function setUndoVars(){
  chatBackup = document.getElementById("sessionArea").innerHTML;
  lastPost = document.getElementById('postBox').innerHTML;
}
function playPostSound(){
  var sound = new Audio('sounds/Beep13.wav');
  sound.volume = 0.2;
  sound.play();
}

function clearChat(){
  if (document.getElementById('sessionArea').innerHTML != ''){
    if (confirm('Are you sure you want to start a new session without saving?')){
      document.getElementById('sessionArea').innerHTML = '';
    } else {

    }
  }
}

// reset the chat log and put the last post back in the post box
function undoPost(){
  document.getElementById("sessionArea").innerHTML = chatBackup;
  document.getElementById('postBox').innerHTML = lastPost;
}

/*
*
* Post submisssion section
*
*/

// function to move post content into chat session window
function addPost(){
    //find our editor, save it's contents, and grab the contents for the div
    var timestamp = new Date();
    var postContents = document.getElementById('postBox').innerHTML;
    var currentPosts = document.getElementById("sessionArea").innerHTML;
    var characterName = document.getElementById("nameBox").innerHTML;

    // set the undo variables
    setUndoVars();

    //don't send blank posts
    if ( $('#postBox').text() != '' && document.getElementById('postBox').innerHTML != '<br>') {
      //check to see if its a gm post, if so, style it
      // Will be replaced in protocols
      if (postContents.substr(0,3)=='/gm'){
        postContents = postContents.replace(/\/gm /, '');
        document.getElementById("sessionArea").innerHTML=currentPosts +
        '<div class="post postGM wordwrap">' + timeStamp() + '<br>'+ postContents + '</div>' + "<br>";
      // if not, just post
      } else {
        if (characterName == ''){
          document.getElementById("sessionArea").innerHTML=currentPosts +
          '<div class="post wordwrap">' + timeStamp() + '<br>'+ postContents + "</div>";
        }else {
          document.getElementById("sessionArea").innerHTML=currentPosts +
        '<div class="post wordwrap">' + characterName + " " + timeStamp() + '<br>'+ postContents + "</div>";
        }
        
      }
      //call the scroll function and reset the editor's contents
      setScroll();
      document.getElementById('postBox').innerHTML = '';
      document.getElementById("nameBox").innerHTML = '';
      playPostSound();
    }
}

/**
*
* set the focus of the div to the bottom
*
**/

function setScroll() {
  var divA = document.getElementById("sessionArea");
  divA.scrollTop = divA.scrollHeight;

}

/*
*
*Save the chat log (legacy version)
*
*/

/*
function downloadInnerHtml(filename, elId, mimeType) {
    var elHtml = document.getElementById(elId).innerHTML;
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';

    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click();
} 

var fileName =  'tags.html'; // You can use the .txt extension if you want

function openFile() {
  document.getElementById('file-input').click();
  var fileInput = document.getElementById('file-input').file;
  var chatWindow = document.getElementById("sessionArea");
  var preview = document.querySelector('.preview');
}

// Was this for testing?
function postFile() {
    window.alert(document.getElementById('file-input').file);
}
*/

/**
*
* modal scripting (popouts)
*
**/
function openDialog() {
  // Get the modal
  var modal = document.getElementById('openModel');

  // Get the button that opens the modal
  var btn = document.getElementById("openButton");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
}
// When the user clicks on the button, open the modal
function showModal(modal) {
  modal.style.display = "block";
  modals.push(modal);
  //set the default file name for saving
  document.getElementById('inputFileNameToSaveAs').value = 'log_' + fileTimeStamp();

  
  /* ---No longer used---
  if(document.getElementById('sessionArea').innerHTML == ''){
      modal.style.display = "block";
      modals.push(modal);
  } else {
    if (confirm('Are you sure you want to load a new file? Any unsaved changes will be lost.')){
      modal.style.display = "block";
      modals.push(modal);
    } else {
      //do nothing
    }
  } */
}

// When the user clicks on <span> (x), close the modal
function closeModalButton(modal) {
    modal.style.display = "none";
    resetOpenFileText();
    document.getElementById('fileToLoad').value = '';
    var index = modals.indexOf(modal);
    if (index > -1){
      modals.splice(index, 1);
    }
}
// Reset the open file ui text
function resetOpenFileText(){
  document.getElementById('openFileText').innerHTML = 'Select a file to load, and click load file.';
}

/**
*
* Saving/Loading the chat log to a .html
*
**/
function saveTextAsFile()
{
    var textToSave = document.getElementById("sessionArea").innerHTML;
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/html"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value;
    var downloadLink = document.createElement("a");

    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
}

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}

function loadFileAsText()
{
if(confirm('Are you sure you want to load a new file? Any unsaved changes will be lost.')){
      var fileToLoad = document.getElementById("fileToLoad").files[0];
      var modal = document.getElementById('openModal');
if (!fileToLoad == ''){
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent)
      {
          var textFromFileLoaded = fileLoadedEvent.target.result;
          document.getElementById("sessionArea").innerHTML = textFromFileLoaded;
      };
      fileReader.readAsText(fileToLoad, "UTF-8");
      modal.style.display="none";
      document.getElementById('fileToLoad').value = '';
    } else {
      var message = document.getElementById('openFileText');
      message.innerHTML = message.innerHTML + '<br> <span style="color:red;">*No file selected.</span>';
    }
      //Do nothing
  }
}

/**
*
* Return timestamp for posts
* @type {Date}
*
**/
function timeStamp() {
// Create a date object with the current time
  var now = new Date();

// Create an array with the current month, day and time
  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

// Create an array with the current hour, minute and second
  var time = [ now.getHours(), now.getMinutes() ];

// Determine AM or PM suffix based on the hour
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";

// Convert hour from military time
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;

// If hour is 0, set it to 12
  time[0] = time[0] || 12;

// If seconds and minutes are less than 10, add a zero
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }

// Return the formatted string
  //return date.join("/") + " " + time.join(":") + " " + suffix;
  return '<span class="timeStamp">[' + date.join(".") + ' ' + " " + time.join(":") + suffix + ']</span>';
}

// Timestamp for saving a file
function fileTimeStamp() {
  // Create a date object with the current time
    var now = new Date();
  
  // Create an array with the current month, day and time
    var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
  
  // Create an array with the current hour, minute and second
    var time = [ now.getHours(), now.getMinutes() ];
  
  // Determine AM or PM suffix based on the hour
    var suffix = ( time[0] < 12 ) ? "AM" : "PM";
  
  // Convert hour from military time
    time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
  
  // If hour is 0, set it to 12
    time[0] = time[0] || 12;
  
  // If seconds and minutes are less than 10, add a zero
    for ( var i = 1; i < 3; i++ ) {
      if ( time[i] < 10 ) {
        time[i] = "0" + time[i];
      }
    }
  
  // Return the formatted string
    //return date.join("/") + " " + time.join(":") + " " + suffix;
    return time.join("") + suffix + date.join("");
  }

  function diceRoller() {
    // Pick [# DICE], [#SIDES] and roll the dice. Send result to chat.

    // Math variables
    var numDice = document.getElementById("diceNumBox").innerHTML;
    var numSides = document.getElementById("diceSidesBox").innerHTML;
    var total = 0;
    var runningTotal;
    var result;

    // Array and loop variables
    var rolls = [];
    var html = [];
    var i = 0;

    // String builder variables
    var whoRolled = document.getElementById("diceNameBox").innerHTML;
    var currentPosts = document.getElementById("sessionArea").innerHTML;

    // Add a roll to the array for each die
    for (i = 0; i < numDice; i++) {
      document.getElementById("d20Result");
      var result = Math.floor(Math.random()*numSides+1);
      total = total + result;
      rolls.push(result);
    }
    
    // add leading details to the html array
    html.push('<div class="post wordwrap">' + "Game Master" + " " + timeStamp() + '<br>' + 
    whoRolled + " rolled " + numDice + " d" + numSides);

    html.push(": "+ rolls.join(", ") + " total: " + total)

    html.push(".</div>")

    document.getElementById("diceResultBox").innerHTML = rolls.join(", ") + " total: " + total;

    document.getElementById("sessionArea").innerHTML=currentPosts + html.join("");

    setScroll();
  }
