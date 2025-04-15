import type { DocumentEditor } from '@officesdk/web/server';

export function mockDocumentEditor(output: (message: string) => void): DocumentEditor {
  return {
    selection: {
      getRange: () => {
        return {
          start: 'mocked-start',
          end: 'mocked-end',
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
        };
      },
      setRange: () => {
        output('document.selection.setRange has been called');
      },
      addRangeListener: () => {
        output('document.selection.addRangeListener has been called');
      },
    },
    content: {
      save: () => {
        output('document.content.save has been called');
        return Promise.resolve();
      },
      addContentListener: () => {
        output('document.content.addContentListener has been called');
        return Promise.resolve();
      },
    },
  };
}
