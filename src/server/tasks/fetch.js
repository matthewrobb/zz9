import config from '../../../configuration.json';
import Sabnzbd from '../sabnzbd.js';
import _ from 'lodash';

import Episode from '../models/Episode.js';

let sab = new Sabnzbd(config.sabnzbd.apikey, config.sabnzbd.host, config.sabnzbd.port, config.sabnzbd.https);

let pad = (num) => {
  return (num < 10) ? '0' + num : num;
};

let fetch = async() => {

  Episode.find({ status:'found' }).exec( (err, episodes) => {
    episodes.forEach( async (episode) => {
      try {
        let nzb = episode.nzbs.pop();
        let s = await sab.addURL(escape(nzb.nzbUrl),nzb.title,'tv');
        episode.status = 'downloading';
        episode.download = {
          name: nzb.title,
          percentComplete: 0,
          status: 'fetching',
          startedAt: new Date()
        };
        episode.save();
      } catch (err) {
        console.log(err)
      }
    });
  });
};

let download = async (episode) => {
  let nzb = episode.nzb.pop();
  return await sab.addURL(escape(nzb.nzbUrl),nzb.title,'tv');
}

export default fetch;
