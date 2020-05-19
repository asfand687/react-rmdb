import { useState, useEffect, useCallback } from 'react';
import { API_KEY, API_URL } from '../../config';

export const useMovieFetch = (movieId) => {
  const [state, setState] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setError(false);
    setLoading(true);
    try {
      const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}`;
      const response = await (await fetch(endpoint)).json();
      // console.log(response);
      const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
      const creditsResult = await (await fetch(creditsEndpoint)).json();
      // console.log(creditsResult);
      const director = creditsResult.crew.filter(
        (member) => member.job === 'Director'
      );

      setState({
        ...response,
        actors: creditsResult.cast,
        director,
      });
    } catch (error) {
      setError(true);
    }

    setLoading(false);
  }, [movieId]);

  useEffect(() => {
    if (localStorage[movieId]) {
      setState(JSON.parse(localStorage[movieId]));
      setLoading(false);
    } else {
      fetchData();
    }
  }, [fetchData, movieId]);

  useEffect(() => {
    localStorage.setItem(movieId, JSON.stringify(state));
  }, [movieId, state]);

  return [state, loading, error];
};
