import { React } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import './card.css'
import Like from '../like/Like'
// import Follower from '../follower/Follower'
import SaveToFavorites from '../favorite/Savefavorite'
import PropTypes from 'prop-types'

export default function CustomCard ({ id, img, title, desc, date, postUserId }) {
  const defaultImageUrl = 'https://picsum.photos/id/16/300'

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent
  }

  const formatImageUri = (uri) => {
    return uri && uri.startsWith('http') ? uri : (uri ? `../../upload/${uri}-thumbnail.jpg` : defaultImageUrl)
  }

  return (
    <Card className="custom-card">
      <Link to={`/singlepost/${id}`} className="card-img-link">
        <Card.Img variant="top" style={{ width: '100%', height: '180px', objectFit: 'cover' }} src={formatImageUri(img)} alt="" />
      </Link>
      <div className="card-icons">
        <Like postId={id} /> &nbsp;&nbsp;
        {/* <SaveToFavorites postId={id} userId={postUserId} /> */}
        <SaveToFavorites postId={id} postUserId={postUserId}/>

      </div>
      <Card.Body>
        <Link className="link" to={`/singlepost/${id}`}>
          <Card.Title className="foo">{title}</Card.Title>
          <hr />
          <Card.Text>{moment(date).fromNow()}</Card.Text>
          <Card.Text>{getText(desc)}</Card.Text>
          <div>

            <Button variant="primary" className="card-button">Read More &gt;&gt;</Button>

          </div>
        </Link>
        {/* <Follower className="follow-icon" userId={postUserId} /> */}

      </Card.Body>
    </Card>
  )
}

CustomCard.propTypes = {
  id: PropTypes.number.isRequired,
  img: PropTypes.string,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  postUserId: PropTypes.number.isRequired
}
