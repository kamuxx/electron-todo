import type  {BrowserWindowOptions} from "@types/browser";
import { fileURLToPath } from "node:url";
import {app, BrowserWindow} from "electron";
import electronUpdater, { type AppUpdater, type UpdateCheckResult } from 'electron-updater';

import log from 'electron-log';

import path  from "node:path";

let autoUpdater: AppUpdater | null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWin: BrowserWindow | null;
let optionsWindow: BrowserWindowOptions = {
    width: 1366,
    height:768,
    title: "Todo App",
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: path.join(__dirname, "../preload.ts")
    }

}
const CreateWindow = () => {
    mainWin = new BrowserWindow(optionsWindow)
    mainWin.loadURL("http://localhost:5173")
}

const UpdateApp = ():boolean => {

    if(!autoUpdater) return false;
    //autoUpdater.autoInstallOnAppQuit = false;
   
   return autoUpdater.isUpdaterActive();
}

const checkUpdate = async (): Promise<UpdateCheckResult | null> => {
    if(!autoUpdater) return null;
    return await autoUpdater.checkForUpdates();
}

function getAutoUpdater(): AppUpdater {   
   const { autoUpdater } = electronUpdater;
   return autoUpdater;
}


export default function Init(){
    autoUpdater = getAutoUpdater();
    app.whenReady().then(CreateWindow);

    app.on('window-all-closed',()=> {
        app.quit();        
    })

    app.on('activate',() => {
        if(BrowserWindow.getAllWindows().length === 0){
            CreateWindow();
        }
    })

    autoUpdater.on('checking-for-update',async () => {
        log.info("Checking for update-available");
        const updateAvailable = await checkUpdate();
        if(mainWin && updateAvailable){
            mainWin.webContents.send('update-available',updateAvailable.isUpdateAvailable);
        }
    });

    
    
}