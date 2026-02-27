import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CreatePostModal from "../components/CreatePostModal";
import { usePost } from "../hooks/usePost";
import "../styles/sidebar.scss";

// ─── Instagram-style SVG Icons ────────────────────────────────────────────────

const HomeIcon = ({ filled }) =>
  filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M22 9.556C22 10.24 21.69 10.89 21.16 11.32L12.64 18.21C12.28 18.49 11.72 18.49 11.36 18.21L2.84 11.32C2.31 10.89 2 10.24 2 9.556V4.222C2 2.994 3.01 2 4.255 2H19.745C20.99 2 22 2.994 22 4.222V9.556z" />
      <path d="M15 22H9V16.5C9 15.672 9.672 15 10.5 15H13.5C14.328 15 15 15.672 15 16.5V22z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const ExploreIcon = ({ filled }) =>
  filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.6 6.4l-5.3 2.65a1 1 0 00-.453.453L7.2 16.8l5.3-2.65a1 1 0 00.453-.453L15.6 8.4z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );

const ReelsIcon = ({ filled }) =>
  filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1.5 5l7 5-7 5V7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  );

const MessageIcon = ({ filled }) =>
  filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12.003 2.001a9.705 9.705 0 110 19.41 10.437 10.437 0 01-4.592-1.073l-4.498 1.123 1.124-4.461a9.706 9.706 0 017.966-15z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );

const NotificationIcon = ({ filled }) =>
  filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.77 2.44-2.12 4.98-4.32 4.98-7.944a6.985 6.985 0 00-6.708-7.218z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );

const CreateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const ProfileIcon = ({ filled }) =>
  filled ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 2a5 5 0 110 10A5 5 0 0112 2zm0 12c5.523 0 10 2.239 10 5v1H2v-1c0-2.761 4.477-5 10-5z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

// ─── Sidebar Component ────────────────────────────────────────────────────────

const Sidebar = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { handleCreatePost, loading } = usePost();
  const location = useLocation();
  const navigate = useNavigate();

  const handlePostSubmit = async ({ image, caption }) => {
    try {
      await handleCreatePost(image, caption);
      setIsCreateModalOpen(false);
      navigate("/");
    } catch (error) {
      // Error handled in hook
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: <HomeIcon filled={isActive("/")} />,
    },
    {
      label: "Search",
      path: "/search",
      icon: <SearchIcon />,
    },
    {
      label: "Explore",
      path: "/explore",
      icon: <ExploreIcon filled={isActive("/explore")} />,
    },
    {
      label: "Reels",
      path: "/reels",
      icon: <ReelsIcon filled={isActive("/reels")} />,
    },
    {
      label: "Messages",
      path: "/messages",
      icon: <MessageIcon filled={isActive("/messages")} />,
    },
    {
      label: "Notifications",
      path: "/notifications",
      icon: <NotificationIcon filled={isActive("/notifications")} />,
    },
    {
      label: "Create",
      action: () => setIsCreateModalOpen(true),
      icon: <CreateIcon />,
      isCreate: true,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: <ProfileIcon filled={isActive("/profile")} />,
    },
  ];

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-logo">Instagram</div>
        <nav className="sidebar-nav">
          {navItems.map((item) =>
            item.path ? (
              <Link
                key={item.label}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ) : (
              <button
                key={item.label}
                onClick={item.action}
                className="nav-item"
                data-create={item.isCreate || undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            )
          )}
        </nav>
      </aside>

      {/* Create post modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handlePostSubmit}
        loading={loading}
      />
    </>
  );
};

export default Sidebar;