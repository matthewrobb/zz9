import request from 'request';

let get = (url) => {
  return new Promise ( (resolve, reject) => {

    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      }
      reject(error);
    });
  });

}

class TVMaze {

  constructor(url = "http://api.tvmaze.com/") {
    this.APIURL = url;
  }

  async findShows(searchString, b = false) {

    try {
      let shows = await get(this.APIURL + 'search/shows/?q=' + searchString);
      return JSON.parse(shows);
    } catch (err) {
      console.log(err);
    }

    return false;
  }

  async getShow(tvMazeId) {

    try {
      let show = await get(this.APIURL + 'shows/' + tvMazeId);
      return JSON.parse(show);
    } catch (err) {
      console.log(err);
    }

    return false;
  }

  async getEpisodes(tvMazeId) {

    try {
      let episodes = await get(this.APIURL + 'shows/' + tvMazeId + "/episodes?specials=1");
      console.log(episodes);
      return JSON.parse(episodes);
    } catch (err) {
      console.log(err);
    }

    return false;
  }

}

export default TVMaze;
