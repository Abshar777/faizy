export const hidePluginWindow=(state:boolean)=>{
  window.ipcRenderer.send("hide-plugin",{state})
}   