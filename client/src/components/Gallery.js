import React from "react";
import AliceCarousel from 'react-alice-carousel';
import s from './gallery.module.css';
import 'react-alice-carousel/lib/alice-carousel.css';

const handleDragStart = (e) => e.preventDefault();

export const Gallery = ({gallery}) => {

    const {images, time} = gallery;

    if(!images) {
        return null;
    }

    const items = images.map((image) =>
        <img src={image} onDragStart={handleDragStart} className={s.image} alt={'no image'}/>
    )

    return (
        <AliceCarousel
            mouseTracking
            autoPlayInterval={time * 1000}
            autoHeight={true}
            autoWidth={true}
            autoPlay={true}
            items={items}
            infinite={true}
        />
    );
}
