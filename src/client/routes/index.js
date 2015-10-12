import { Route }   from 'react-router';
import React       from 'react';
import CoreLayout  from 'layouts/CoreLayout';
import HomeView    from 'views/HomeView';
import ShowsView   from 'views/ShowsView';

export default (
  <Route component={CoreLayout}>
    <Route name='home' path='/' component={HomeView} />
    <Route name='shows' path='/shows' component={ShowsView} />
  </Route>
);
