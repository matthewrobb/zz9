import TVMaze from '../tvmaze.js';
import Show from '../Show.js';
import Episode from '../Episode.js';

const maze = new TVMaze();

const ShowController = {
  getAll: {
    description: 'returns all shows',
    handler: async (request, reply) => {
      let db = request.server.plugins['hapi-nedb-connector'].db;

      db('shows').find({}).sort({name: 1}).exec( (err, shows) => {
        reply(shows);
      });
    }
  },

  getOne: {
    description: 'returns one show',
    handler: async (request, reply) => {
      let db = request.server.plugins['hapi-nedb-connector'].db;

      db('shows').findOne({id: request.params.showId}).exec( (err, show) => {
        reply(show);
      });
    }
  },

  create: {
    description: 'adds a show',
    handler: (request, reply) => {
      let db = request.server.plugins['hapi-nedb-connector'].db;

      let addNewShow = async () => {
        let mazeShow = await maze.getShow(request.query.maze);

        let show = new Show(mazeShow);

        db('shows').insert(show, async (err, newDoc) => {
          reply('created')

          let mazeEpisodes = await maze.getEpisodes(request.query.maze);

          let episodes = mazeEpisodes.map( (mazeEpisode) => {
            return new Episode(mazeEpisode, newDoc);
          });

          db('episodes').insert(episodes, (err, newDocs) => {
            // episodes inserted
            if (err) {
              console.error(err);
            }
          });

        });

      }

      // make sure show doesn't already exist
      db('shows').findOne({mazeid: request.query.maze}, (err, show) => {
        if (!err && !show) {
          addNewShow();
        } else {
          reply('Show already exists');
        }
      });

    }
  },

  update: {
    description: 'updates a show',
    handler: async (request, reply) => {
      let db = request.server.plugins['hapi-nedb-connector'].db;

      db('shows').update({id: request.params.showId}).exec( (err, numReplaced) => {
        reply('updated');
      });
    }
  },

  remove: {
    description: 'deletes a show',
    handler: async (request, reply) => {
      let db = request.server.plugins['hapi-nedb-connector'].db;

      db('shows').update({id: request.params.showId}).exec( (err, numRemoved) => {

      });
    }
  }

}

export default ShowController;
