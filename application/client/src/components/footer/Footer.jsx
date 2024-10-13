import React from 'react'
import './footer.css'
// import SubscribeForm from '../subscribe/SubscribeForm'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer>
      <div className='my-footer'>
        <Container className='footer-wrapper'>
          <Row>
            <Col className='foot-col'>
              <h2>About TravelWise</h2>
              <span>TravelWise aim to give you the best and most up-to-date information on the major travel destinations around the world.Here you will find things to see and do, information about costs, recommendations on places to stay, suggested restaurants, transportation tips, and safety advice.</span>
            </Col>
            <Col className='foot-col'>
              <h2>Contact Information</h2>
              <span>https://tp2024.westus3.cloudapp.azure.com</span>
              <span>Phone: +1(415) 123-4567</span>
              <span>Email: TravelWise@example.com</span>
              <span>GitHub: TravelWise</span>
            </Col>
            <Col className='foot-col'>
              <h2>Location</h2>
              <span>San Francisco State University</span>
              <span>Thronton Hall 543 </span>
              <span>1600 Holloway Ave</span>
              <span>San Francisco,CA 94116</span>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  )
}

export default Footer
