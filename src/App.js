import './App.css';
import styled from "styled-components";
import { useEffect, useState } from 'react';

//Properties
const PLAYER_SIZE = 50;
const GAME_WIDTH = 875;
const GAME_HEIGHT = 700;
const GRAVITY = 9;
const LIFT_HEIGHT = 145;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_GAP = 350;


function App() {
  //Set the player position and position the player initially.
  const [playerPosition, setPlayerPosition] = useState(250);
  //Set an initial start time for the game.
  const [gameHasStarted, setGameHasStarted] = useState(false);
  //Create the game obstacles and set their heights.
  const [obstacleHeight, setObstacleHeight] = useState(0);
  //Set the size and position of the left most starting point of the obstacle.
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH + OBSTACLE_WIDTH);
 
  const [score, setScore] = useState(0);
  useEffect(() => {
    let timeId;
    if (gameHasStarted && playerPosition < GAME_HEIGHT - PLAYER_SIZE) {
      timeId = setInterval(() => {
        setPlayerPosition( playerPosition => playerPosition + GRAVITY)
      }, 24)
    }
    return () => {
      clearInterval(timeId);
    }
  }, [playerPosition, gameHasStarted]);

  useEffect(() => {
    let obstacleID;
    if (gameHasStarted & obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleID = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 3.5);
      }, 24);
      return () => {
        clearInterval(obstacleID);
      };
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH)
      setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT)));
      setScore((score) => score + 1);
    }
  }, [gameHasStarted, obstacleLeft]);

  useEffect(() => {
    const playerHasCollidedWithBottom = playerPosition >= 500 && playerPosition >= 500 - obstacleHeight

    if (obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (playerHasCollidedWithBottom)) {
      setGameHasStarted(false);
    };

  }, [playerPosition, obstacleHeight, obstacleLeft])

  const liftPlayer = () => {
    let newPlayerPosition = playerPosition - LIFT_HEIGHT;
    if (!gameHasStarted) {
      setGameHasStarted(true);
    } else if (newPlayerPosition < 0 + PLAYER_SIZE) {
      setPlayerPosition(0);
    } else {
      setPlayerPosition(newPlayerPosition);
    }
  }

  return (
    <CenteringItem className="App" onClick={liftPlayer}>
      {/* Create the frame which contains the game activity. */}
      <GameFrame height = {GAME_HEIGHT} width = {GAME_WIDTH}>
      {/* Create a sun for the sky in the game scene. */}
      <Sun height = {40} width = {40}></Sun>
      {/* Set the bottom obstacle. */}
      <Obstacle 
      height = {obstacleHeight} 
      width = {OBSTACLE_WIDTH} 
      left = {obstacleLeft} 
      
      />
      
      {/* Set th player */}
      <Player size = {PLAYER_SIZE} top = {playerPosition}><img src='Images/Alphabet_Icon1.png' alt='logo' width="100%" height="100%"/></Player>
      </GameFrame>
      <span>{score}</span>
    </CenteringItem>
  );
 {/* Set the top obstacle. */}
      <Obstacle top = {0} height = {obstacleHeight} width = {OBSTACLE_WIDTH} left = {obstacleLeft} />
 
}



export default App;



//Game Objects

//Create the object that navigates the scene.
const Player = styled.div `
position: absolute;
margin-left: 25%;
background-color: red;
height: ${(props) => props.size}px;
width: ${(props) => props.size}px;
top: ${(props) => props.top}px;
border-radius: 50%;
`;

//Create the object that centre's the flying object
const CenteringItem = styled.div `
  display: flex;
  width: 100%;
  justify-content: center;
  & span {
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

//Create the frame that surrounds the game scene.
const GameFrame = styled.div `
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: rgb(6, 150, 300);
  overflow: hidden;
`;
//add a sun to th game scene.
const Sun = styled.div `
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: yellow;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50px;
`;

//Create the obstacles which will move across the screen.
const Obstacle = styled.div `
  position: relative;
  background-color: green;
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;