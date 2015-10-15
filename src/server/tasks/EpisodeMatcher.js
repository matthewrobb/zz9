export default class EpisodeMatcher {
  static match(episode, nzb) {
    if (episode.quality === 'any') return true;

    if (episode.quality === '720' && nzb.quality === 720) return true;

    if (episode.quality === '1080' && nzb.quality === 1080) return true;

    if (episode.quality === 'hd' && nzb.isHD) return true;

    if (episode.quality === 'sd' && !nzb.isHD) return true;

    return false;
  }
}
