import db from '../db.js';
import bluebird from 'bluebird';

let Provider = new db('provider', {
  name: String,
  url: String,
  apiKey: String,
  userId: String,
  lastCheck: Date,
  feedUrl: { get: () => {
    let url = `${this.url}/rss?r=${this.apiKey}&t=5000&dl=1`;

    if (userId && userId.length) {
      url += `&i=${this.userId}`
    }

    return url;
  } }
}, {});

bluebird.promisifyAll(Provider);

export default Provider;
