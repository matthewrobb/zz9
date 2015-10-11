import db from '../db.js';
import bluebird from 'bluebird';

let Episode = new db('episode', {
  show: String, // show
  name: String,
  season: Number,
  number: Number,
  airdate: Date,
  status: String,
  download: {
    name: String,
    percentComplete: Number,
    id: String,
    status: String,
    eta: String,
    startedAt: Date,
    finishedAt: Date
  },
  show_id: String, // show
  rage_id: Number, // show
  tvmaze_id: Number, // show
  tvdb_id: Number, // show
  quality: String, // any sd hd 720 1080
  summary: String,
  path: String
}, {});

bluebird.promisifyAll(Episode);

export default Episode;
