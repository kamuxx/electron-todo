import type  {BrowserWindowOptions} from "@types/browser";
import { fileURLToPath } from "node:url";
import {app, BrowserWindow} from "electron";
import path  from "node:path";

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


export default function Init(){
    app.whenReady().then(CreateWindow);

    app.on('window-all-closed',()=> {
        app.quit();        
    })

    app.on('activate',() => {
        if(BrowserWindow.getAllWindows().length === 0){
            CreateWindow();
        }
    })
}