import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getApi, IApiResponse, IGetMoviesResult } from "../api";
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

function Tv() {
  const history = useHistory();

  const bigMovieMAtch = useRouteMatch<{ tvId: string }>("/tv/:tvId");

  const { scrollY } = useScroll();

  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };

  const onOverlayClicked = () => history.push("/tv");

  const useMultipleQuery = () => {
    const latest = useQuery<IApiResponse>({
      queryKey: ["tv", "Latest"],
      queryFn: () => getApi("latest", "tv"),
    });
    const airingtoday = useQuery<IApiResponse>({
      queryKey: ["tv", "Airing Today"],
      queryFn: () => getApi("airing_today", "tv"),
    });
    const popular = useQuery<IApiResponse>({
      queryKey: ["tv", "Popular"],
      queryFn: () => getApi("popular", "tv"),
    });
    const top_rated = useQuery<IApiResponse>({
      queryKey: ["tv", "Top Rated"],
      queryFn: () => getApi("top_rated", "tv"),
    });

    return [latest, airingtoday, popular, top_rated];
  };

  const [
    { isLoading: loadinglatest, data: latestData },
    { isLoading: loadingairingtoday, data: airingtodayData },
    { isLoading: loadingpopular, data: popularData },
    { isLoading: loadingtop_rated, data: top_ratedData },
  ] = useMultipleQuery();

  const clickedMovie =
    bigMovieMAtch?.params.tvId &&
    (airingtodayData?.results.find(
      (tv) => tv.id === +bigMovieMAtch.params.tvId
    ) ||
      popularData?.results.find((tv) => tv.id === +bigMovieMAtch.params.tvId) ||
      top_ratedData?.results.find(
        (tv) => tv.id === +bigMovieMAtch.params.tvId
      ));
  return (
    <Wrapper>
      {loadinglatest ||
      loadingairingtoday ||
      loadingpopular ||
      loadingtop_rated ? (
        <Loader>Loading....</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(
              airingtodayData?.results[0].backdrop_path || ""
            )}
          >
            <Title>{airingtodayData?.results[0].name}</Title>
            <Overview>{airingtodayData?.results[0].overview}</Overview>
          </Banner>
          <SlidersContainer>
            <SliderWrapper>
              <TvSlider
                title="airing_today"
                data={airingtodayData}
                onBoxClick={onBoxClicked}
              />
            </SliderWrapper>
            <SliderWrapper>
              <TvSlider
                title="popular"
                data={popularData}
                onBoxClick={onBoxClicked}
              />
            </SliderWrapper>
            <SliderWrapper>
              <TvSlider
                title="Top Rated"
                data={top_ratedData}
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
                  layoutId={bigMovieMAtch.params.tvId}
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
                      <BigTitle>{clickedMovie.name}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
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

export default Tv;
