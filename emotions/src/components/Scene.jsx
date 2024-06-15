import React from "react";

function Scene({ scene, onChoice }) {
    return (
        <div className="scene">
            <h1>{scene.title}</h1>
            <p>{scene.description}</p>
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