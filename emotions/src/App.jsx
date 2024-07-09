import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Scene from './components/Scene';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

function App() {  
    const [currentSceneId, setCurrentSceneId] = useState(1);
    const [currentScene, setCurrentScene] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState('');

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

    useEffect(() => {
        if (userId) {
            const fetchUser = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/user/${userId}`);
                    setUsername(response.data.username);
                } catch (error) {
                    console.error('Error fetching user data', error);
                }
            };

            fetchUser();
        }
    }, [userId]);

    const handleChoice = (nextSceneId) => {
        setCurrentSceneId(nextSceneId);
    };

    const handleRegister = (userId) => {
        setUserId(userId);
    };

    const handleLogin = (userId) => {
        setUserId(userId);
    };

    console.log(currentScene);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/register" element={<Register onRegister={handleRegister} />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/scene" element={
                        userId ? (
                            currentScene ? (
                                <Scene scene={currentScene} onChoice={handleChoice} username={username} />
                            ) : (
                                <p>Loading...</p>
                            )
                        ) : (
                            <Navigate to="/login" />
                        )
                    } />
                    <Route path="/" element={
                        <div className='container'>
                            <h1>Welcome to the App</h1>
                            <Link to="/register">
                                <button>Go to Register</button>
                            </Link>
                            <br />
                            <Link to="/login">
                                <button>Login</button>
                            </Link>
                        </div>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
