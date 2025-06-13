# Office SDK RPC

## Overview

This package is a RPC library for the Office SDK. It is used to communicate between the main window and the iframe.
Based on the [penpal](https://github.com/Aaronius/penpal) library.

# Office SDK WEB

## Usage

### Install

#### Using npm
Install Penpal from npm as follows:

```bash
npm install @officesdk/web
```

#### Using a CDN
Install @officesdk/web from npm as follows:

```bash
<script src="https://unpkg.com/@officesdk/web@^1/umd/index.js"></script>
```

### Create SDK Instance

You can create an SDK instance using the `createSDK` method. Below is an example:

```typescript
import { createSDK, EditorModeType, EditorStandardRole, FileType } from '@officesdk/web';

async function loadSDK() {
  const sdk = createSDK({
    // The endpoint to connect to
    endpoint: `https://example.com`, 
    // Custom page path (optional)
    path: '', 
    // File type (e.g., FileType.Document), 
    fileType: FileType.Document,
    // Authentication token
    token: 'token-xxx', 
    // File ID
    fileId: 'fileId-xxx', 
    // Editor mode
    mode: EditorModeType.Standard, 
    // Role in standard mode
    role: EditorStandardRole.Editor, 
    // Root element to load the SDK iframe
    root: el, 
    // Custom user params
    userQuery: {
      userName: 'John Doe', 
      userId: '1234', 
    },
    // initial setting
    settings: {
      menu: {
        custom: [
          { type: 'link', url: 'https://www.example.com', text: 'Example Link', name: 'exampleLink' },
          {
            name: 'exampleButton',
            type: 'button',
            label: 'Example Button',
            callback: (): void => {
              console.log('Button clicked');
            },
          },
        ],
      },
    },
  });
  // Connect to the SDK
  const document = await sdk.connect();

  // call api
  document.getSelection()
}

```

### SDK Options

Here are the options you can pass to `createSDK`:

- **endpoint**: The server endpoint to connect to.
- **token**: Authentication token for the SDK.
- **fileId**: The ID of the file to be loaded.
- **path**: (Optional) Custom page path.
- **fileType**: The type of file (e.g., document, spreadsheet, presentation, etc.).
- **root**: (Optional) The root DOM element where the iframe will be loaded.
- **userQuery**: (Optional) Custom user parameters as key-value pairs.
- **lang**: (Optional) Language setting (`zh-CN` or `en-US`).
- **mode**: (Optional) Editor mode (e.g., `Standard`).
- **role**: (Optional) Role in `Standard` mode (e.g., `Editor`).
- **settings**: (Optional) Initialization settings, such as custom menus.

### SDK Methods

- **connect()**: Connects to the SDK and returns a promise with the SDK instance.
- **destroy()**: Destroys the SDK instance and removes the iframe.
- **url**: The URL loaded in the iframe.

