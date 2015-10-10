import TVMaze from 'tvmaze';
import Show from '../models/Show.js';
import Episode from '../models/Episode.js';

const maze = new TVMaze();

const ShowController = {
  getAll: {
    description: 'returns all shows',
    handler: async (request, reply) => {

      Show.find({}).sort({name: 1}).exec( (err, shows) => {
        reply(shows);
      });
    }
  },

  getOne: {
    description: 'returns one show',
    handler: async (request, reply) => {

      Show.findOne({_id: request.params.showId}).exec( (err, show) => {
        if (!show) return reply().code(404);
        reply(show);
      });
    }
  },

  create: {
    description: 'adds a show',
    handler: (request, reply) => {

      let addNewShow = async () => {
        let mazeShow = await maze.getShow(request.query.maze);

        let show = new Show({
          name: mazeShow.name,
          status: mazeShow.status,
          runtime: mazeShow.runtime,
          rage_id: mazeShow.externals.tvrage,
          tvmaze_id: mazeShow.id,
          tvdb_id: mazeShow.externals.thetvdb,
          //
          settings: {
            folder: '',
            seasonFolders: true,
            quality: [720,1080],
            subscription: true
          },
          wanted: true
        });

        Show.insert(show, async (err, newShow) => {
          reply('created');
          let mazeEpisodes = await maze.getEpisodes(request.query.maze);

          let episodes = mazeEpisodes.map( (mazeEpisode) => {
            return new Episode({
              name: mazeEpisode.name,
              season: mazeEpisode.season,
              number: mazeEpisode.number,
              airdate: new Date(mazeEpisode.airstamp),
              status: 'wanted',
              blacklist_urls: [],
              found_urls: [],
              show_id: newShow._id,
              rage_id: newShow.rage_id,
              tvmaze_id: newShow.tvmaze_id,
              tvdb_id: newShow.tvdb_id,
              summary: mazeEpisode.summary
            });
          });

          Episode.insert(episodes, (err, newDocs) => {
            // episodes inserted
            if (err) {
              console.error('err',err);
            }
          });

        });

      }

      // make sure show doesn't already exist
      Show.findOne({mazeid: request.query.maze}, (err, show) => {
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

      Show.update({id: request.params.showId}).exec( (err, numReplaced) => {
        reply('updated');
      });
    }
  },

  remove: {
    description: 'deletes a show',
    handler: async (request, reply) => {
      let db = request.server.plugins['hapi-nedb-connector'].db;

      Show.findOne({_id: request.params.showId}).exec( (err, show) => {
        if (!show) return reply().code(404);

        Episode.find({show_id: request.params.showId}).exec( (err, episodes) => {
          show.remove(function() {
            reply();
          })
        })

      });
    }
  }

}

export default ShowController;
