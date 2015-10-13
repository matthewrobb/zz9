import {Server} from 'hapi';

import routes from './routes.js';
import TaskWorker from './TaskWorker';

const server = new Server();

server.connection({
  host: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || 8000,
  routes: { cors: true}
});

server.register(
  [
    require('inert')
  ],
  (err) => {
    if (err) {
      console.error('Failed to load plugin:', err);
    }

    // add routes
    server.route(routes);

    server.route({
      method: 'GET',
      path: '/nzbsorg.xml',
      handler: (request, reply) => {
        reply.file('./testdata/nzbsorg.xml');
      }
    });
  }
);

server.start( ()=> {
  console.info('==> ✅  Server is listening');
  console.info('==> 🌎  Go to ' + server.info.uri.toLowerCase());

  // start task worker
  const taskWorker = new TaskWorker();
  taskWorker.start();
});
