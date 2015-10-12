import request from 'request-promise';
import parse from 'newznab-feedparser';

let get = async(url) => {

  let response = await request({
    uri: url,
    resolveWithFullResponse: true
  });

  if (!response.headers['content-type'].includes('text/xml')) {
    throw new Error('invalid xml');
  }

  return parse(response.body);

};

export default class newznab {
  constructor(url, apikey, user) {
    this.url = url;
    this.apikey = apikey;
    this.user = user;
  }

  get apiUrl() {
    return `${this.url}/api?apikey=${this.apikey}`;
  }

  async findEpisodes({ name = null, season = null, episode = null, tvdbid = null, tvrageid = null} = {}) {

    let query = (name) ? `&q=${name}` : (tvdbid) ? `&tvdbid=${tvdbid}` : (tvrageid) ? `&tvrageid=${tvrageid}` : null;

    if (!query) throw new Error('name, tvdbid, or tvrageid must be provided');

    let episodeString = (episode) ? `&ep=${episode}` : '';

    let url = `${this.apiUrl}&t=tvsearch${query}&season=${season}${episodeString}&extended=1`;
    console.log(url);
    return await get(url);
  }

  async findSeasonPacks({ name = null, season = null, tvdbid = null, tvrageid = null} = {}) {
    let episodes = await this.findEpisodes({name, season, tvdbid, tvrageid});

    return episodes;
  }
}

let n = new newznab('https://api.dognzb.cr','cc9f363823c5e6682dda00e870f59279');

console.log(n.apiUrl)
// n.findEpisodes({tvdbid: 73871, season: 7, episode: 1}).then(function(episodes) {
//   // console.log(episodes);
// });
//
n.findSeasonPacks({tvdbid: 73871, season: 6}).then(function(episodes) {
  console.log(episodes);
});
