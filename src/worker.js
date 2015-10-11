import TaskWorker from './TaskWorker.js';




// Background tasks
exports.register = function (server, options, next) {

  let taskWorker = new TaskWorker();
  taskWorker.start();
  // // watch wanted episodes to keep our episodes list up to date
  // let wantedEpisodes = [];
  // let liveWantedEpisodes = Episode.find({status: 'wanted'}).live();
  //
  // let downloadingEpisodes = [];
  // let liveDownloadingEpisodes = Episode.find({status: 'downloading'}).live();
  //
  // // watch downloads for sending to client
  // let liveDownloads = Download.find({}).live();
  //
  // Episode.on('liveQueryUpdate', function() {
  //   if (liveWantedEpisodes.res) {
  //     wantedEpisodes = liveWantedEpisodes.res;
  //   }
  //
  //   if (liveDownloadingEpisodes.res) {
  //     downloadingEpisodes = liveDownloadingEpisodes.res;
  //   }
  // });
  //
  // Download.on('liveQueryUpdate', function() {
  //   if (liveDownloads.res && liveDownloads.res.length) {
  //     // download some shit
  //   }
  // });
  //
  //
  // // check if path exists
  //
  // let running = {
  //   rss: false,
  //   fetch: false,
  //   progress: false
  // }
  //
  // let queueFetch = false;
  //
  // let rss = async () => {
  //   if (running.rss) return;
  //   running.rss = true;
  //
  //   try {
  //     let newEps = await processRSS(wantedEpisodes);
  //     if (newEps) {
  //       fetch();
  //     }
  //   } catch (err) {
  //     console.log(err, err.stack)
  //   }
  //
  //   // console.log(potentialDownloads);
  //   running.rss = false;
  //
  // };
  //
  // let fetch = async() => {
  //   if (running.fetch) {
  //     queueFetch = true;
  //     return;
  //   }
  //
  //   running.fetch = true;
  //
  //   try {
  //     await parseFound();
  //   } catch (err) {
  //     console.log(err, err.stack);
  //   }
  //
  //   running.fetch = false;
  //
  //   if (queueFetch) {
  //     queueFetch = false;
  //     fetch();
  //   }
  //
  // }
  //
  // let progress = async () => {
  //   if (running.progress) return;
  //   running.progress = true;
  //   updateStatus(downloadingEpisodes);
  //   running.progress = false;
  // };
  //
  // setInterval(rss,1000);
  //
  // setInterval(progress,1000);

  next();
}

exports.register.attributes = {
  name: 'background',
  version: '1.0.0'
}
