const { app, BrowserWindow, screen, BrowserView, ipcMain} = require('electron');

let mainWindow;
let toolbar;
let webview;
let previousurl = '';
let currenturl = '';
let history = [];

function createWindow(){
    const primaryDisplay = screen.getPrimaryDisplay();
    const {width, height} = primaryDisplay.workAreaSize;

    mainWindow = new BrowserWindow({
        width: width,
        height:height,
        webPreferences:{nodeIntegration:true,contextIsolation:false}
    });

    toolbar = new BrowserView({
        webPreferences:{nodeIntegration:true,contextIsolation:false}});
    webview = new BrowserView();

    toolbar.setBounds({
        x:0,y:0,
        width:width,
        height:100});

    webview.setBounds({
        x:0,y:100,
        width:width,
        height:height-100});

    currenturl='https://www.google.com';
    toolbar.webContents.loadFile('index.html');
    webview.webContents.loadURL(currenturl);
    toolbar.webContents.send('urlupdate',{previous:'',current:currenturl});
    
    webview.webContents.on('did-navigate',(event,newurl)=> {navigate(newurl)});

    mainWindow.setBrowserView(toolbar);
    mainWindow.addBrowserView(webview);
    mainWindow.maximize();
    //mainWindow.on('resize',resizeView);
}

app.whenReady().then(()=>{
    createWindow();
});

//this function checks for a user to manually enter an URL
ipcMain.on('load-url',(event,typed_url)=>{
    previousurl = currenturl;
    currenturl = typed_url;
    webview.webContents.loadURL(typed_url);
    history.push(typed_url,'\n');

    toolbar.webContents.send('urlupdate',{previous:previousurl,current:currenturl});
    });

    //this function responds to a request to go BACK a page
ipcMain.on('askforurls',(event)=>{
    toolbar.webContents.send('currenturls',{previous:previousurl,current:currenturl})
});

//this function udates when a navigation occurs in the webview
function navigate(newurl){
    previousurl = currenturl;
    currenturl = newurl;
    history.push(newurl,'\n');
    toolbar.webContents.send('urlupdate',{previous:previousurl,current:currenturl});
}

//this function changes the size of the displayed content when the window size changes
function resizeView(){
    const {width: winWidth,height: winHeight} = mainWindow.getBounds();

    toolbar.setBounds({width:winWidth});
    webview.setBounds({width:winWidth,height:winHeight-100});
}

//this function opens a new window to display the history
ipcMain.on('gethistory',(event)=>{
    const historyWindow = new BrowserWindow({
        height:500,
        width:500,
        webPreferences:{nodeIntegration:true,contextIsolation:false}
    });

    historyWindow.webContents.loadFile('history_view.html');
    historyWindow.webContents.send('sendhistory',history);
})