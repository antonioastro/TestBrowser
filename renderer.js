const { ipcRenderer} = require("electron");

const backBtn = document.getElementById('back');
const refreshBtn = document.getElementById('refresh');
const urlInput = document.getElementById('url');
const goButton = document.getElementById('go');
const printarea = document.querySelector('#print');


//Test Functions used for the HTML Toolbar during development (deleted as appropriate)
function testrefresh(){
  const printarea = document.querySelector('#print');
  printarea.textContent = 'You have pressed the refresh button!';
}

//Functions for new URL typed in manually:
function sendURL(){
  const printarea = document.querySelector('#print');
  const urlInput = document.getElementById('url');
  const typed_url = urlInput.value;
  ipcRenderer.send('load-url',typed_url);
}

ipcRenderer.on('urlupdate',(event,data)=>{
  const printprevurl = document.getElementById('previous');
  const printnewurl = document.getElementById('current');
  //printprevurl.textContent = `PREVIOUS:${data.previous}`
  //printnewurl.textContent = `CURRENT: ${data.current}`
});

//Functions for goback button:
function goback(){
  ipcRenderer.send('askforurls');
}

ipcRenderer.on('currenturls',(event,data)=>{
  ipcRenderer.send('load-url',data.previous);
});

//Functions for history button:
function gethistory(){
  ipcRenderer.send('gethistory');
}

ipcRenderer.on('sendhistory',(event,history)=>{
  const printhistory = document.querySelector('#readhistory');
  printhistory.textContent = history;
})
