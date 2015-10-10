import {Server} from 'hapi';

import routes from './routes.js';



const server = new Server();

server.connection({
  host: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || 8000
});

server.register(
  [
    {
			register: require('hapi-nedb-connector'),
	    options: {
	      directory: 'data/'
	    }
		},
    {
      register: require('./worker.js')
    }
  ],
  (err) => {

    if (err) {
      console.error('Failed to load plugin:', err);
    }

    // add routes
    server.route(routes);

  }
);

server.start( ()=> {
  console.info('==> ✅  Server is listening');
  console.info('==> 🌎  Go to ' + server.info.uri.toLowerCase());
})
