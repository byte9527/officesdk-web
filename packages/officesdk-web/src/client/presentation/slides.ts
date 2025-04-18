import type { RPCReturnMethods, RPCReturnMapProxy } from '@shimo/officesdk-rpc';
import type { PresentationMethods, PresentationSlides, PresentationSlide } from '../../shared';

export function createSlidesFacade(
  methods: RPCReturnMethods<PresentationMethods>,
): RPCReturnMapProxy<PresentationSlides> {
  let slidesCache: Promise<RPCReturnMapProxy<PresentationSlides>> | null = null;

  const getSlides = async (): Promise<RPCReturnMapProxy<PresentationSlides>> => {
    if (slidesCache) {
      return slidesCache;
    }

    slidesCache = methods.getSlides();
    return slidesCache;
  };

  return {
    getCurrentSlide: async (): Promise<RPCReturnMapProxy<PresentationSlide>> => {
      const slides = await getSlides();
      return slides.getCurrentSlide();
    },
    setCurrentSlideIndex: async (slideId: string): Promise<void> => {
      const slides = await getSlides();
      await slides.setCurrentSlideIndex(slideId);
    },
    getSlideIndex: async (slideId: string): Promise<number> => {
      const slides = await getSlides();
      return slides.getSlideIndex(slideId);
    },
    getSlidesCount: async (): Promise<number> => {
      const slides = await getSlides();
      return slides.getSlidesCount();
    },
    getSlides: async (): Promise<RPCReturnMapProxy<PresentationSlide>[]> => {
      const slides = await getSlides();
      return slides.getSlides();
    },
    getSlideById: async (slideId: string): Promise<RPCReturnMapProxy<PresentationSlide>> => {
      const slides = await getSlides();
      return slides.getSlideById(slideId);
    },
    getSelectedSlides: async (): Promise<RPCReturnMapProxy<PresentationSlide>[]> => {
      const slides = await getSlides();
      return slides.getSelectedSlides();
    },
    setSelectedSlides: async (ids: string[]): Promise<void> => {
      const slides = await getSlides();
      await slides.setSelectedSlides(ids);
    },
  };
}
