import Chat from '../../components/chatbot/Chat'
import './chatPage.css'
import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Aibot from '../../img/aibot.jpg'
import 'react-chatbot-kit/build/main.css'

const ChatPage = () => {
  return (
    <>
      {/* <Header2/> */}
      <Container fluid>
        <Row>
          <Col xs={3}>
            <h4 className='chatbot-title'>Ask for Plans or Advice:</h4>

            <img className='aiimg' src={Aibot} alt="aichatbot"></img>
          </Col>
          <Col xs={9}><Chat/></Col>
          {/* <Col><Rightbar/></Col> */}
        </Row>
      </Container>
    </>
  )
}

export default ChatPage
