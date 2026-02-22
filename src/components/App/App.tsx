import css from "./App.module.css";
import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import ReactPaginate from "react-paginate";

import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";

export default function App() {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
  });

  const movies = data?.movies ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearch = (newQuery: string) => {
    if (!newQuery.trim()) {
      toast.error("Please enter your search query.");
      return;
    }

    setQuery(newQuery.trim());
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    if (isSuccess && movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, movies]);

  return (
    <>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && !isLoading && <ErrorMessage />}
      {!isLoading && !isError && movies && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}
