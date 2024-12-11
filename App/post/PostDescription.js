import React from "react";
import { View, Text } from "react-native";

const PostDescription = ({ post, calculateTimeAgo, description, styles }) => (
  <>
    <View style={styles.Postcontainer}>
      <View style={styles.titleSection}>
        <View style={styles.categoryInfo}>
          <View style={styles.categoryDot} />
          <Text style={styles.Subtitle}>{post?.title || "제목 없음"}</Text> 
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.categoryText}>
            카테고리: {post.categories?.length > 0 ? post.categories.join(" > ") : "카테고리 없음"}
          </Text>
          
          <Text style={styles.timeAgo}>
            {post?.createdAt ? calculateTimeAgo(post.createdAt) : "시간 정보 없음"}
          </Text>
        </View>
      </View>
    </View>

    <View style={styles.descriptionSection}>
      <Text style={styles.description}>{description || "설명 없음"}</Text>
    </View>
  </>
);

export default PostDescription;
