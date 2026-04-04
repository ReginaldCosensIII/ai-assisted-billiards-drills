import { Drill } from '@billiards/shared';

declare global {
  interface Window {
    api: {
      sendDrillLayout: (layout: Drill['layout']) => void;
      onDrillLayoutUpdate: (callback: (layout: Drill['layout']) => void) => () => void;
    }
  }
}
