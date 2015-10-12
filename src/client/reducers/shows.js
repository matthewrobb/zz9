import { createReducer } from 'utils';

// normally this would be imported from /constants, but in trying to keep
// this starter kit as small as possible we'll just define it here.
const SHOWS_RECEIVE = 'SHOWS_RECEIVE';
const SHOWS_REQUEST = 'SHOWS_REQUEST';

const initialState = 0;
export default createReducer(initialState, {
  [SHOWS_RECEIVE] : (state) => state + 1,
  [SHOWS_REQUEST] : (state) => state + 1,
});
