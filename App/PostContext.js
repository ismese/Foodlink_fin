import React, { createContext, useState, useEffect } from "react";
import { getFirestore, collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]); // 게시물 상태
  const [favorites, setFavorites] = useState([]); // 찜 목록 상태
  const db = getFirestore(); // Firestore 초기화

  // Firestore에서 게시물 실시간 구독
  useEffect(() => {
    const postsRef = collection(db, "posts");
    const unsubscribe = onSnapshot(
      postsRef,
      (snapshot) => {
        const fetchedPosts = [];
        snapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() });
        });
        setPosts(fetchedPosts);
      },
      (error) => {
        console.error("게시물 데이터 구독 중 오류 발생:", error);
      }
    );

    return () => unsubscribe();
  }, [db]);

  // 게시물 추가
  const addPost = async (newPost) => {
    try {
      const postsRef = collection(db, "posts");
      const docRef = await addDoc(postsRef, newPost);
      setPosts((prevPosts) => [{ id: docRef.id, ...newPost }, ...prevPosts]);
    } catch (error) {
      console.error("게시물 추가 중 오류 발생:", error);
      alert("게시물 추가에 실패했습니다.");
    }
  };

  // 게시물 삭제
  const deletePost = async (postId) => {
    try {
      const postDocRef = doc(db, "posts", postId);
      await deleteDoc(postDocRef);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("게시물 삭제 중 오류 발생:", error);
      alert("게시물 삭제에 실패했습니다.");
    }
  };

  // 게시물 수정
  const editPost = async (postId, updatedPost) => {
    try {
      const postDocRef = doc(db, "posts", postId);
      await updateDoc(postDocRef, updatedPost);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, ...updatedPost } : post
        )
      );
    } catch (error) {
      console.error("게시물 수정 중 오류 발생:", error);
      alert("게시물 수정에 실패했습니다.");
    }
  };

  // 찜 추가
  const addFavorite = async (post) => {
    if (!favorites.some((fav) => fav.id === post.id)) {
      setFavorites((prevFavorites) => [...prevFavorites, post]);
    }
    // Firestore와 연동할 경우, 찜 데이터를 Firestore에도 저장 가능
  };

  // 찜 제거
  const removeFavorite = async (postId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((fav) => fav.id !== postId)
    );
    // Firestore와 연동할 경우, 찜 데이터를 Firestore에서도 제거 가능
  };

  // 찜 확인
  const isFavorite = (postId) => {
    return favorites.some((fav) => fav.id === postId);
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        addPost,
        deletePost,
        editPost,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
