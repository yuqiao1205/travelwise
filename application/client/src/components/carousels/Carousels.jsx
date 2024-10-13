import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import header2 from '../../img/header4.jpg';
import header3 from '../../img/sf-bridge1.jpg';
import header4 from '../../img/tower-bridge.jpg';
import header5 from '../../img/shanghai-header.jpg';
import './carousels.css';

function CarouselPage() {
  return (
    <div id='topElement' className='carousel-container'>
      <Carousel>
        <Carousel.Item interval={1500}>
          <img
            className='d-block w-100 carousel_item'
            src={header2}
            alt='first img'
          />
          <Carousel.Caption style={{ color: 'black' }}>
            <h3>Caribbean Beach</h3>
            <p>
              Caribbean Beach is a picturesque tropical paradise, known for its
              pristine white sands, crystal-clear turquoise waters, and lush
              palm-fringed coastline
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={1500}>
          <img
            className='d-block w-100 carousel_item'
            src={header3}
            alt='second img'
          />
          <Carousel.Caption>
            <h3>San Franciso</h3>
            <p>
              The San Francisco Golden Gate Bridge stands as an iconic symbol of
              engineering marvel and architectural beauty, spanning gracefully
              across the majestic bay.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={1500}>
          <img
            className='d-block w-100 carousel_item'
            src={header4}
            alt='third img'
          />
          <Carousel.Caption>
            <h3>London Tower Bridge</h3>
            <p>
              The London Tower Bridge, with its striking neo-Gothic towers and
              intricate Victorian design, commands the River Thames with
              timeless elegance and historic significance.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item interval={1500}>
          <img
            className="d-block w-100 carousel_item"
            src={header5}
            alt='4th img'
          />
          <Carousel.Caption>
            <h3>Shanghai City</h3>
            <p>
              Shanghai City, a bustling metropolis known for its stunning
              skyline, rich history, and vibrant culture, is a dynamic blend of
              traditional Chinese heritage and modern innovation.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default CarouselPage
