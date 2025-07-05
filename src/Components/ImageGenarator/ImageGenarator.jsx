import React, { useRef, useState } from 'react';
import './ImageGenarator.css';
import defaultImage from '../Assets/defult_image.svg.webp'; // Update path/filename as needed

const ImageGenerator = () => {

    const [image_url,set_image_url]=useState("/");
    let inputRef=useRef(null);
    const [loading,setloading]=useState(false);

    const generateImage = async () => {
        if (inputRef.current.value === "") {
            return;
        }
        setloading(true);
        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer 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",
                    "user-Agent": "chrome",
                },
                body: JSON.stringify({
                    prompt: inputRef.current.value,
                    n: 1,
                    size: "512x512",
                }),
            }
        );
        let data = await response.json();
        console.log(data);
        if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
            alert("Failed to generate image. Please try again.");
            setloading(false);
            return;
        }
        set_image_url(data.data[0].url);
        setloading(false);
    };

    return (
        <div className="ai-image-generator">
            <div className="header">
                AI Image <span>Generator</span>
            </div>
            <div className="img-loading">
                <div className="image">
                    <img src={image_url === "/" ? defaultImage : image_url} alt="Default AI generated" />
                    <div className='loading'>
                        <div className={loading ? "loading-bar-full" : "loading-bar"}> </div>
                        <div className={loading ? "loading-text" : "display-none"}>Loading...</div>
                    </div>
                </div>
            </div>
            <div className='search-box'>
                <input type='text' ref={inputRef} className='search-input' placeholder='Describe what you want to see'/>
                <div className='genarate-btn' onClick={() => { generateImage() }}>Genarate</div>
            </div>
        </div>
    );
};

export default ImageGenerator;
