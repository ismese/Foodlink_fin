import React from "react";
import { View, Text, Image } from "react-native";
import PostDescription from "./PostDescription";

const PostHeader = ({ post, calculateTimeAgo, styles, postOwnerNickname }) => (
  <View style={styles.container}>
    <Image source={{ uri: post.images[0] }} style={styles.postImage} />
    <View style={styles.profileContainer}>
      <Image
        source={require("../../start-expo/assets/avatar.png")}
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{postOwnerNickname || "작성자 없음"}</Text>
      </View>
    </View>

    <View style={styles.separator} />

    <PostDescription
      post={post}
      calculateTimeAgo={calculateTimeAgo}
      description={post.description}
      styles={styles}
    />
  </View>
);

export default PostHeader;
