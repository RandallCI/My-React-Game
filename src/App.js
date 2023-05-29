import './App.css';
import styled from "styled-components";
import { useEffect, useState } from 'react';

//Properties
const PLAYER_SIZE = 50;
const GAME_WIDTH = 750;
const GAME_HEIGHT = 700;
const GRAVITY = 9;
const LIFT_HEIGHT = 145;
const OBSTACLE_WIDTH = 50;
const OBSTACLE_GAP = 150

function App() {
  //Set the player position and position the player initially.
  const [playerPosition, setPlayerPosition] = useState(250);
  //Set an initial start time for the game.
  const [gameHasStarted, setGameHasStarted] = useState(false);
  //Create the game obstacles and set their heights.
  const [obstacleHeight, setObstacleHeight] = useState(100);
  //Set the size and position of the left most starting point of the obstacle.
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  //Set the height of the obstacle at the bottom of the screen.
  const bottomObstacleHeight = GAME_HEIGHT - obstacleHeight - OBSTACLE_GAP;
;
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
      setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)));
    }
  }, [gameHasStarted, obstacleLeft]);

  useEffect(() => {
    const playerHasColidedWithTop = playerPosition >= 0 && playerPosition < obstacleHeight;
    const playerHasCollidedWithBottom = playerPosition >= 500 && playerPosition >= 500 - bottomObstacleHeight

    if (obstacleLeft >= 0 && obstacleLeft <= OBSTACLE_WIDTH && (playerHasColidedWithTop || playerHasCollidedWithBottom)) {
      setGameHasStarted(false);
    };

  }, [playerPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft])

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
      <GameFrame height = {GAME_HEIGHT} width = {GAME_WIDTH}>
      {/* Set the top obstacle. */}
      <Obstacle top = {0} height = {obstacleHeight} width = {OBSTACLE_WIDTH} left = {obstacleLeft} />
      {/* Set the bottom obstacle. */}
      <Obstacle top = {GAME_HEIGHT - obstacleHeight - bottomObstacleHeight} 
      height = {bottomObstacleHeight} 
      width = {OBSTACLE_WIDTH} 
      left = {obstacleLeft} />
      {/* Set th player */}
      <Player size = {PLAYER_SIZE} top = {playerPosition}/>
      </GameFrame>
    </CenteringItem>
  );

 
}



export default App;



//Game Objects

//Create the object that navigates the scene.
const Player = styled.div `
position: absolute;
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
`;

//Create the frame that surrounds the game scene.
const GameFrame = styled.div `
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: blue;
  overflow: hidden;
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