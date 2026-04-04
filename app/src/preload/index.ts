import { contextBridge, ipcRenderer } from 'electron';
import { Drill } from '@billiards/shared';

contextBridge.exposeInMainWorld('api', {
  sendDrillLayout: (layout: Drill['layout']) => ipcRenderer.send('sync-drill-layout', layout),
  onDrillLayoutUpdate: (callback: (layout: Drill['layout']) => void) => {
    const subscription = (_event: any, layout: Drill['layout']) => callback(layout);
    ipcRenderer.on('update-drill-layout', subscription);
    return () => ipcRenderer.removeListener('update-drill-layout', subscription);
  }
});
