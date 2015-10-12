import config from '../../configuration.json';

export default class Show {
  constructor(maze) {

    let date = new Date();

    this.name = maze.name;

    this.rageid = maze.externals.tvrage;
    this.tvdbid = maze.externals.tvdb;
    this.mazeid = maze.id;

    this.settings = {
      folder: config.baseFolder + `/${maze.name}`,
      seasonFolders: true,
      byDate: false,
      resolution: '720p',
      subscription: true
    }

    this.maze = maze;
    this.created_at = date;
    this.updated_at = date;
  }
}
