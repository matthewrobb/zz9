import config from '../../config.json';
import Sabnzbd from '../sabnzbd.js';
import _ from 'lodash';

let sab = new Sabnzbd(config.sabnzbd.apikey, config.sabnzbd.host, config.sabnzbd.port, config.sabnzbd.https);

let pad = (num) => {
  return (num < 10) ? '0' + num : num;
};

let fetch = (shows, episodes) => {
  console.log('fetching')
  episodes.forEach( async (episode)=> {
    let show = _.findWhere(shows, { _id: episode.show_id });

    await sab.addURL(escape(episode.found_urls[0]),episode.nzbName,'tv');
    doc.status = 'downloading';
    doc.save();
  });
};

export default fetch;
