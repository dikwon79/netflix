import { useState } from "react";
import { IApiResponse, IGetMoviesResult, isMovie } from "../api";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { makeImagePath } from "../utils";

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const SliderTitle = styled.h3`
  font-size: 24px;
  color: ${(props) => props.theme.white.lighter};
  position: absolute;
  top: -50px;
  left: 20px;
  margin-bottom: 10px;
`;

interface SliderProps {
  title: string;
  data: IGetMoviesResult | IApiResponse | undefined;
  onBoxClick: (movieId: number) => void;
}

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  //margin-bottom: 5px;  3개의 row가 일직선상에 있어야 해서 이걸 지우고 postion을 절대값으로 한다.
  position: absolute;
  width: 100%;
  padding-left: 20px;
`;
const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

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

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    y: -50,

    scale: 1.3,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

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
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const ArrowButton = styled(motion.div)`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    color: black;
    scale: 1.1;
    transition: all 0.3s ease;
  }
`;

export const MovieSlider = ({ title, data, onBoxClick }: SliderProps) => {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const offset = 6;

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();

      const totalMovies = data.results.length - 1; // 첫 영화는 배너에 사용
      const maxIndex = Math.ceil(totalMovies / offset) - 1;

      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  return (
    <Slider>
      <SliderTitle>{title}</SliderTitle>
      <ArrowButton onClick={increaseIndex}>→</ArrowButton>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          key={index}
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
        >
          {data?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((movie) => (
              <Box
                layoutId={movie.id + ""}
                key={movie.id}
                whileHover="hover"
                initial="normal"
                variants={BoxVariants}
                onClick={() => onBoxClick(movie.id)}
                transition={{ type: "tween" }}
                bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              >
                <Info variants={infoVariants}>
                  <h4>{isMovie(movie) ? movie.title : movie.name}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
    </Slider>
  );
};
