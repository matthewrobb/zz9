import TVMaze from 'tvmaze';

const maze = new TVMaze();

const SearchController = {
  search: {
    description: 'returns an array of shows matching the search criteria',
    handler: async (request, reply) => {
      let shows = maze.findShows(request.query.q);
      reply (shows);
    }
  },

  episodes: {
    description: 'returns all of the episodes for the specified shows',
    handler: (request, reply) => {
      reply('list of episodes');
    }
  }
}

export default SearchController;
