// UserProfile.js
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import './userProfile.css';
import Follower from '../../components/follower/Follower';
import { AuthContext } from '../../context/authContext';
// Remove the unused import statement for 'PropTypes'
import PropTypes from 'prop-types';
// import DefaultUser1 from '../../img/defaultuser.png'

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);
  // const { isAuthenticated, user: authUser } = useContext(AuthContext)

  const { isAuthenticated } = useContext(AuthContext);
  const DefaultUser1 = 'https://picsum.photos/id/501/100';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/users/${userId}`);
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user profile');
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const numericUserId = Number(userId);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/usersetting/${numericUserId}`);
  };

  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Loading...</div>;


  return (
    <>
      <div className="userprofile-container">
        <div className="userprofile">
          <h1 className="userprofile-title">User Profile</h1>
          

          <Container>
            <Row>
              {/* <Col sm> Welcome </Col> */}
              <Col className="profile-img-container" sm>
                <div
                  onClick={
                    currentUser && currentUser.id === numericUserId
                      ? () => navigate(`/usersetting/${numericUserId}`)
                      : undefined
                  }
                >
                  <img
                    className="profile-img"
                    src={user.img || DefaultUser1}
                    alt=""
                  />
                </div>

                {/* <img className="profile-img" src={user.img || DefaultUser1} alt="" /> */}
              </Col>

              <Col sm>
                <div>
                  {currentUser && currentUser.id === numericUserId && (
                    <button className="profile-edit" onClick={handleEdit}>
                Edit
                    </button>
                  )}
                </div>
                <div className="follower-option">
                  <Follower
                    userId={numericUserId}
                    isAuthenticated={isAuthenticated}
                  />
                </div>
                <div className="userprofile-info">
                  <p>
                    <strong>User Name:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Full Name:</strong> {user.fullname}
                  </p>
                  <p>
                    <strong>Nick Name:</strong> {user.nickname}
                  </p>
                  <p>
                    <strong>City:</strong> {user.city}
                  </p>
                  <p>
                    <strong>Interest:</strong> {user.interest}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

UserProfile.propTypes = {
  userId: PropTypes.number,
};

export default UserProfile;
