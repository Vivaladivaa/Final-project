import React, { useState, useRef, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import axios from "axios";
import '../App.css';

function Scene({ scene, onChoice, username, userId, onLogout }) {
    const [message, setMessage] = useState('');
    const [characters, setCharacters] = useState([]);
    const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
    const [showCharacters, setShowCharacters] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        const isMusicPlaying = localStorage.getItem('isMusicPlaying') === 'true';
        if (audioRef.current && isMusicPlaying) {
            audioRef.current.play();
        }
    }, []);

    useEffect(() => {
        if (scene && scene.scene_id === 125) {
            setShowRatingModal(true);
        }
    }, [scene]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && audioRef.current) {
                audioRef.current.play();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const backgroundImageStyle = {
        backgroundImage: scene ? `url("${scene.background_image_url}")` : 'none',
        width: '1100px',
        height: '715px',
        backgroundSize: 'cover',
        transition: 'background-image 0.2s ease-in-out'
    };

    const handleSave = async () => {
        try {
            await axios.post('http://localhost:3000/save', {
                userId,
                sceneId: scene.scene_id,
            });
            setMessage('Игра успешно сохранена!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Ошибка при сохранении игры', error);
            setMessage('Ошибка при сохранении игры');
        }
    };

    const handleLoad = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/load/${userId}`);
            const savedSceneId = response.data.scene_id;
            onChoice(savedSceneId);
        } catch (error) {
            console.error('Error loading game', error);
            setMessage('Failed to load the game');
        }
    };

    const handleMusicPlay = () => {
        if (audioRef.current) {
            audioRef.current.play();
            localStorage.setItem('isMusicPlaying', 'true');
        }
    };

    const handleMusicPause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            localStorage.setItem('isMusicPlaying', 'false');
        }
    };

    const handleShowCharacters = async () => {
        try {
            const response = await axios.get('http://localhost:3000/characters');
            setCharacters(response.data);
            setShowCharacters(true);
        } catch (error) {
            console.error('Error fetching characters', error);
            setMessage('Failed to fetch characters');
        }
    };

    const handleNextCharacter = () => {
        setCurrentCharacterIndex((prevIndex) => (prevIndex + 1) % characters.length);
    };

    const handlePreviousCharacter = () => {
        setCurrentCharacterIndex((prevIndex) => (prevIndex - 1 + characters.length) % characters.length);
    };

    const handleRatingChange = (e) => {
        setRating(Number(e.target.value));
    };

    const handleRatingSubmit = async () => {
        try {
            await axios.post('http://localhost:3000/rate', {
                userId,
                sceneId: scene.scene_id,
                rating,
            });
            setShowRatingModal(false);
            setMessage('Спасибо за оценку!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Ошибка при отправке оценки', error);
            setMessage('Ошибка при отправке оценки');
        }
    };

    if (!scene) {
        return <p>Loading...</p>;
    }

    return (
        <div className="mainScene">
            <p>Добро пожаловать, {username}!</p>
            <button onClick={onLogout}>Выйти</button>
            <button onClick={handleSave}>Сохранить</button>
            <button onClick={handleLoad}>Загрузить</button>
            <button onClick={handleMusicPlay}>Включить музыку</button>
            <button onClick={handleMusicPause}>Остановить музыку</button>
            <button onClick={handleShowCharacters}>Персонажи</button>
            {message && <p>{message}</p>}
            <div className="scene" style={backgroundImageStyle}>
                <div className="choices">
                    {scene.choices.map((choice, index) => (
                        <button className="choiceBtn" key={index} onClick={() => onChoice(choice.next_scene_id)}>
                            {choice.text}
                        </button>
                    ))}
                </div>
                <div className="circleBg">
                    <img src={scene.character.image_url} alt="Main Character" className="character"/>
                </div>
                <div className="dialoguesBg">
                    <TransitionGroup>
                        <CSSTransition key={scene.scene_id} timeout={500} classNames="fade">
                            <div className="dialogues">
                                {scene.dialogues && scene.dialogues.map((dialogue, index) => (
                                    <p key={index}>{dialogue.text}</p>
                                ))}
                            </div>
                        </CSSTransition>
                    </TransitionGroup>
                </div>
            </div>
            {showCharacters && characters.length > 0 && (
                <div className="characterModal">
                    <div className="characterModalContent">
                        <button onClick={() => setShowCharacters(false)}>Закрыть</button>
                        <div className="characterCarousel">
                            <button onClick={handlePreviousCharacter}>Назад</button>
                            <div className="characterDetails">
                                <h3>{characters[currentCharacterIndex].name}</h3>
                                <img src={characters[currentCharacterIndex].image_url} alt={characters[currentCharacterIndex].name} />
                                <p>
                                    {characters[currentCharacterIndex].description.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))}
                                </p>
                            </div>
                            <button onClick={handleNextCharacter}>Далее</button>
                        </div>
                    </div>
                </div>
            )}
            {showRatingModal && (
                <div className="ratingModal">
                    <div className="ratingModalContent">
                        <h2>Оцените серию</h2>
                        <div className="ratingOptions">
                            {[1, 2, 3, 4, 5].map((rate) => (
                                <label key={rate}>
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={rate}
                                        checked={rating === rate}
                                        onChange={handleRatingChange}
                                    />
                                    {rate}
                                </label>
                            ))}
                        </div>
                        <button onClick={handleRatingSubmit}>Отправить</button>
                    </div>
                </div>
            )}
            <audio ref={audioRef} src="/music/SunlitDays.mp3" loop autoPlay />
        </div>
    );
}

export default Scene;
