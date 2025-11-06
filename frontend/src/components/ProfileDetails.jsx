import "./ProfileDetails.css";

/**
 * ProfileDetails component displays user bio, location, and interests
 * @param {Object} props
 * @param {Object} props.userInfo - User information object
 * @param {string} props.userInfo.location - User's location
 * @param {string} props.userInfo.interests - User's interests
 * @param {string} props.userInfo.bio - User's biography
 */
const ProfileDetails = ({ userInfo }) => {
  if (!userInfo?.location && !userInfo?.interests && !userInfo?.bio) {
    return null;
  }

  return (
    <div className="profile-details-card">
      <h2 className="profile-details-title">About</h2>
      <div className="profile-details-content">
        {userInfo?.location && (
          <div className="profile-detail-row">
            <span className="detail-icon">📍</span>
            <div className="detail-content">
              <span className="detail-label">Location</span>
              <span className="detail-text">{userInfo.location}</span>
            </div>
          </div>
        )}
        {userInfo?.interests && (
          <div className="profile-detail-row">
            <span className="detail-icon">🏄</span>
            <div className="detail-content">
              <span className="detail-label">Interests</span>
              <span className="detail-text">{userInfo.interests}</span>
            </div>
          </div>
        )}
        {userInfo?.bio && (
          <div className="profile-detail-row bio-row">
            <span className="detail-icon">✍️</span>
            <div className="detail-content">
              <span className="detail-label">Bio</span>
              <p className="detail-bio">{userInfo.bio}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
