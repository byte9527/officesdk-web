import './connection.css';

import { createClient } from './client';
import { createServerFrame } from './frames';
import { createRenderTitle, createRenderContent } from '../shared/renderer';

function createClientFirstConnection(content: HTMLElement): void {
  const iframe = document.createElement('iframe');
  createClient(content, iframe);
  createServerFrame(content, iframe);
}

function createServerFirstConnection(content: HTMLElement): void {
  const iframe = createServerFrame(content);
  createClient(content, iframe);
}

function createMultipleClients(content: HTMLElement): void {
  const iframe = createServerFrame(content);
  createClient(content, iframe);
  createClient(content, iframe);
}

function main(): void {
  const root = document.getElementById('root');

  if (!root) {
    throw new Error('root element not found');
  }

  const renderTitle = createRenderTitle({ container: root });
  const renderContent = createRenderContent({ container: root });

  renderTitle('Create server first then client');
  createServerFirstConnection(
    renderContent({
      height: 64,
    }),
  );

  renderTitle('Create client first then server');
  createClientFirstConnection(
    renderContent({
      height: 64,
    }),
  );

  renderTitle('Create multiple clients');
  createMultipleClients(
    renderContent({
      height: 64,
    }),
  );
}

main();
