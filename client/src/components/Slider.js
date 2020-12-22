import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import React from "react";


export const Slider = ({gallery}) => {

    const {images, time} = gallery;

    console.log('Slider images', images[0]);

    const items = images.map(image =>
        <div data-src={image} />
    );

    console.log('Slider items', items);

    return (
        <AwesomeSlider transitionDelay={time * 1000}>
            { items }
        </AwesomeSlider>
    );
}

