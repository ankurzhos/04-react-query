import axios from "axios";
import type { Movie } from "../types/movie";
const myKey = import.meta.env.VITE_TMDB_TOKEN;

export interface MoviesHttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MoviesResponse {
  movies: Movie[];
  totalPages: number;
}

export const fetchMovies = async (
  query: string,
  page = 1,
): Promise<MoviesResponse> => {
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
  return {
    movies: response.data.results,
    totalPages: response.data.total_pages,
  };
};
