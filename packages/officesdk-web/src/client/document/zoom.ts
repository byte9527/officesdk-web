import type { RPCReturnMethods, RPCReturnMapProxy } from '@shimo/officesdk-rpc';
import type { DocumentMethods, DocumentZoom } from '../../shared';

export function createZoomFacade(methods: RPCReturnMethods<DocumentMethods>): RPCReturnMapProxy<DocumentZoom> {
  let zoomCache: Promise<RPCReturnMapProxy<DocumentZoom>> | null = null;

  const getZoom = async (): Promise<RPCReturnMapProxy<DocumentZoom>> => {
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
    setFitMode: async (fitMode: 'none' | 'window' | 'page'): Promise<void> => {
      const zoom = await getZoom();
      await zoom.setFitMode(fitMode);
    },
    getFitMode: async (): Promise<'none' | 'window' | 'page'> => {
      const zoom = await getZoom();
      return zoom.getFitMode();
    },
  };
}
