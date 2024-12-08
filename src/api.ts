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

export function getMovies() {
  const url = `${BASE_PATH}/movie/now_playing`;
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
