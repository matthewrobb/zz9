import InfoController from './controllers/InfoController.js';
import ShowController from './controllers/ShowController.js';

const routes = [

  { method: 'GET', path: '/api/info', config: InfoController.search },
  { method: 'GET', path: '/api/info/shows/{showId}', config: InfoController.episodes },

  // shows
  { method: 'GET', path: '/api/shows', config: ShowController.getAll },
  { method: 'POST', path: '/api/shows', config: ShowController.create },
  { method: 'GET', path: '/api/shows/{showId}', config: ShowController.getOne },
  { method: 'PUT', path: '/api/shows/{showId}', config: ShowController.update },
  { method: 'DELETE', path: '/api/shows/{showId}', config: ShowController.remove }

];

export default routes;
