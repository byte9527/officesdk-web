import type { PresentationSlides } from '../../shared';
import { createPresentationSlideProxy } from './slide';

export function createPresentationSlidesProxy(slides: PresentationSlides): PresentationSlides {
  return {
    getCurrentSlide: () => {
      return createPresentationSlideProxy(slides.getCurrentSlide());
    },
    setCurrentSlideIndex: (slideId) => {
      return slides.setCurrentSlideIndex(slideId);
    },
    getSlideIndex: (slideId) => {
      return slides.getSlideIndex(slideId);
    },
    getSlidesCount: () => {
      return slides.getSlidesCount();
    },
    getSlides: () => {
      return slides.getSlides().map((slide) => createPresentationSlideProxy(slide));
    },
    getSlideById: (slideId) => {
      return createPresentationSlideProxy(slides.getSlideById(slideId));
    },
    getSelectedSlides: () => {
      return slides.getSelectedSlides().map((slide) => createPresentationSlideProxy(slide));
    },
    setSelectedSlides: (ids) => {
      return slides.setSelectedSlides(ids);
    },
  };
}
