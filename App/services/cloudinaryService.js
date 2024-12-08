export const uploadImageToCloudinary = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg', // MIME 타입
        name: 'image.jpg', // 기본 파일명
      });
      formData.append('upload_preset', 'my_preset'); // 여기에 'my_preset' 입력
      formData.append('cloud_name', 'dsf1lh3uz'); // Cloudinary의 클라우드 이름 입력
  
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dsf1lh3uz/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      const data = await response.json();
  
      if (data.secure_url) {
        return data.secure_url; // 업로드된 이미지 URL 반환
      } else {
        console.error('Cloudinary 응답 오류:', data);
        throw new Error('Cloudinary 업로드 실패');
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      throw new Error('Cloudinary에 이미지를 업로드하지 못했습니다.');
    }
  };
  