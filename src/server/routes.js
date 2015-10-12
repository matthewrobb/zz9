import InfoController from './controllers/InfoController.js';
import ShowController from './controllers/ShowController.js';
import ProviderController from './controllers/ProviderController.js';

const routes = [

  { method: 'GET', path: '/api/info', config: InfoController.search },
  { method: 'GET', path: '/api/info/shows/{showId}', config: InfoController.episodes },

  // shows
  { method: 'GET', path: '/api/shows', config: ShowController.getAll },
  { method: 'POST', path: '/api/shows', config: ShowController.create },
  { method: 'GET', path: '/api/shows/{showId}', config: ShowController.getOne },
  { method: 'GET', path: '/api/shows/{showId}/episodes', config: ShowController.getAllEpisodes },
  { method: 'PUT', path: '/api/shows/{showId}', config: ShowController.update },
  { method: 'DELETE', path: '/api/shows/{showId}', config: ShowController.remove },

  // provider
  { method: 'GET', path: '/api/providers', config: ProviderController.getAll },
  { method: 'POST', path: '/api/providers', config: ProviderController.create },
  { method: 'GET', path: '/api/providers/{providerId}', config: ProviderController.getOne },
  { method: 'PUT', path: '/api/providers/{providerId}', config: ProviderController.update },
  { method: 'DELETE', path: '/api/providers/{providerId}', config: ProviderController.remove }

];

export default routes;
