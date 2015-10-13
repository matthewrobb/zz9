import { createReducer } from 'utils';

// normally this would be imported from /constants, but in trying to keep
// this starter kit as small as possible we'll just define it here.
import { REQUEST_SHOWS, RECEIVE_SHOWS } from 'actions/shows';

const initialState = {};

export default createReducer(initialState, {
  [RECEIVE_SHOWS] : (state = {}, { items, receivedAt }) => {
    return Object.assign({}, state, {
      isFetching: false,
      didInvalidate: false,
      items,
      lastUpdated: receivedAt
    });
  },

  [REQUEST_SHOWS] : (state) => {
    return Object.assign({}, state, {
      isFetching: true,
      didInvalidate: false
    });
  }
});
