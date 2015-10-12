import Episode from '../models/Episode.js';
import Sabnzbd from '../sabnzbd.js';
import config from '../../config.json';

let sab = new Sabnzbd(config.sabnzbd.apikey, config.sabnzbd.host, config.sabnzbd.port, config.sabnzbd.https);

export default class ProcessDownloads {
  static async run() {
    let episodes = await Episodes.findAsync({status: 'downloading'});

    // update status
    episodes.forEach( (episode) => {
      let item = sab.findByName(episode.nzb.title);

      if (item.status === 'Completed') {
        // moveit
      }
    });
  }
}
