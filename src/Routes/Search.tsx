import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { IApiResponse, IGetMoviesResult, searchApi } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { MovieSlider } from "../Components/MovieSlider";
import { TvSlider } from "../Components/TvSlider";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const SlidersContainer = styled.div`
  display: flex;
  flex-direction: column; /* 세로로 쌓기 */
  gap: 20px; /* 슬라이더 간 간격 */
  width: 100%; /* 전체 너비로 설정 */
  position: absolute; /* 자식의 절대 위치를 부모 기준으로 설정 */
`;
// Optional: MovieSlider wrapper for specific styling
const SliderWrapper = styled.div`
  width: 100%; /* 슬라이더가 부모 컨테이너를 채우도록 설정 */
  position: relative; /* 기본값: 겹침 방지 */
  height: 300px;
`;
const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;

  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;

  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.img`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  position: relative;
  top: -80px;
  font-size: 36px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword") || ""; // 기본값 설정
  const history = useHistory();

  const bigMovieMAtch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const bigTvMAtch = useRouteMatch<{ tvId: string }>("/tv/:tvId");

  const { scrollY } = useScroll();

  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };

  const onOverlayClicked = () => history.push("/tv");

  // useMultipleQuery 함수 정의
  const useMultipleQuery = (keyword: string) => {
    const searchMovie = useQuery<IGetMoviesResult>({
      queryKey: ["movie", keyword], // 키워드 포함
      queryFn: () => searchApi(keyword, "movie"),
      enabled: !!keyword, // 키워드가 있을 때만 실행
    });
    const searchTv = useQuery<IApiResponse>({
      queryKey: ["tv", keyword], // 키워드 포함
      queryFn: () => searchApi(keyword, "tv"),
      enabled: !!keyword, // 키워드가 있을 때만 실행
    });

    return [searchMovie, searchTv];
  };

  // 검색 결과 가져오기
  const [
    { isLoading: loadingSearchMovie, data: searchMovieData },
    { isLoading: loadingSearchTv, data: searchTvData },
  ] = useMultipleQuery(keyword);

  // 선택된 영화 또는 TV 쇼
  const clickedMovie =
    (bigMovieMAtch?.params.movieId &&
      searchMovieData?.results.find(
        (movie) => movie.id === +bigMovieMAtch.params.movieId
      )) ||
    (bigTvMAtch?.params.tvId &&
      searchTvData?.results.find((tv) => tv.id === +bigTvMAtch.params.tvId));

  return (
    <Wrapper>
      {loadingSearchMovie || loadingSearchTv ? (
        <Loader>Loading....</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              searchMovieData?.results[0]?.backdrop_path || ""
            )}
          >
            <Title>Keyword Search: {keyword}</Title>
          </Banner>
          <SlidersContainer>
            <SliderWrapper>
              <MovieSlider
                title="Movies"
                data={searchMovieData}
                onBoxClick={onBoxClicked}
              />
            </SliderWrapper>
            <SliderWrapper>
              <TvSlider
                title="TV Shows"
                data={searchTvData}
                onBoxClick={onBoxClicked}
              />
            </SliderWrapper>
          </SlidersContainer>
        </>
      )}
    </Wrapper>
  );
}

export default Search;
