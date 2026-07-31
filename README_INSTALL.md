# 🚀 공용 전천후 멀티 에이전트 하네스 패키지 설치 & 가동 가이드

이 패키지는 **Claude Code, OpenAI Codex, Gemini 3대 동급 AI 사령관**이 대등하게 협업하는 독립형 포터블 개발 및 자율 오케스트레이션 하네스입니다.

---

## 📦 1. 최초 1분 구동 방법 (Quick Start)

### Step 1: 압축 해제 및 폴더 이동
압축 파일을 임의의 위치(예: `F:\00 MAIN` 또는 `C:\harness`)에 해제하고 터미널(PowerShell)을 엽니다.

### Step 2: 사용자 이름 설정
자신의 이름을 등록하여 AI 에이전트들이 사용자분을 올바른 호칭으로 부르도록 설정합니다.
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\scripts\setup-user-name.ps1 -UserName "자신의이름"
```
*(예: `.\scripts\setup-user-name.ps1 -UserName "홍길동"` 실행 시 **"홍길동님"**으로 자동 설정됨)*

### Step 3: 포터블 런타임 & 전역 스킬 자동 연동
```powershell
.\scripts\auto-upgrade-skills.ps1
```
위 스크립트를 가동하면 **포터블 Git(v2.48.1), Node.js(v24.18.0), Python(v3.12.4)** 경로가 시스템 세션에 자동 병합되며, **18종 전역 스킬 및 57종 커스텀 슬래시 명령어**가 즉시 마운트됩니다.

---

## 🏛️ 2. 하네스 핵심 가버넌스 및 규칙

### 1) 3대 동급 AI 사령관 체제 (Tri-Commander Council)
- **Claude, Codex, Gemini**는 동등한 계급의 **3대 Co-Commanders**입니다.
- 어느 구독 계정으로 접속하든 AI 에이전트들은 수시로 타 모델 CLI/API를 호출하여 아키텍처와 코드를 크로스 검증(Cross-Consultation)합니다.

### 2) 파일 및 하위 프로젝트 저장 경로 엄격 제안
- **일반 보고서, 테스트 결과 및 미디어 출력물**: **`F:\100 출력물\`** 하위에 저장 (`tts/`, `videos/`, `docs/`).
- **신규 생성 하위 앱 및 서브 프로젝트**: **`F:\01 PROJECT\`** 하위에 설치 (자동 생성 시 사전 승인 수칙).

---

## 🛠️ 3. 기본 포함 지원 스킬 및 도구
1. **문서 스킬**: `docx`, `pptx`, `pdf`, `xlsx` 자동 생성 및 편집
2. **미디어 & 음성 스킬**: 100% 무료 한글/영문 신경망 TTS(`edge-tts`) 및 MP4 비디오 렌더러 (`video-tts`)
3. **웹 및 앱 개발 프레임워크**: Next.js 15, Vite React, shadcn/ui 컴포넌트 레지스트리 (`monet-registry`), 678종 한글 무료 폰트 마스터 팩 (`noonnu-fonts`)
