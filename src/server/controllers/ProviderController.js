import Provider from '../models/Provider';

const ProviderController = {

  getAll: {
    description: 'returns a collection of Providers',
    handler: async (request, reply) => {
      const providers = Provider.findAsync({});
      reply(providers);
    }
  },

  getOne: {
    description: 'returns one Provider',
    handler: async (request, reply) => {
      const provider = await Provider.findOneAsync({_id: request.params.providerId});

      if (provider) {
        return reply(provider);
      }

      return reply('no matching providers found').code(404);
    }
  },

  create: {
    description: 'creates a new Provider',
    handler: async (request, reply) => {
      console.log('create');
      // create new provider
      const newProvider = new Provider(request.payload, {});
      console.log(newProvider.url)
      // check if provider exists
      const existingProvider = await Provider.findOneAsync({url: newProvider.url});
      console.log('exist', existingProvider);
      if (existingProvider) return reply('provider already exists').code('400');

      try {
        await Provider.insertAsync(newProvider);
        reply('new provider created').created();
      } catch (err) {
        console.log(err);
      }

      reply('error creating provider').code(500);
    }
  },

  update: {
    description: 'updates a Provider',
    handler: (request, reply) => {
      reply().code(204);
    }
  },

  remove: {
    description: 'deletes a Provider',
    handler: (request, reply) => {
      reply('deleted a Provider');
    }
  }

};

export default ProviderController;
