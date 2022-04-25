import app from './src/app';
import { PORT } from './src/utils/config';
import http from 'http';
import { socket } from './src/socket';

//Start express app
const server = http.createServer(app);
//Start Socket.io app
socket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});