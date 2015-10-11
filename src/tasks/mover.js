import fs from 'fs';
import bluebird from 'bluebird';
import config from '../../config.json';
import Episode from '../models/Episode.js';
import _ from 'lodash';

bluebird.promisifyAll(fs);

let findCompleted = async () => {

  Episode.find({status:'downloading'}, (err,episodes) => {
    checkFolder(episodes);
  });

};

let checkFolder = async (episodes) => {
  let indexed = {};

  episodes.forEach( (episode) => {
    indexed[episode.download.name] = episode;
  });

  console.log(indexed);
  let files = await fs.readdirAsync(config.completedDownloadFolder);

  files.forEach( async (file) => {
    // does it match a download?

    if (indexed[file]) {
      console.log('matches')
    } else {
      console.log('doesnt match')
    }
    let dirFiles = await fs.readdirAsync(config.completedDownloadFolder + '/' + file);


    console.log(dirFiles);
  });
};

findCompleted();
