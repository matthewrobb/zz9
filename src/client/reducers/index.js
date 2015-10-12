import { combineReducers } from 'redux';
import counter from './counter';
import shows from './shows';

export default combineReducers({
  counter,
  shows
});
