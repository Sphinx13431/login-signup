import React, { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    age: 10,
    grade: "5th Grade",
    learningStyle: "Visual",
    favoriteSubjects: ["Math", "Science"],
    challenges: ["Dyslexia"],
    fontSize: "16px",
    themeColor: "#ffcc80",
  });

  return (
    <div className="profile-container" style={{ backgroundColor: profile.themeColor }}>
      <h1>Profile Page</h1>

      <div className="profile-card">
        <img src="https://via.placeholder.com/100" alt="Profile" className="profile-img" />
        <h2>{profile.name}</h2>
        <p><strong>Age:</strong> {profile.age}</p>
        <p><strong>Grade:</strong> {profile.grade}</p>
      </div>

      <div className="profile-details">
        <h3>Learning Preferences</h3>
        <p><strong>Preferred Learning Style:</strong> {profile.learningStyle}</p>
        <p><strong>Favorite Subjects:</strong> {profile.favoriteSubjects.join(", ")}</p>
        <p><strong>Challenges Faced:</strong> {profile.challenges.join(", ")}</p>
      </div>

      <div className="profile-settings">
        <h3>Customization</h3>
        <label>Font Size: </label>
        <select
          value={profile.fontSize}
          onChange={(e) => setProfile({ ...profile, fontSize: e.target.value })}
        >
          <option value="14px">Small</option>
          <option value="16px">Medium</option>
          <option value="18px">Large</option>
        </select>

        <label>Theme Color: </label>
        <input
          type="color"
          value={profile.themeColor}
          onChange={(e) => setProfile({ ...profile, themeColor: e.target.value })}
        />
      </div>
    </div>
  );
};

export default Profile;

