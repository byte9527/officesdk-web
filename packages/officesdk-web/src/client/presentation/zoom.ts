import type { RPCReturnMethods, RPCReturnMapProxy } from '@officesdk/rpc';
import type { PresentationMethods, PresentationZoom } from '../../shared';

export function createZoomFacade(methods: RPCReturnMethods<PresentationMethods>): RPCReturnMapProxy<PresentationZoom> {
  let zoomCache: Promise<RPCReturnMapProxy<PresentationZoom>> | null = null;

  const getZoom = async (): Promise<RPCReturnMapProxy<PresentationZoom>> => {
    if (zoomCache) {
      return zoomCache;
    }

    zoomCache = methods.getZoom();
    return zoomCache;
  };

  return {
    getPercentage: async (): Promise<number> => {
      const zoom = await getZoom();
      return zoom.getPercentage();
    },
    setPercentage: async (percentage: number): Promise<void> => {
      const zoom = await getZoom();
      await zoom.setPercentage(percentage);
    },
    zoomIn: async (): Promise<void> => {
      const zoom = await getZoom();
      await zoom.zoomIn();
    },
    zoomOut: async (): Promise<void> => {
      const zoom = await getZoom();
      await zoom.zoomOut();
    },
    setFitMode: async (fitMode: 'none' | 'window'): Promise<void> => {
      const zoom = await getZoom();
      await zoom.setFitMode(fitMode);
    },
    getFitMode: async (): Promise<'none' | 'window'> => {
      const zoom = await getZoom();
      return zoom.getFitMode();
    },
  };
}
