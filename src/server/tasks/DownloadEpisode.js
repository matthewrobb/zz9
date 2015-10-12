import Sabnzbd from '../sabnzbd.js';
import config from '../../../configuration.json';

let sab = new Sabnzbd(config.sabnzbd.apikey, config.sabnzbd.host, config.sabnzbd.port, config.sabnzbd.https);

let download = async (episode) => {
  let add = await sab.addURL(episode.nzb.nzbUrl, episode.nzb.title, config.sabnzbd.category);
  let queue = await sab.queue();
  let item = await sab.findByName(episode.nzb.title);

  if (item) {
    episode.status = 'downloading';

    episode.download = {
      name: episode.nzb.title,
      percentComplete: 0,
      id: null,
      status: null,
      startedAt: new Date()
    };

    episode.save();
  }

}

export default download;
