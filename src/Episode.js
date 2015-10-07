export default class Episode {

  constructor(maze, show) {
    this.mazeid = maze.id;
    this.show_id = show._id;
    this.rageid = show.rageid;
    this.tvdbid = show.tvdbid;

    this.name = maze.name;
    this.season = maze.season;
    this.episode = maze.number;
    this.summary = maze.summary;
    this.airdate = new Date(maze.airstamp);
    this.status = (new Date() < this.airdate) ? 'wanted' : 'ignored'; // found, fetching, downloading, processing, moving, downloaded, wanted, replacable
    this.filename = null;
    this.resolution = null;
  }

  fileName(showName) {
    let paddedSeason = (this.season < 10) ? '0' + this.season : this.season;
    let paddedEpisode = (this.episode < 10) ? '0' + this.episode : this.episode;

    return `${showName.replace(/\s+/g, '')}.s${paddedSeason}e${paddedEpisode}.${this.name.replace(/\s+/g, '')}`;

  }
}
