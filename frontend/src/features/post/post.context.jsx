import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState(null);
    const [feed, setFeed] = useState(null);

    /** Prepend a newly created post to the top of the feed */
    const prependPost = (newPost) => {
        setFeed((prev) => (prev ? [newPost, ...prev] : [newPost]));
    };

    return (
        <PostContext.Provider
            value={{ loading, setLoading, post, setPost, feed, setFeed, prependPost }}
        >
            {children}
        </PostContext.Provider>
    );
};