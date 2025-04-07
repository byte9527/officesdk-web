import './connection.css';

import { createClient } from './client';
import { createServerFrame } from './frames';

async function createConnection(): Promise<void> {
  const iframe = createServerFrame();
  createClient(iframe);
}

createConnection();
