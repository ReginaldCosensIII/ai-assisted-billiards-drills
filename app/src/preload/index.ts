import { contextBridge, ipcRenderer } from 'electron';
import { Drill, CalibrationCorners } from '@billiards/shared';

contextBridge.exposeInMainWorld('api', {
  sendDrillLayout: (layout: Drill['layout']) => ipcRenderer.send('sync-drill-layout', layout),
  onDrillLayoutUpdate: (callback: (layout: Drill['layout']) => void) => {
    const subscription = (_event: any, layout: Drill['layout']) => callback(layout);
    ipcRenderer.on('update-drill-layout', subscription);
    return () => ipcRenderer.removeListener('update-drill-layout', subscription);
  },
  sendCalibrationCorners: (corners: CalibrationCorners) => ipcRenderer.send('sync-calibration-corners', corners),
  onCalibrationCornersUpdate: (callback: (corners: CalibrationCorners) => void) => {
    const subscription = (_event: any, corners: CalibrationCorners) => callback(corners);
    ipcRenderer.on('update-calibration-corners', subscription);
    return () => ipcRenderer.removeListener('update-calibration-corners', subscription);
  }
});
