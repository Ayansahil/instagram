import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Feed from "./Feed";
import CreatePostModal from "../components/CreatePostModal";
import { usePost } from "../hooks/usePost";


const CreatePostRoute = () => {
    const navigate = useNavigate();
    const { handleCreatePost, loading } = usePost();
    const [isClosed, setIsClosed] = useState(false);

    const handleClose = () => {
        setIsClosed(true);
        navigate("/");
    };

    const handleSubmit = async ({ image, caption }) => {
        await handleCreatePost(image, caption);
        navigate("/");
    };

    return (
        <>
            {/* Feed stays visible in the background */}
            <Feed />

            {/* Modal overlays on top */}
            {!isClosed && (
                <CreatePostModal
                    isOpen={true}
                    onClose={handleClose}
                    onSubmit={handleSubmit}
                    loading={loading}
                />
            )}
        </>
    );
};

export default CreatePostRoute;
