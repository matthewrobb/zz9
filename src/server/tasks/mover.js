import fs from 'fs';
import bluebird from 'bluebird';
import Show from '../models/Show';
import config from '../../configuration.json';
import fsExtra from 'fs.extra';

const mkdirp = bluebird.promisify(require('mkdirp'));
bluebird.promisifyAll(fs);
bluebird.promisifyAll(fsExtra);

const VIDEO_EXTENSIONS = ['mkv', 'avi', 'divx', 'xvid', 'mov', 'wmv', 'mp4', 'mpg', 'mpeg', 'vob', 'iso', 'm4v'];

const SUBTITLE_EXTENSIONS = ['sub', 'srt'];

const ALLOWED_EXTENSIONS = VIDEO_EXTENSIONS.concat(SUBTITLE_EXTENSIONS);

const moveFiles = async (oldPath, newPath) => {
  let files = await fs.readdirAsync(oldPath);

  files = files.filter( (file) => {
    const matches = file.match(/\.([^.]*$)/i);
    if (matches[1]) {
      return ALLOWED_EXTENSIONS.includes(matches[1]) && !/^sample-|sample\.[^.]*$/i.test(file);
    }
  });

  await mkdirp(dest);

  const promises = files.map( (file) => {
    return fsExtra.moveAsync(oldPath + '/' + file, newPath + '/' + file);
  });

  await* promises;
};

class mover {
  static async run() {
    // find completed episodes

    // check for any other episodes
    // const files = await fs.readdirAsync(config.completedDownloadFolder);

    // files.forEach( (file) => {
    //   // moveit(config.completedDownloadFolder + '/' + file);
    // });
  }

  static async moveEpisode(episode) {
    const show = await Show.findOneAsync({_id: episode.show_id});

    const dest = `${show.settings.folder}/Season ${episode.number}`;

    await moveFiles(config.completedDownloadFolder + '/' + episode.download.name, dest);

    episode.status = 'complete';
    episode.path = dest + '/' + episode.download.name;
    episode.save();
  }
}
mover.run();
