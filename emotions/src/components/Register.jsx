import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/register', {
                username,
                email,
                password,
            });
            setMessage('Registration successful!');
            navigate('/login'); // Перенаправляем на компонент Login
        } catch (error) {
            console.error('Error during registration', error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Registration failed');
            }
        }
    };

    return (
        <div className='registerMain'>
            <div className='logoContainer'>
                <img src="/backgrounds/Logo.svg" alt="" />
                <h1>Emotions</h1>
                <h2>choose your love</h2>
            </div>
            <form className="register" onSubmit={handleSubmit}>
                <h2>Регистрация</h2>
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
                    <label>E-mail:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

export default Register;
