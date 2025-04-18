import type { PresentationSlide } from '../../shared';

export function createPresentationSlideProxy(slide: PresentationSlide): PresentationSlide {
  return {
    get id() {
      return slide.id;
    },
    getIndex: () => {
      return slide.getIndex();
    },
    getShapes: () => {
      return slide.getShapes();
    },
  };
}
