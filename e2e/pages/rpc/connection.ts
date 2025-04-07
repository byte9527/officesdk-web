import './connection.css';

import { createClient } from './client';
import { createServerFrame } from './frames';

async function createConnection(): Promise<void> {
  const iframe = document.createElement('iframe');
  createClient(iframe);
  createServerFrame(iframe);
}

createConnection();
