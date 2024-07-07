import { useState, useEffect } from 'react';
import axios from 'axios';
import Scene from './components/Scene';
import './App.css';

function App() {  
  const [currentSceneId, setCurrentSceneId] = useState(1);
  const [currentScene, setCurrentScene] = useState(null);

  useEffect(() => {
    const fetchScene = async (sceneId) => {
      try {
        const response = await axios.get(`http://localhost:3000/scenes/${sceneId}`);
        setCurrentScene(response.data);
      } catch (error) {
        console.error('Error fetching scene or character data', error);
      }
    };

    fetchScene(currentSceneId);
  }, [currentSceneId]);

  const handleChoice = (nextSceneId) => {
    setCurrentSceneId(nextSceneId);
  };

  console.log(currentScene);

  return (
    <div className='App'>
      {currentScene ? (
        <Scene scene={currentScene} onChoice={handleChoice}/>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
