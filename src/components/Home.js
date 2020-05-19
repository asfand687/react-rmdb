import React, { Fragment, useState } from 'react';
import {
  POPULAR_BASE_URL,
  SEARCH_BASE_URL,
  IMAGE_BASE_URL,
  BACKDROP_SIZE,
  POSTER_SIZE,
} from '../config';

// Components
import HeroImage from './elements/HeroImage';
import Grid from './elements/Grid';
import SearchBar from './elements/SearchBar';
import MovieThumb from './elements/MovieThumb';
import LoadMoreBtn from './elements/LoadMoreBtn';
import Spinner from './elements/Spinner';
import { useHomeFetch } from './hooks/useHomeFetch';
import NoImage from './images/no_image.jpg';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [
    {
      state: { movies, heroImage, currentPage, totalPages },
      loading,
      error,
    },
    fetchMovies,
  ] = useHomeFetch(searchTerm);

  const searchMovies = (search) => {
    const endpoint = search
      ? `${SEARCH_BASE_URL}${search}`
      : `${POPULAR_BASE_URL}`;
    setSearchTerm(search);
    fetchMovies(endpoint);
  };

  const loadMoreMovies = () => {
    const searchEndPoint = `${SEARCH_BASE_URL}${searchTerm}&page=${
      currentPage + 1
    }`;
    const popularEndpoint = `${POPULAR_BASE_URL}&page=${currentPage + 1}`;

    const endpoint = searchTerm ? searchEndPoint : popularEndpoint;

    fetchMovies(endpoint);
  };

  if (error) return <div>Something Went Wrong</div>;
  if (!movies[0] || loading) return <Spinner />;
  return (
    <Fragment>
      {!searchTerm && (
        <HeroImage
          image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
          title={heroImage.original_title}
          text={heroImage.overview}
        />
      )}
      {/* {!searchTerm && (
        <HeroImage
          image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
          title={heroImage.original_title}
          text={heroImage.overview}
        />
      )} */}

      <SearchBar callback={searchMovies} />
      <Grid header={searchTerm ? 'Search Results' : 'Popular Movies'}>
        {movies.map((movie) => (
          <MovieThumb
            key={movie.id}
            image={
              movie.poster_path
                ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                : NoImage
            }
            movieId={movie.id}
            clickable
          />
        ))}
      </Grid>
      {loading && <Spinner />}
      {currentPage < totalPages && !loading && (
        <LoadMoreBtn text='Load More' callback={loadMoreMovies} />
      )}
    </Fragment>
  );
};

export default Home;
