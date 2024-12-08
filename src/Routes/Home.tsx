import { useQuery } from "@tanstack/react-query";
import { getApi, IGetMoviesResult } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { MovieSlider } from "../Components/MovieSlider";

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
const ActionButton = styled.button`
  padding: 12px 24px;
  background-color: ${(props) => props.theme.main};
  color: ${(props) => props.theme.white};
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.accent};
    transform: translateY(-4px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
`;
function Home() {
  const history = useHistory();

  const bigMovieMAtch = useRouteMatch<{ movieId: string }>("/movies/:movieId");

  const { scrollY } = useScroll();

  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const onOverlayClicked = () => history.push("/");

  const useMultipleQuery = () => {
    const now = useQuery<IGetMoviesResult>({
      queryKey: ["movies", "nowPlaying"],
      queryFn: () => getApi("now_playing", "movie"),
    });
    const latest = useQuery<IGetMoviesResult>({
      queryKey: ["latest", "latest"],
      queryFn: () => getApi("latest", "movie"),
    });
    const topRated = useQuery<IGetMoviesResult>({
      queryKey: ["topRated", "topRated"],
      queryFn: () => getApi("top_rated", "movie"),
    });
    const upcoming = useQuery<IGetMoviesResult>({
      queryKey: ["upcoming", "upcoming"],
      queryFn: () => getApi("upcoming", "movie"),
    });

    return [now, latest, topRated, upcoming];
  };

  const [
    { isLoading: loadingnow, data: nowData },
    { isLoading: loadingLatest, data: latestData },
    { isLoading: loadingTopRated, data: topRatedData },
    { isLoading: loadingUpComming, data: upCommingData },
  ] = useMultipleQuery();

  const clickedMovie =
    bigMovieMAtch?.params.movieId &&
    (nowData?.results.find(
      (movie) => movie.id === +bigMovieMAtch.params.movieId
    ) ||
      topRatedData?.results.find(
        (movie) => movie.id === +bigMovieMAtch.params.movieId
      ) ||
      upCommingData?.results.find(
        (movie) => movie.id === +bigMovieMAtch.params.movieId
      ));
  return (
    <Wrapper>
      {loadingnow || loadingLatest || loadingTopRated || loadingUpComming ? (
        <Loader>Loading....</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(nowData?.results[0].backdrop_path || "")}
          >
            <Title>{nowData?.results[0].title}</Title>
            <Overview>{nowData?.results[0].overview}</Overview>
          </Banner>
          <SlidersContainer>
            <SliderWrapper>
              <MovieSlider
                title="Now Playing"
                data={nowData}
                onBoxClick={onBoxClicked}
              />
            </SliderWrapper>
            <SliderWrapper>
              <MovieSlider
                title="Top Rated"
                data={topRatedData}
                onBoxClick={onBoxClicked}
              />
            </SliderWrapper>
            <SliderWrapper>
              <MovieSlider
                title="Upcoming"
                data={upCommingData}
                onBoxClick={onBoxClicked}
              />
            </SliderWrapper>
          </SlidersContainer>
          <AnimatePresence>
            {bigMovieMAtch ? (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  layoutId={bigMovieMAtch.params.movieId}
                  style={{ top: scrollY.get() + 100 }}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>

                      {/* 액션 버튼 추가 */}
                      <ActionButtons>
                        <ActionButton onClick={() => alert("Watch now!")}>
                          Watch Now
                        </ActionButton>
                        <ActionButton
                          onClick={() => alert("Add to favorites!")}
                        >
                          Add to Favorites
                        </ActionButton>
                      </ActionButtons>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
