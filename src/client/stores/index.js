import { compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { devTools } from 'redux-devtools';
import rootReducer from 'reducers';

let loggerMiddleware = createLogger();
let createStoreWithMiddleware;

if (__DEBUG__) {
  createStoreWithMiddleware = compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware),
    devTools()
  )(createStore);
} else {
  createStoreWithMiddleware = createStore;
}

export default function configureStore (initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers/index');

      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
