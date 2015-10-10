import Sabnzbd from '../sabnzbd.js';
import config from '../../config.json';
import _ from 'lodash';

let sab = new Sabnzbd(config.sabnzbd.apikey, config.sabnzbd.host, config.sabnzbd.port, config.sabnzbd.https);

let updateStatus = (episodes) => {
  console.log('fetching status')
  episodes.forEach( async (episode) => {
    let q = await sab.queue();

    let item = _.findWhere(q.slots, {filename: episode.download.name});

    // if (item) {
    //   episode.download.percentComplete = item.percentage;
    //   episode.download.eta = item.eta;
    //   episode.download.status = item.status;
    //   episode.save();
    //   return;
    // }

    let h = await sab.history();

    let hItem = _.findWhere(h.slots, {filename: episode.download.name});

    if (hItem) {
      episode.download.status = item.status;
      if (item.status == 'Complete') {
        item.percentage = 100;
        sab.deleteFromHistory(item.nzo_id);
      }
      episode.save();
    }

  })
}

export default updateStatus;
