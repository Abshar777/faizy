

export const onCloseApp = () => window.ipcRenderer.send('close-app')

export const onOpenApp = () => window.ipcRenderer.send('open-app', {state: false})