import db from '../db.js';

let Download = new db('Download', {
  nzb: {
    title: String,
    nzbUrl: String,
    rage_id: String,
    tvdb_id: String,
    series_id: String,
    season: Number,
    number: Number,
    show: String,
    name: String,
    category: String,
    quality: String,
    source: String,
    codec: String,
    group: String,
    year: String,
    isHD: Boolean,
    pubDate: Date
  }
}, {});

export default Download;
