import React, { Fragment } from 'react';
// Components
import Header from './elements/Header';
import Home from './Home';
import Movie from './Movie';
import NotFound from './NotFound';

import { Router } from '@reach/router';

import { GlobalStyle } from './styles/GlobalStyle';

const App = () => {
  return (
    <Fragment>
      <Header />
      <Router>
        <Home path='/' />
        <Movie path='/:movieId' />
        <NotFound default />
      </Router>
      <GlobalStyle />
    </Fragment>
  );
};

export default App;
