import type { PresentationEditor, PresentationTextRangeValue } from '@officesdk/web/server';

export function mockPresentationEditor(output: (message: string) => void): PresentationEditor {
  return {
    slides: {
      getCurrentSlide: () => {
        output('presentation.slides.getCurrentSlide has been called');
        return {
          id: 'slide-1',
          getIndex: () => {
            output('presentation.slide.getIndex has been called');
            return 0;
          },
          getShapes: () => {
            output('presentation.slide.getShapes has been called');
            return [
              {
                id: 'shape-1',
              },
            ];
          },
        };
      },
      setCurrentSlideIndex: (slideId: string) => {
        output(`presentation.slides.setCurrentSlideIndex has been called with slideId: ${slideId}`);
      },
      getSlideIndex: (slideId: string) => {
        output(`presentation.slides.getSlideIndex has been called with slideId: ${slideId}`);
        return 0;
      },
      getSlidesCount: () => {
        output('presentation.slides.getSlidesCount has been called');
        return 10;
      },
      getSlides: () => {
        output('presentation.slides.getSlides has been called');
        return [
          {
            id: 'slide-1',
            getIndex: () => 0,
            getShapes: () => [{ id: 'shape-1' }],
          },
          {
            id: 'slide-2',
            getIndex: () => 1,
            getShapes: () => [{ id: 'shape-2' }],
          },
        ];
      },
      getSlideById: (slideId: string) => {
        output(`presentation.slides.getSlideById has been called with slideId: ${slideId}`);
        return {
          id: slideId,
          getIndex: () => 0,
          getShapes: () => [{ id: 'shape-1' }],
        };
      },
      getSelectedSlides: () => {
        output('presentation.slides.getSelectedSlides has been called');
        return [
          {
            id: 'slide-1',
            getIndex: () => 0,
            getShapes: () => [{ id: 'shape-1' }],
          },
        ];
      },
      setSelectedSlides: (ids: string[]) => {
        output(`presentation.slides.setSelectedSlides has been called with ids: ${JSON.stringify(ids)}`);
      },
    },
    selection: {
      getTextRange: () => {
        output('presentation.selection.getTextRange has been called');
        return {
          start: 'start-position',
          end: 'end-position',
          getText: () => {
            output('presentation.selection.range.getText has been called');
            return 'mocked-text';
          },
          getHtml: () => {
            output('presentation.selection.range.getHtml has been called');
            return '<p>mocked-html</p>';
          },
          setText: (text: string) => {
            output(`presentation.selection.range.setText has been called with text: ${text}`);
          },
          setHtml: (html: string) => {
            output(`presentation.selection.range.setHtml has been called with html: ${html}`);
          },
        };
      },
      setTextRange: (range: PresentationTextRangeValue | null) => {
        output(`presentation.selection.setTextRange has been called with range: ${JSON.stringify(range)}`);
      },
      getSelectedShapes: () => {
        output('presentation.selection.getSelectedShapes has been called');
        return [{ id: 'shape-1' }];
      },
      setSelectedShapes: (ids: string[] | null) => {
        output(`presentation.selection.setSelectedShapes has been called with ids: ${JSON.stringify(ids)}`);
      },
      addRangeListener: (listener: (range: PresentationTextRangeValue) => void) => {
        output('presentation.selection.addRangeListener has been called');
        setTimeout(() => {
          listener({
            start: 'changed-start',
            end: 'changed-end',
          });
        });
      },
    },
    zoom: {
      getPercentage: () => {
        output('presentation.zoom.getPercentage has been called');
        return 100;
      },
      setPercentage: (percentage: number) => {
        output(`presentation.zoom.setPercentage has been called with percentage: ${percentage}`);
      },
      setFitMode: (mode: 'none' | 'window') => {
        output(`presentation.zoom.setFitMode has been called with mode: ${mode}`);
      },
      getFitMode: () => {
        output('presentation.zoom.getFitMode has been called');
        return 'none';
      },
      zoomIn: () => {
        output('presentation.zoom.zoomIn has been called');
      },
      zoomOut: () => {
        output('presentation.zoom.zoomOut has been called');
      },
    },
    content: {
      save: () => {
        output('presentation.content.save has been called');
      },
      addContentListener: (listener) => {
        output('presentation.content.addContentListener has been called');
        setTimeout(() => {
          listener({
            timestamp: Date.now(),
            id: 'content-change-1',
          });
        });
      },
    },
  };
}
