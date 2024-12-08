import { v2 as cloudinary } from 'cloudinary';

// Cloudinary 설정
cloudinary.config({
  cloud_name: 'dsf1lh3uz', // Cloudinary 대시보드에서 확인 가능
  api_key: '355345474797592', // Cloudinary 대시보드에서 확인 가능
  api_secret: 'UZaZsDHn0vAkuAWvisrTW9nQsQA', // Cloudinary 대시보드에서 확인 가능
});

export default cloudinary;