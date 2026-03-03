import React, { useEffect, useRef } from "react";
import { usePostStore } from "../stores/post.store.js";
import PostCard from "../components/PostCard.jsx";
import { useOnInView } from "react-intersection-observer";
function HomePage() {
    const observerRef = useOnInView((inView,entry)=>{
      if(inView && hasMore && !isFetchingMore){
        console.log("IN VIEW:",entry.target);
        loadMore();
      }
    })
  
  
    const {
        isLoading,
        posts,
        isFetchingMore,
        hasMore,
        lastPostId,
        loadHomeFeed,
        loadMore,
    } = usePostStore();
    useEffect(() => {
        loadHomeFeed();
    }, []);

    // useEffect(()=>{
    //   const observer = new IntersectionObserver((entries) => {
    //     const entry = entries[0];
    //     if(entry.isIntersecting && hasMore && !isFetchingMore){
    //       loadMore();
    //     }
    //   })

    //   const currentRef = observerRef.current;

    //   if(currentRef){
    //     observer.observe(currentRef);
    //   }

    //   return () => {
    //     if(currentRef){
    //       observer.unobserve(currentRef);
    //     }
    //   }
    // },[hasMore, isFetchingMore, loadMore])

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="flex flex-col gap-5">
                {posts.length === 0 ? (
                    <div>No posts found</div>
                ) : (
                    posts.map((post) => <PostCard key={post._id} post={post} />)
                )}
            </div>
            {
              isFetchingMore && (
                <div>
                  <p>Loading More...</p>
                </div>
              )
            }
            <div ref={observerRef} className="h-10"></div>
        </>
    );
}

export default HomePage;
