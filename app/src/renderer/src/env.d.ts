/// <reference types="vite/client" />

import { Drill, CalibrationCorners } from '@billiards/shared';

declare global {
  interface Window {
    api: {
      sendDrillLayout: (layout: Drill['layout']) => void;
      onDrillLayoutUpdate: (callback: (layout: Drill['layout']) => void) => () => void;
      sendCalibrationCorners: (corners: CalibrationCorners) => void;
      onCalibrationCornersUpdate: (callback: (corners: CalibrationCorners) => void) => () => void;
    }
  }
}
