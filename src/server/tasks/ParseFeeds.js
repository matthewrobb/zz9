import request from 'request-promise';
import parse from 'newznab-feedparser';
import _ from 'lodash';
import logger from '../logger.js';
import downloadEpisode from './DownloadEpisode.js';
import Episode from '../models/Episode.js';
import Provider from '../models/Provider.js';

// date of the last run
let lastRunDate = new Date(0);

// whether or not this is running
let running = false;

const getFeed = async(provider) => {
  const response = await request({
    uri: provider.feedUrl,
    resolveWithFullResponse: true
  });
  
  if (response.headers['content-type'].includes('text/xml')) {
    return parse(response.body, provider.lastCheck);
  }

  return [];
};

const filteredEpisodes = (wantedEpisodes, potentialEpisodes) => {
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
    const date = new Date();

    if (running || date - lastRunDate < 30000) return;

    running = true;

    logger.info('parsing feeds - started');

    try {
      const providers = await Provider.findAsync({});
      if (!providers.length) return;

      const promises = providers.map( async (provider) => {
        const parsed = await getFeed(provider);

        const newDate = _.result(_.max(parsed, (item) => {
          return item.pubDate;
        }), 'pubDate');

        provider.lastCheck = newDate;
        provider.save();

        return parsed;
      });

      const results = await* promises;
      const potentialEpisodes = [].concat.apply([], results);

      const wantedEpisodes = await Episode.findAsync({status: 'wanted'});

      const matchedItems = filteredEpisodes(wantedEpisodes, potentialEpisodes);

      const keyedItems = _.groupBy(matchedItems, (item) => {
        return _.result(_.findWhere(wantedEpisodes, {tvdb_id: +item.tvdb_id, season: item.season, number: item.episode}), '_id');
      });

      for (const item in keyedItems) {
        if (item && item !== 'undefined') {
          const episode = await Episode.findOneAsync({_id: item});

          const nzbList = keyedItems[item].filter( (nzb) => {
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
            downloadEpisode(episode);
            episode.save();
          }
        }
      }

      // update lastrun date
      lastRunDate = date;
    } catch (err) {
      logger.error(err);
    }

    logger.info('parsing feeds - finished');
    running = false;
  }
}
