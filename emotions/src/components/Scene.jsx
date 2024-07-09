import React from "react";
import '../App.css';


function Scene({ scene, onChoice, username }) {
    const backgroundImageStyle = {
        backgroundImage: `url("${scene.background_image_url}")`,
        width: '1100px',
        height: '715px',
        backgroundSize: 'cover'
    };

    return (
        <div className="mainScene">
            <p>Welcome, {username}!</p>
            <div className="scene" style={backgroundImageStyle}>
                <h1>{scene.title}</h1>
                <p>{scene.description}</p>
                <div className="choices">
                    {scene.choices.map((choice, index) => (
                        <button key={index} onClick={() => onChoice(choice.next_scene_id)}>
                            {choice.text}
                        </button>
                    ))}
                </div>
                <div className="circleBg">
                    <img src={scene.character.image_url} alt="Main Character" className="character"/>
                </div>
                <div className="dialoguesBg">
                    <div className="dialogues">
                            {scene.dialogues && scene.dialogues.map((dialogue, index) => (
                                <p key={index}>{dialogue.text}</p>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Scene;