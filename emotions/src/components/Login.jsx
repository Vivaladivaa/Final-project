import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Предотвращаем действие по умолчанию

        try {
            const response = await axios.post('http://localhost:3000/login', {
                username,
                password,
            });

            // Убедитесь, что response.data содержит ожидаемые данные
            if (response.data && response.data.username && response.data.user_id) {
                onLogin(response.data.username, response.data.user_id); // Передаем username и user_id в App
                navigate('/scene'); // Перенаправляем на компонент Scene
            } else {
                setMessage('Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during login', error);
            setMessage('Invalid username or password');
        }
    };

    return (
        
        <div className="loginMain">
            <div className='logoContainer'>
                <img src="/backgrounds/Logo.svg" alt="" />
                <h1>Emotions</h1>
                <h2>choose your love</h2>
            </div>
            <form className='login' onSubmit={handleSubmit}>
            <h2>Вход</h2>
                <div>
                    <label>Имя:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Пароль:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Отправить</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;
