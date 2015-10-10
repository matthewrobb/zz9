import Sabnzbd from './sabnzbd.js';
import config from '../config.json';
import processRSS from './tasks/processRSS.js';
import fetch from './tasks/fetch.js';
import updateStatus from './tasks/updateStatus.js';
import Show from './models/Show.js';
import Episode from './models/Episode.js';
import Download from './models/Download.js';
var url = config.testurl;





// Background tasks
exports.register = function (server, options, next) {

  // watch wanted episodes to keep our episodes list up to date
  let wantedEpisodes = [];
  let liveWantedEpisodes = Episode.find({status: 'wanted'}).live();

  // watch downloads for sending to client
  let liveDownloads = Download.find({}).live();

  Episode.on("liveQueryUpdate", function() {
    if (liveWantedEpisodes.res) {
      wantedEpisodes = liveWantedEpisodes.res;
    }
  });

  Download.on("liveQueryUpdate", function() {
    if (liveDownloads.res && liveDownloads.res.length) {
      // download some shit
    }
  });


  // check if path exists

  let running = {
    rss: false,
    progress: false
  }

  let rss = async () => {
    if (running.rss) return;
    console.log('\n------START------')
    running.rss = true;

    try {
      let newEps = await processRSS(wantedEpisodes);
      if (newEps) {
        // process and fetch
      }
      console.log("newEps", newEps)
    } catch (err) {
      console.log(err.stack)
    }

    // console.log(potentialDownloads);
    running.rss = false;
    console.log('-------END-------\n')

  };

  // let progress = async () => {
  //   if (running.progress) return;
  //   running.progress = true;
  //   updateStatus(downloadingEpisodes);
  //   running.progress = false;
  // };

  setInterval(rss,1000);

  // progress();
  // setInterval(progress,30000);

  next();
}

exports.register.attributes = {
  name: 'background',
  version: '1.0.0'
}
