import React from 'react';
import './css/Carousel.css'
import Carousels from 'react-bootstrap/Carousel'


const Carousel = () => {
    return <div className="background">

        <Carousels controls={false} indicators={false}>
            <Carousels.Item >
                <img className="w-100" src="data_share.png" alt="data_share_pic" />
            </Carousels.Item>

            <Carousels.Item >
                <img src="data_share2.png" alt="data_share_pic" />
            </Carousels.Item>

        </Carousels>

        <div className="blackLayer">

        </div>

    </div>;
}


export default Carousel;