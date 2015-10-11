import config from '../../config.json';
import request from 'request-promise';
import parse from 'newznab-feedparser';
import _ from 'lodash';
import logger from '../logger.js';

import Episode from '../models/Episode.js';
import Provider from '../models/Provider.js';
import ProcessEpisode from './ProcessEpisode.js';

let getFeed = async(provider) => {

  let response = await request({
    uri: provider.feedUrl,
    resolveWithFullResponse: true
  });

  if (response.headers['content-type'].includes('text/xml')) {
    return parse(response.body);
  }

  return [];
};

let filteredEpisodes = (wantedEpisodes, potentialEpisodes) => {
  // filter out shows we don't track
  let tvdb = wantedEpisodes.map( (episode) => {
    return episode.tvdb_id;
  });

  // remove dupes
  tvdb = [ ...new Set(tvdb) ];

  return potentialEpisodes.filter( (episode) => {
    return tvdb.includes(+episode.tvdb_id);
  });
};

export default class ParseFeeds {
  static async run() {
    logger.info('parsing feeds - started')

    let providers = await Provider.findAsync({});
    if(!providers.length) return;

    let promises = providers.map( (provider) => getFeed(provider) );
    let results = await* promises;
    let potentialEpisodes = [].concat.apply([], results);

    let wantedEpisodes = await Episode.findAsync({status: 'wanted'});

    let matchedItems = filteredEpisodes(wantedEpisodes, potentialEpisodes);

    let keyedItems = _.groupBy(matchedItems, (item) => {
      return _.result(_.findWhere(wantedEpisodes, {tvdb_id: +item.tvdb_id, season: item.season, number: item.episode}), '_id');
    });

    for (let item in keyedItems) {
      if (item && item !== 'undefined') {
        let episode = await Episode.findOneAsync({_id: item});

        let nzbList = keyedItems[item].filter( (nzb) => {

          if (episode.blacklist.includes(nzb.nzbUrl)) return false;

          if (episode.quality === 'any') return true;

          if (episode.quality === '720' && nzb.quality === 720) return true;

          if (episode.quality === '1080' && nzb.quality === 1080) return true;

          if (episode.quality === 'hd' && nzb.isHD) return true;

          if (episode.quality === 'sd' && !nzb.isHD) return true;

          return false;
        });

        if (nzbList.length) {
          episode.nzb = nzbList[0];
          episode.status = 'found';
          DownloadEpisode(episode);
          episode.save();
        }

      }
    }

    console.log('parsing feeds - finished')
  }
}
