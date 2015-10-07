import parser from 'xml2json';
import request from 'request';
import _ from 'lodash';
import download from './download.js';
import fs from 'fs';
import Sabnzbd from './sabnzbd.js';
import config from '../config.json';
import bluebird from 'bluebird';
bluebird.promisifyAll(fs);

var url = config.testurl;

let xml = fs.readFileSync('./nzbsorg.xml', 'utf8');

let sab = new Sabnzbd(config.sabnzbd.apikey, config.sabnzbd.host, config.sabnzbd.port, config.sabnzbd.https);

let get = (url) => {
  return new Promise ( (resolve, reject) => {

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
      reject(error);
    });
  });

}

let getEpisodes = (db,options) => {
  return new Promise ( (resolve, reject) => {
    db('episodes').find(options).sort({}).exec( async (err, episodes) => {
      if (err) {
        reject(err);
      } else {
        resolve(episodes);
      }
    });
  });
};

let getShows = (db) => {
  return new Promise ( (resolve, reject) => {
    db('shows').find({}).sort({}).exec( async (err, shows) => {
      if (err) {
        reject(err);
      } else {
        let showArray = _.indexBy(shows, '_id');
        resolve(showArray);
      }
    });
  });
};

let newznab = async () => {
  let feed = await get(url);
  let json = JSON.parse(parser.toJson(xml));

  let items = json.rss.channel.item.map( (item) => {
    let newznab = {};
    item['newznab:attr'].forEach( (attr) => {
      newznab[attr.name] = attr.value;
    });


    if (!newznab.rageid || !newznab.episode || !newznab.season) {
      return null;
    }

    let seasonMatch = /[A-Za-z]0?([0-9]+)/.exec(newznab.season);
    let episodeMatch = /[A-Za-z]0?([0-9]+)/.exec(newznab.episode);

    if (!seasonMatch || !episodeMatch || seasonMatch.length < 2 || episodeMatch.length < 2) {
      return null;
    }

    let newItem = {
      title: item.title,
      category: item.category,
      newznab: newznab,
      season: +seasonMatch[1],
      episode: +episodeMatch[1],
      link: escape(item.enclosure.url)
    };


    return newItem;
  });

  return items.filter( (item) => {
    return item != null;
  });
}

let searchWanted = async (db) => {
  try {
    let episodes = await getEpisodes(db,{status: 'wanted'});
    let shows = await getShows(db);

    let episodeArray = _.groupBy(episodes, (episode) => {
      return shows[episode.show_id].rageid;
    });

    let items = await newznab();

    items.forEach( async (item) => {
      if (item.newznab.rageid && episodeArray[item.newznab.rageid]) {
        let foundEp = _.findWhere(episodeArray[item.newznab.rageid], { season: item.season, episode: item.episode});

        if (foundEp) {
          let name = `${shows[foundEp.show_id].name} - ${item.newznab.season}${item.newznab.episode} - ${foundEp.name}`
          console.info('found', name);
          let add = await sab.addURL(item.link, item.title, config.sabnzbd.category);

          db('episodes').update({show_id: foundEp.show_id, season: item.season, episode: item.episode}, { $set: { link: item.title, status: 'downloading' }}, (err,episode) => {
            if (episode) {
              console.info('updated ' + name);
            }
            console.error(err)
          });
        }
      }
    });
  } catch (err) {
    console.error(err)
  };
};

// Background tasks
exports.register = function (server, options, next) {

  // check if path exists

  let db = server.plugins['hapi-nedb-connector'].db;

  // update status
  setInterval( async () => {
    console.info('updating statuses');
    let episodes = await getEpisodes(db, {status: 'downloading'});
    let shows = await getShows(db);

    // let queue = await sab.queue();
    //
    // let history = await sab.queue();

    let files = await fs.readdirAsync(config.completedDownloadFolder);

    episodes.forEach( (episode) => {
      if (files.includes(episode.link)) {
        console.log('dl finished for ' + episode.link);
        // rename file
        let episodeFiles = await(fs.readdirAsync(config.completedDownloadFolder +
        '/' + episode.link);
        episodeFiles.forEach( (episodeFile) => {
        });
      }
    });

  }, 5000);

  // check for new episodes
  setInterval( () => {
    console.info('check for new episodes');
    searchWanted(db);
  }, 10000);

  // refresh shows
  setInterval( () => {
    console.info('refresh shows')
  }, 5 * 60 * 1000);

  next();
}

exports.register.attributes = {
  name: 'background',
  version: '1.0.0'
}
