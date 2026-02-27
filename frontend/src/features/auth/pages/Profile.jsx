import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./profile.scss";

const Profile = () => {
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        await handleLogout();
        navigate("/login", { replace: true });
    };

    if (!user) return null;

    return (
        <main className="profile-page">
            <div className="profile-card">
                {/* ── Avatar ── */}
                <div className="profile-avatar-wrap">
                    <div className="profile-avatar-ring">
                        <img
                            src={user.profileImage || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                            alt={user.username}
                            className="profile-avatar"
                            onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${user.username}&background=random`;
                            }}
                        />
                    </div>
                </div>

                {/* ── Info ── */}
                <div className="profile-info">
                    <h1 className="profile-username">{user.username}</h1>
                    {user.email && <p className="profile-email">{user.email}</p>}
                    {user.bio && <p className="profile-bio">{user.bio}</p>}

                    <div className="profile-stats">
                        <div className="stat">
                            <span className="stat-count">0</span>
                            <span className="stat-label">posts</span>
                        </div>
                        <div className="stat">
                            <span className="stat-count">0</span>
                            <span className="stat-label">followers</span>
                        </div>
                        <div className="stat">
                            <span className="stat-count">0</span>
                            <span className="stat-label">following</span>
                        </div>
                    </div>
                </div>

                {/* ── Actions ── */}
                <div className="profile-actions">
                    <button className="btn btn-secondary">Edit Profile</button>
                    <button className="btn btn-logout" onClick={onLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Log Out
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Profile;
