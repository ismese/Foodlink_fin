🎧 TonePick - AI로 재현하는 나만의 오디오북 프로젝트

React Native(EXPO)와 Firebase, ElevenLabs API를 활용하여 사용자의 목소리를 클로닝하고, PDF 문서를 개인화된 AI 음성으로 읽어주는 모바일 애플리케이션입니다. 

📌 주요 기능:
- Voice Cloning (사용자 음성 7개 녹음 → AI 음성 생성)
- PDF 업로드 및 텍스트 자동 추출
- TTS를 통한 오디오북 생성 및 실시간 재생
- Firebase 기반 사용자 인증, 파일 저장, 데이터 관리
- 클라우드 서버(Flask)를 통한 PDF 텍스트 추출 API

💡 대상:
- 돌아가신 가족의 목소리를 기억하고 싶은 사용자
- 시각장애인, 고령자 등 정보 접근 취약 계층
- 자녀에게 동화를 읽어주고 싶은 부모

👨‍💻 주요 기술 스택:
- **Frontend**: React Native (Expo), Styled Components, React Navigation
- **Backend**: Firebase (Auth, Firestore, Storage), Flask
- **AI 기술**: ElevenLabs Voice Cloning & TTS API
