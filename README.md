# TonePick - AI로 재현하는 나만의 오디오북

**TonePick**은 사용자의 목소리를 클로닝하여 PDF 문서를 개인 맞춤형 AI 음성으로 읽어주는 모바일 오디오북 애플리케이션입니다.  
React Native (Expo), Firebase, ElevenLabs API, Flask 서버를 활용하여 사용자 맞춤 TTS 경험을 제공합니다.

---

## 주요 기능

- **Voice Cloning**: 7개의 짧은 음성을 녹음하면 ElevenLabs API로 개인화된 AI Voice ID 생성
- **PDF 업로드 및 텍스트 추출**: 사용자가 업로드한 PDF에서 텍스트를 추출
- **TTS 오디오북 생성**: 추출된 텍스트를 사용자의 음성으로 변환하여 오디오북 재생
- **Firebase 연동**: 사용자 인증, 파일 저장, 음성 및 문서 관리
- **Flask 서버 연동**: PDF 텍스트 추출 API 서버 직접 구성

---

## 🛠️ 사용 기술

| 구분 | 기술 |
|------|------|
| **Frontend** | React Native, Expo, React Navigation, Styled Components |
| **Backend** | Firebase Authentication / Firestore / Storage |
| **AI / TTS** | ElevenLabs API (Voice Cloning + TTS) |
| **PDF 처리 서버** | Flask + PyMuPDF (fitz) + requests |

---

## 프로젝트 의의

TonePick은 단순한 TTS를 넘어서, **감성적 연결**을 위한 개인 맞춤 오디오북 서비스를 제공합니다.  
- 돌아가신 가족의 목소리를 다시 들을 수 있는 **정서적 위안**  
- 시각장애인, 고령층 등 정보 접근성 취약 계층을 위한 **음성 기반 정보 접근**
- 자녀에게 맞춤 목소리로 동화를 들려주는 **가족 중심 콘텐츠 활용**

---

## PDF 텍스트 추출 서버 사용법 (Flask)

앱에서 PDF 텍스트 추출을 위해 로컬 Flask 서버를 실행해야 합니다.

### 파일명: `server.py`

```python
from flask import Flask, request, jsonify
import requests
import fitz  # PyMuPDF
import tempfile

app = Flask(__name__)

@app.route("/pdf-to-text", methods=["POST"])
def pdf_to_text():
    print("요청 들어옴!")
    try:
        data = request.get_json()
        url = data.get("url")
        if not url:
            return jsonify({"error": "No URL provided"}), 400

        response = requests.get(url)
        if response.status_code != 200:
            return jsonify({"error": "Failed to download PDF"}), 400

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(response.content)
            tmp_path = tmp.name

        doc = fitz.open(tmp_path)
        all_text = "\n".join([page.get_text() for page in doc])

        return jsonify({"text": all_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)


