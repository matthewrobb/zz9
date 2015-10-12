import Episode from '../models/Episode.js';
import Sabnzbd from '../sabnzbd.js';
import config from '../../../configuration.json';
import mover from './mover.js';

const sab = new Sabnzbd(config.sabnzbd.apikey, config.sabnzbd.host, config.sabnzbd.port, config.sabnzbd.https);

export default class ProcessDownloads {
  static async run() {
    const episodes = await Episode.findAsync({status: 'downloading'});

    // update status
    episodes.forEach( (episode) => {
      const item = sab.findByName(episode.nzb.title);

      if (item.status === 'Completed') {
        mover.moveEpisode(episode);
      }
    });
  }
}
