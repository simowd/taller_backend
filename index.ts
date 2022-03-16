import app from './src/app';
import { PORT } from './src/utils/config';
import http from 'http';

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});