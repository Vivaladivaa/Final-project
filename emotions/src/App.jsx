import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Scene from './components/Scene';
import './App.css';

function App() {
    const [currentSceneId, setCurrentSceneId] = useState(localStorage.getItem('currentSceneId') || 1);
    const [currentScene, setCurrentScene] = useState(null);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

    useEffect(() => {
        const fetchScene = async (sceneId) => {
            try {
                const response = await axios.get(`http://localhost:3000/scenes/${sceneId}`);
                setCurrentScene(response.data);
            } catch (error) {
                console.error('Error fetching scene or character data', error);
            }
        };

        if (username) {
            fetchScene(currentSceneId);
        }
    }, [currentSceneId, username]);

    const handleChoice = (nextSceneId) => {
        setCurrentSceneId(nextSceneId);
        localStorage.setItem('currentSceneId', nextSceneId);
    };

    const handleLogin = (username, userId) => {
        setUsername(username);
        setUserId(userId);
        localStorage.setItem('username', username);
        localStorage.setItem('userId', userId);
    };

    const handleLogout = () => {
        setUsername('');
        setUserId('');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('currentSceneId');
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div className="container">
                                <div className='logoContainer'>
                                    <img src="/backgrounds/Logo.svg" alt="" />
                                    <h1>Emotions</h1>
                                    <h2>choose your love</h2>
                                </div>
                                <div className='btnContainer'>
                                    <Link to="/register">
                                        <button>Регистрация</button>
                                    </Link>
                                    <Link to="/login">
                                        <button>Вход</button>
                                    </Link>
                                </div>
                                <div className='imageContainer'>
                                    <img className='desc1' src="/backgrounds/Desc1.png" alt="" />
                                    <div className='desc2'>
                                        <div className='desc2Top'>
                                            <img src="/backgrounds/Screpk.png" alt="" />
                                            <div className='list'>
                                                <p className='listDesc1'>Episode 1</p>
                                                <p className='listDesc2'>Ты - новоиспеченная студентка академии «Вестериа Лейн» и тебе до сих пор пока сложно свыкнуться с этой мыслью. Придется выйти из зоны комфорта и подружиться с новыми людьми, ведь кто знает, может в будущем полезные знакомства смогут сыграть тебе на руку...</p>
                                            </div>
                                        </div>
                                    </div>
                                    <img className='desc3' src="/backgrounds/Desc3.png" alt="" />
                                </div>
                            </div>
                        }
                    />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/login"
                        element={<Login onLogin={handleLogin} />}
                    />
                    <Route
                        path="/scene"
                        element={
                            username ? (
                                <Scene scene={currentScene} onChoice={handleChoice} username={username} userId={userId} onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
