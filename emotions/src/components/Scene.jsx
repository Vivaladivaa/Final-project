import React from "react";
import '../App.css';


function Scene({ scene, onChoice }) {
    const backgroundImageStyle = {
        backgroundImage: `url("${scene.background_image_url}")`,
        width: '100%',
        height: '100vh',
        backgroundSize: 'cover'
    };

    return (
        <div className="scene" style={backgroundImageStyle}>
            <h1>{scene.title}</h1>
            <p>{scene.description}</p>
            <div className="dialogues">
                    {scene.dialogues && scene.dialogues.map((dialogue, index) => (
                        <p key={index}>{dialogue.text}</p>
                    ))}
            </div>
            <img src={scene.character.image_url} alt="Main Character" className="character"/>
            <div className="choices">
                {scene.choices.map((choice, index) => (
                    <button key={index} onClick={() => onChoice(choice.next_scene_id)}>
                        {choice.text}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Scene;