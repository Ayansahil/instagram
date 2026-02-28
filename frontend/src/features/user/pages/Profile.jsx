import { useEffect, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { useUser } from "../hooks/useUser";
import { useFollow } from "../hooks/useFollow";
import ProfileHeader from "../components/ProfileHeader";
import FollowersModal from "../components/FollowersModal";
import EditProfile from "../components/EditProfile";
import Post from "../../post/components/Post";
import "../styles/profile.scss";

const Profile = () => {
    const { user: currentUser } = useAuth();
    const { userProfile, userPosts, loading, handleGetUserProfile, handleGetUserPosts, handleFollowUser, handleUnfollowUser } = useUser();
    
    // ✅ Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    
    // ✅ Follow hook
    const {
        followers,
        following,
        loading: followLoading,
        handleGetFollowers,
        handleGetFollowing,
        handleFollowToggle,
    } = useFollow();

    useEffect(() => {
        if (currentUser?.username) {
            handleGetUserProfile(currentUser.username);
            handleGetUserPosts(currentUser.username);
        }
    }, [currentUser?.username]);

    // ✅ Open followers modal
    const openFollowersModal = () => {
        setModalType("followers");
        setModalOpen(true);
        handleGetFollowers(currentUser.username);
    };

    // ✅ Open following modal
    const openFollowingModal = () => {
        setModalType("following");
        setModalOpen(true);
        handleGetFollowing(currentUser.username);
    };

    if (loading || !userProfile) return <div className="profile-page"><p style={{ textAlign: "center", padding: "40px" }}>Loading...</p></div>;

    return (
        <main className="profile-page">
            <div className="profile-container">
                <ProfileHeader
                    userProfile={userProfile}
                    isFollowing={userProfile.isFollowing}
                    followStatus={userProfile.followStatus}
                    onFollow={() => handleFollowUser(userProfile.username)}
                    onUnfollow={() => handleUnfollowUser(userProfile.username)}
                    postsCount={userPosts.length}
                    onFollowersClick={openFollowersModal} 
                    onFollowingClick={openFollowingModal} 
                    onEditProfile={() => setIsEditProfileOpen(true)}
                />

                {/* Posts Grid */}
                <div className="profile-posts">
                    <h2>Posts</h2>
                    <div className="posts-grid">
                        {userPosts.length > 0 ? (
                            userPosts.map((post) => (
                                <Post key={post._id} post={post} />
                            ))
                        ) : (
                            <p style={{ textAlign: "center", color: "#8e8e8e" }}>No posts yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ✅ Modal */}
            <FollowersModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                type={modalType}
                users={modalType === "followers" ? followers : following}
                loading={followLoading}
                onFollowToggle={handleFollowToggle}
            />

            {isEditProfileOpen && (
                <div className="modal-overlay" onClick={() => setIsEditProfileOpen(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <EditProfile
              onClose={() => setIsEditProfileOpen(false)}
              onSaved={() => {
                setIsEditProfileOpen(false);
                if (currentUser?.username) handleGetUserProfile(currentUser.username);
              }}
            />
                    </div>
                </div>
            )}
        </main>
    );
};

export default Profile;