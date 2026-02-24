export type WebPreferencesType {
    nodeIntegration: boolean,
    contextIsolation: boolean,
    preload: string
}

export interface BrowserWindowOptions {
    width: number,
    height: number,
    title: string,
    webPreferences: WebPreferencesType
}