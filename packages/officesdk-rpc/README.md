# @officesdk/rpc

A robust RPC (Remote Procedure Call) library for cross-window communication, purpose-built for Office SDK.

[![npm version](https://img.shields.io/npm/v/@officesdk/rpc.svg)](https://www.npmjs.com/package/@officesdk/rpc)
[![license](https://img.shields.io/npm/l/@officesdk/rpc.svg)](https://github.com/yourusername/officesdk/blob/main/LICENSE)

## Introduction

`@officesdk/rpc` is a powerful library specifically designed for handling cross-window/iframe communication with RPC (Remote Procedure Call) capabilities. It provides a comprehensive toolkit for establishing connections between different execution environments, serialising complex data structures, and performing remote method invocations.

Particularly suitable for:
- Communication between parent applications and embedded iframes
- Interaction between Office plugins and host applications
- Any scenario requiring secure cross-window communication

## Features

- **Simple, Elegant API** - Clean and intuitive client and server APIs
- **Type Safety** - Full TypeScript type support providing compile-time type checking
- **Data Serialisation** - Complex data structure serialisation through `Token` and `Transportable` classes
- **Error Handling** - Comprehensive error types and handling mechanisms
- **Connection Management** - Automatic handling of connection lifecycle and reconnection logic
- **Secure Communication** - Safe cross-window communication based on `penpal`

## Installation

```bash
npm install @officesdk/rpc
# or
yarn add @officesdk/rpc
```

## Basic Usage

### Client Example

```typescript
import { create } from '@officesdk/rpc';

// Define RPC method interface
interface ServerMethods {
  ping: () => Promise<string>;
  getData: (id: string) => Promise<any>;
}

// Create client connection
const client = create<ServerMethods>({
  iframe: document.getElementById('server-iframe') as HTMLIFrameElement,
  timeout: 5000,
});

// Connect to server
const connection = await client.connect();

// Call remote methods
const pong = await connection.ping();
console.log(pong); // Output: "pong"

const data = await connection.getData("123");
console.log(data);
```

### Server Example

```typescript
import { serve } from '@officesdk/rpc';

// Implement server methods
const methods = {
  ping: () => "pong",
  getData: async (id: string) => {
    // Logic to retrieve data
    return { id, name: "Example data" };
  }
};

// Create and start server
const server = serve({
  methods,
});

// Connect to client
await server.connect();
```

## Core Concepts

### Client and Server

- **Client**: Typically the parent window, responsible for initialising the connection and calling methods on the server
- **Server**: Typically the child window or iframe, implementing and exposing methods for the client to call

### Token

The `Token` class handles complex data serialisation, enabling reference types to be passed between different execution environments.

```typescript
import { Token } from '@officesdk/rpc';

const complexObject = {
  body: document.body,
  callback: () => console.log('Hello')
};

const methods ={
  getComplexObject: () => {
    // Define rules for serialisation
    return new Token(complexObject, {
      // The other side can call this callback
      callbacks: ['&.callback'],
      // The other side can pass this ref value through callbacks, but can't access its properties
      refs: ['&.body'],
    });
  }
}

const server = serve({
  methods,
});

server.connect()
```



## Advanced Usage

### Handling Callbacks

```typescript
import { create, serve } from '@officesdk/rpc';

// Server
const server = serve({
  methods: {
    subscribeToUpdates: (callback) => {
      const intervalId = setInterval(() => {
        callback({ time: new Date().toISOString() });
      }, 1000);
      
      return () => {
        // Return unsubscribe function
        clearInterval(intervalId);
      };
    }
  }
});

// Client
const client = create({ iframe });
const connection = await client.connect();

const unsubscribe = await connection.subscribeToUpdates((update) => {
  console.log('Update received:', update);
});

// Unsubscribe later
unsubscribe();
```

### Error Handling

```typescript
import { create, isPenpalConnectionTimeoutError } from '@officesdk/rpc';

try {
  const client = create({ iframe });
  await client.connect();
} catch (error) {
  if (isPenpalConnectionTimeoutError(error)) {
    console.error('Connection timed out');
  } else {
    console.error('An error occurred:', error);
  }
}
```

## API Reference

### Client API

#### `create<T>(options: ClientOptions): Client<T>`

Creates a client instance.

Parameters:
- `options`: Client configuration options
  - `iframe`: Target iframe element
  - `timeout`: Connection timeout in milliseconds
  - `debug`: Enable debug mode

Returns:
- `Client<T>` Client instance

#### `Client<T>`

Client interface.

Methods:
- `connect(): Promise<T>` - Connect to server
- `destroy(): void` - Destroy connection

### Server API

#### `serve<T>(options: ServerOptions): Server<T>`

Creates a server instance.

Parameters:
- `options`: Server configuration options
  - `methods`: Methods exposed to the client
  - `debug`: Enable debug mode

Returns:
- `Server<T>` Server instance

#### `Server<T>`

Server interface.

Methods:
- `connect(): Promise<T>` - Connect to client
- `destroy(): void` - Destroy connection

### Error Types

The library exports various error types and error checking functions:

- `isPenpalError` - Check if error is a Penpal error
- `isPenpalConnectionDestroyedError` - Check if connection was destroyed
- `isPenpalConnectionTimeoutError` - Check if connection timed out
- `isPenpalInvalidArgumentError` - Check if argument is invalid
- `isPenpalMethodCallTimeoutError` - Check if method call timed out
- `isPenpalMethodNotFoundError` - Check if method doesn't exist
- `isPenpalTransmissionFailedError` - Check if transmission failed
- `isClientNotAccessible` - Check if client is not accessible

## Architecture

The `@officesdk/rpc` library consists of the following main modules:

- **core** - Core types and functionality, including schema definitions and token handling
- **transport** - Responsible for data serialisation and RPC method definitions
- **connection** - Manages connections between different execution environments
- **errors** - Provides error types and handling utilities
- **utils** - Common utility functions

## Contributing

Issues and pull requests are welcome to help improve this library.

## Roadmap

- [ ] Finish this README with more examples
- [ ] Add unit tests
- [ ] Add error handling for more edge cases

## Licence

MIT
