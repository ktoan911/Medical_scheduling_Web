import React, { useState, useEffect, useRef } from 'react';
import slide1 from '../../assets/slide1.jpg';
import slide2 from '../../assets/slide2.jpg';
import slide3 from '../../assets/slide3.jpg';
import slide4 from '../../assets/slide4.jpg';
import slide5 from '../../assets/slide5.jpg';

const Slider = () => {
    const [active, setActive] = useState(0);
    const sliderList = useRef(null);
    const refreshSlider = useRef(null);

    const items = [
        { src: slide1, alt: "slide1" },
        { src: slide2, alt: "slide2" },
        { src: slide3, alt: "slide3" },
        { src: slide4, alt: "slide4" },
        { src: slide5, alt: "slide5" }
    ];

    const lengthItems = items.length - 1;

    const reloadSlider = () => {
        if (sliderList.current) {
            let checkLeft = sliderList.current.children[active].offsetLeft;
            sliderList.current.style.left = -checkLeft + 'px';

            let dots = document.querySelectorAll('.slider .dots li');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === active);
            });

            clearInterval(refreshSlider.current);
            refreshSlider.current = setInterval(() => { setActive((prev) => (prev + 1) % items.length) }, 5000);
        }
    };

    useEffect(() => {
        reloadSlider();
    }, [active]);

    useEffect(() => {
        refreshSlider.current = setInterval(() => { setActive((prev) => (prev + 1) % items.length) }, 5000);
        return () => clearInterval(refreshSlider.current);
    }, []);

    return (
        <div className="slider">
            <div className="list" ref={sliderList}>
                {items.map((item, index) => (
                    <div className="item" key={index}>
                        <img src={item.src} alt={item.alt} />
                    </div>
                ))}
            </div>

            {/* Nut tien lui */}
            <div className="buttons">
                <button id="prev" onClick={() => setActive(active - 1 < 0 ? lengthItems : active - 1)}>&lt;</button>
                <button id="next" onClick={() => setActive((active + 1) % items.length)}>&gt;</button>
            </div>

            {/* Dau cham bam chuyen slide */}
            <ul className="dots">
                {items.map((item, index) => (
                    <li key={index} className={index === active ? 'active' : ''} onClick={() => setActive(index)}></li>
                ))}
            </ul>
        </div>
    );
};

export default Slider;
