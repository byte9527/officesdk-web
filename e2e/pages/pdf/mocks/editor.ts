import type { PdfEditor } from '@officesdk/web/server';

export function mockPdfEditor(output: (message: string) => void): PdfEditor {
  return {
    pages: {
      getCurrentPageNumber: () => {
        output('pdf.pages.getCurrentPageNumber has been called');
        return 1;
      },
      setCurrentPage: (page: number) => {
        output(`pdf.pages.setCurrentPage has been called with page: ${page}`);
      },
      getPagesCount: () => {
        output('pdf.pages.getPagesCount has been called');
        return 10;
      },
      getPage: (page: number) => {
        output(`pdf.pages.getPage has been called with page: ${page}`);
        return Promise.resolve({
          pageNumber: page,
          getPageSize: () => {
            output('pdf.page.getPageSize has been called');
            return { width: 595, height: 842 }; // A4 size in points
          },
        });
      },
    },
    selection: {
      getRange: (value) => {
        output('pdf.selection.getRange has been called');
        return value
          ? {
              start: value.start,
              end: value.end,
              getText: () => {
                output('pdf.selection.range.getText has been called');
                return 'mocked-text';
              },
              getHtml: () => {
                output('pdf.selection.range.getHtml has been called');
                return '<p>mocked-html</p>';
              },
            }
          : null;
      },
      setRange: (value) => {
        output(`pdf.selection.setRange has been called with value: ${JSON.stringify(value)}`);
      },
      addRangeListener: (listener) => {
        output('pdf.selection.addRangeListener has been called');
        setTimeout(() => {
          listener({
            start: 'changed-start',
            end: 'changed-end',
          });
        });
      },
    },
    outline: {
      getContent: () => {
        output('pdf.outline.getContent has been called');
        return Promise.resolve([
          {
            id: '1',
            level: 0,
            content: { text: 'Chapter 1' },
          },
          {
            id: '2',
            level: 1,
            content: { text: 'Section 1.1' },
          },
        ]);
      },
      addChangedListener: (listener) => {
        output('pdf.outline.addChangedListener has been called');
        setTimeout(() => {
          listener([
            {
              id: '1',
              level: 0,
              content: { text: 'Chapter 1' },
            },
          ]);
        }, 0);

        return () => {
          output('pdf.outline.removeChangedListener has been called');
        };
      },
      goto: (id: string) => {
        output(`pdf.outline.goto has been called with id: ${id}`);
        return Promise.resolve(true);
      },
    },
  };
}
