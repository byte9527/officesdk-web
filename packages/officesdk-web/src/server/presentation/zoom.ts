import type { PresentationZoom } from '../../shared';

export function createPresentationZoomProxy(zoom: PresentationZoom): PresentationZoom {
  return {
    getPercentage: () => {
      return zoom.getPercentage();
    },
    setPercentage: (percentage) => {
      return zoom.setPercentage(percentage);
    },
    setFitMode: (mode) => {
      return zoom.setFitMode(mode);
    },
    getFitMode: () => {
      return zoom.getFitMode();
    },
    zoomIn: () => {
      return zoom.zoomIn();
    },
    zoomOut: () => {
      return zoom.zoomOut();
    },
  };
}
