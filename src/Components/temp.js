const { data, isLoading } =
  useQuery <
  IGetMoviesResult >
  {
    queryKey: ["movies", "nowPlaying"],
    queryFn: () => getMovies("now_playing"),
  };

const useMultipleQuery = () => {
  const latest =
    useQuery <
    IGetMoviesResult >
    {
      queryKey: ["latest", "latest"],
      queryFn: () => getMovies("latest"),
    };
  const topRated =
    useQuery <
    IGetMoviesResult >
    {
      queryKey: ["topRated", "topRated"],
      queryFn: () => getMovies("top_rated"),
    };
  const upcoming =
    useQuery <
    IGetMoviesResult >
    {
      queryKey: ["upcoming", "upcoming"],
      queryFn: () => getMovies("upcoming"),
    };

  return [latest, topRated, upcoming];
};

const [
  { isLoading: loadingLatest, data: latestData },
  { isLoading: loadingTopRated, data: topRatedData },
  { isLoading: loadingUpComming, data: upCommingData },
] = useMultipleQuery();
