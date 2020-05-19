import { useState, useEffect } from 'react';
import { POPULAR_BASE_URL } from '../../config';

export const useHomeFetch = (searchTerm) => {
  const [state, setState] = useState({ movies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchMovies = async (endpoint) => {
    setError(false);
    setLoading(true);

    const isLoadMore = endpoint.search('page');
    try {
      const result = await fetch(endpoint);
      const parsedRes = await result.json();

      setState((prev) => ({
        ...prev,
        movies:
          isLoadMore !== -1
            ? [...prev.movies, ...parsedRes.results]
            : [...parsedRes.results],
        heroImage: prev.heroImage || parsedRes.results[0],
        currentPage: parsedRes.page,
        totalPages: parsedRes.total_pages,
      }));
    } catch (err) {
      setError(true);
      console.error(err.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (sessionStorage.homeState) {
      setState(JSON.parse(sessionStorage.homeState));
      setLoading(false);
    } else {
      fetchMovies(`${POPULAR_BASE_URL}`);
    }
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      sessionStorage.setItem('homeState', JSON.stringify(state));
    }
  }, [searchTerm, state]);

  return [{ state, loading, error }, fetchMovies];
};
