import request from 'request-promise';
import config from '../../config.json';
import parse from 'newznab-feedparser';
import fs from 'fs';
import _ from 'lodash';
import Show from '../models/Show.js';
import Episode from '../models/Episode.js';
import Download from '../models/Download.js';
let date = 0;

let processRSS = async(episodes) => {
  if (!episodes.length) return;

  // parse the xml
  let xml = fs.readFileSync('./nzbsorg.xml');

  // let xml = await request(config.testurl);
  let items = parse(xml, date);

  console.log('found ' + items.length + ' new feed items to parse')

  let tvdb = episodes.map( (episode) => {
    return episode.tvdb_id;
  });

  // remove dupes
  tvdb = [ ...new Set(tvdb) ];

  // filter out episodes not belonging to the shows we have
  let potentialItems = items.filter((item) => {
    return tvdb.includes(+item.tvdb_id);
  });

  let max = _.max(items, function(item) {
    return item.pubDate;
  });

  date = max.pubDate || date;

  return checkPotentialItems(potentialItems,episodes);
};

let checkPotentialItems = (items,episodes) => {

  let foundEpisodes = false;

  items.forEach( (item)=> {
    let matched = _.findWhere(episodes, {
      tvdb_id: +item.tvdb_id,
      number: item.episode,
      season: item.season
    });

    if (matched && !matched.blacklist.includes(item.title)) {
      matched.status = 'found';
      matched.nzbs = matched.nzbs || [];
      matched.nzbs.push(item);
      matched.save();
      foundEpisodes = true;
    }

  });

  return foundEpisodes;
}

export default processRSS;
