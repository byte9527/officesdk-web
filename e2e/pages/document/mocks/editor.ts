import type { DocumentEditor, DocumentRange } from '@officesdk/web/server';

export function mockDocumentEditor(output: (message: string) => void): DocumentEditor {
  const createRange = (start: string, end: string): DocumentRange => {
    return {
      start,
      end,
      isCaret: false,
      getText: () => {
        output('document.selection.getText has been called');
        return 'mocked-text';
      },
      setText: (text: string) => {
        output(`document.selection.setText has been called with text: ${text}`);
      },
      getHtml: () => {
        output('document.selection.getHtml has been called');
        return '<p>mocked-html</p>';
      },
      setHtml: (html: string) => {
        output(`document.selection.setHtml has been called with html: ${html}`);
      },
      getBounding: () => {
        output('document.selection.getBounding has been called');
        return {
          left: 0,
          top: 0,
          right: 100,
          bottom: 100,
          start: 20,
          end: 80,
        };
      },
    };
  };

  return {
    async ready() {
      return;
    },
    selection: {
      getRange: () => {
        return createRange('mocked-start', 'mocked-end');
      },
      setRange: () => {
        output('document.selection.setRange has been called');
      },
      addRangeListener: (listener) => {
        output('document.selection.addRangeListener has been called');
        setTimeout(() => {
          listener({
            start: 'changed-start',
            end: 'changed-end',
          });
        });
      },
      getWholeRange: () => {
        output('document.selection.getWholeRange has been called');
        return createRange('whole-start', 'whole-end');
      },
    },
    zoom: {
      getPercentage: () => {
        output('document.zoom.getPercentage has been called');
        return 100;
      },
      setPercentage: (percentage: number) => {
        output(`document.zoom.setPercentage has been called with percentage: ${percentage}`);
      },
      setFitMode: (mode: 'none' | 'window' | 'page') => {
        output(`document.zoom.setFitMode has been called with mode: ${mode}`);
      },
      getFitMode: () => {
        output('document.zoom.getFitMode has been called');
        return 'none';
      },
      zoomIn: () => {
        output('document.zoom.zoomIn has been called');
      },
      zoomOut: () => {
        output('document.zoom.zoomOut has been called');
      },
    },
    TOCs: {
      getAll: () => {
        output('document.TOCs.getAll has been called');
        return Promise.resolve([]);
      },
      getOne: () => {
        output('document.TOCs.getOne has been called');
        return Promise.resolve(null);
      },
      deleteAll: () => {
        output('document.TOCs.deleteAll has been called');
        return Promise.resolve(true);
      },
      deleteOne: () => {
        output('document.TOCs.deleteOne has been called');
        return Promise.resolve(true);
      },
      add: () => {
        output('document.TOCs.add has been called');
        return Promise.resolve(true);
      },
    },
    outline: {
      getContent: () => {
        output('document.outline.getContent has been called');
        return Promise.resolve([]);
      },
      addChangedListener: () => {
        output('document.outline.addChangedListener has been called');
        return () => {
          output('document.outline.addChangedListener has been removed');
        };
      },
      goto: () => {
        output('document.outline.goto has been called');
        return Promise.resolve(true);
      },
    },
  };
}
