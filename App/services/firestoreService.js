import {
    collection,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
    addDoc,
    query,
    where,
  } from "firebase/firestore";
  import { firestore2 } from "./firebase"; // Firebase 설정 파일의 경로 확인
  
  // Firestore에서 게시물 가져오기 함수
  export const fetchPostsFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore2, "posts"));
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return posts;
    } catch (error) {
      console.error("Firestore에서 데이터 읽기 중 오류 발생:", error);
      return [];
    }
  };
  
  // Firestore에서 게시물 삭제 함수
  export const deletePostFromFirestore = async (postId) => {
    try {
      await deleteDoc(doc(firestore2, "posts", postId));
      console.log("게시물이 삭제되었습니다:", postId);
    } catch (error) {
      console.error("게시물 삭제 중 오류 발생:", error);
    }
  };
  
  // Firestore에서 게시물 수정 함수
  export const updatePostInFirestore = async (postId, updatedPost) => {
    try {
      const postRef = doc(firestore2, "posts", postId);
      await updateDoc(postRef, updatedPost);
      console.log("게시물이 수정되었습니다:", postId);
    } catch (error) {
      console.error("게시물 수정 중 오류 발생:", error);
    }
  };
  
  // Firestore에 찜한 게시물 추가 함수
  export const addFavoriteToFirestore = async (post) => {
    try {
      const favoritesCollection = collection(firestore2, "favorites");
      await addDoc(favoritesCollection, {
        ...post,
        createdAt: post.createdAt, // 게시물의 createdAt을 그대로 저장
      });
      console.log("찜한 게시물이 Firestore에 저장되었습니다:", post.id);
    } catch (error) {
      console.error("찜한 게시물 Firestore 추가 중 오류 발생:", error);
      throw error;
    }
  };
  
  // Firestore에서 찜한 게시물 삭제 함수
  export const deleteFavoriteFromFirestore = async (postId) => {
    try {
      const favoritesCollection = collection(firestore2, "favorites");
      const q = query(favoritesCollection, where("id", "==", postId)); // id 기준으로 게시물 찾기
      const querySnapshot = await getDocs(q);
  
      // 찾은 모든 문서를 삭제
      querySnapshot.forEach(async (docSnapshot) => {
        await deleteDoc(doc(firestore2, "favorites", docSnapshot.id));
        console.log("찜한 게시물이 Firestore에서 삭제되었습니다:", postId);
      });
    } catch (error) {
      console.error("찜한 게시물 Firestore 삭제 중 오류 발생:", error);
      throw error;
    }
  };
  
  // Firestore에서 찜한 게시물 가져오기 함수
  export const fetchFavoritesFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore2, "favorites"));
      const favorites = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("찜한 게시물이 Firestore에서 불러와졌습니다.");
      return favorites;
    } catch (error) {
      console.error("찜한 게시물 Firestore 불러오기 중 오류 발생:", error);
      throw error;
    }
  };
  