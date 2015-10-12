import fetch from 'isomorphic-fetch';

export const REQUEST_SHOWS = 'REQUEST_SHOWS';
export const RECEIVE_SHOWS = 'RECEIVE_SHOWS';

function requestShows() {
  return {
    type: REQUEST_SHOWS
  };
}

function receiveShows(json) {
  return {
    type: RECEIVE_SHOWS,
    items: json,
    receivedAt: Date.now()
  };
}

function fetchShows() {
  return dispatch => {
    dispatch(requestShows());
    return fetch('http://localhost:8000/api/shows')
      .then(req => req.json())
      .then(json => dispatch(receiveShows(json)));
  };
}

function shouldFetchShows(state) {
  const shows = state.shows;
  if (shows) return true;
  if (shows.isFetching) return false;
  return shows.didInvalidate;
}

export function fetchShowsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchShows(getState())) {
      return dispatch(fetchShows());
    }
  };
}
