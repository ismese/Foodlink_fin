import * as FileSystem from 'expo-file-system';
import AWS from 'aws-sdk';
import { Buffer } from 'buffer';

// 🔥 AWS Rekognition 초기화
AWS.config.update({
  accessKeyId: 'AKIAX3DNHGQE3QMR42OM',
  secretAccessKey: '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',
  region: 'ap-northeast-2',
});

export const pickImageAndAnalyze = async (imageUrl) => {
  try {
    // 🔥 URL에서 이미지를 다운로드하고 바이너리로 변환
    const localPath = `${FileSystem.cacheDirectory}temp.jpg`;
    await FileSystem.downloadAsync(imageUrl, localPath);

    // 🔥 이미지 데이터를 Base64로 변환
    const base64 = await FileSystem.readAsStringAsync(localPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 🔥 AWS Rekognition 파라미터 설정
    const rekognition = new AWS.Rekognition();
    const params = {
      Image: { Bytes: Buffer.from(base64, 'base64') },
      MaxLabels: 10,
      MinConfidence: 70,
    };

    // 🔥 Rekognition에서 라벨 추출
    const data = await rekognition.detectLabels(params).promise();
    return { uri: imageUrl, labels: data.Labels };
  } catch (error) {
    console.error("이미지 분석 중 오류 발생:", error);
    throw new Error('이미지 분석 중 오류가 발생했습니다.');
  }
};