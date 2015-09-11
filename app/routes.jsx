import React from 'react';
import {Route} from 'react-router';
import {generateRoute} from 'utils/localized-routes';

export default (
  <Route component={require('./components/app')}>
    {generateRoute({
      paths: ['/'],
      component: require('./components/topic-pages')
    })}
    <Route path='*' component={require('./pages/not-found')} />
  </Route>
);
