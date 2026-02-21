import axios from "axios";
import type { Movie } from "../types/movie";
const myKey = import.meta.env.VITE_TMDB_TOKEN;

interface MoviesHttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (
  query: string,
  page = 1,
): Promise<Movie[]> => {
  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${myKey}`,
      },
    },
  );
  return response.data.results;
};
