const BASE_PATH = "https://api.themoviedb.org/3";
const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZWEzYmZmYTUyMDc1MTkwOWIyYjQ4MWM3ZjFlNmJlOSIsIm5iZiI6MTczMzU2NDM2MS4xMTMsInN1YiI6IjY3NTQxN2M5ZGYzYWU5N2UxYzJmNDMzMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._-So_4UNf-TYBOlkcXi9SvdX-HXgsj1ZmYtlILafD0Y";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
interface IShow {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}
export interface IApiResponse {
  page: number;
  results: IShow[];
}

export const isMovie = (item: IMovie | IShow): item is IMovie => {
  return (item as IMovie).title !== undefined;
};
export function getApi(category: string, type: string) {
  const url = `${BASE_PATH}/${type}/${category}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: AUTH_TOKEN,
    },
  };

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
      throw error;
    });
}

export function searchApi(query: string, type: string) {
  const url = `${BASE_PATH}/search/${type}?query=${query}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: AUTH_TOKEN,
    },
  };

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching movies:", error);
      throw error;
    });
}

//https://api.themoviedb.org/3/search/movie?query=ring

//https://api.themoviedb.org/3/search/tv?query=ring
