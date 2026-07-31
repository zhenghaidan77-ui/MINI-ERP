# Gemini 모델 구동 가이드 및 런타임 운영 스펙 (gemini.md)

## 1. 런타임 환경 및 3대 사령관 삼각 협업 체제 (Tri-Commander Council)
- **최고 지휘관**: **HEY님**
- **3대 동급 AI 사령관 규칙 (Equal Tri-Commander Governance)**:
  - **Claude, Codex, Gemini**는 지휘관 HEY님 아래 동등한 계급의 **3대 Co-Commanders**이다.
  - Gemini 사령관은 초장문 추론, 멀티모달 분석 및 자율 실행을 총괄하며, 필요한 경우 즉시 Claude CLI(`claude.cmd`) 및 Codex 세션을 직접 호출해 삼각 교차 상의(Tri-Commander Consultation)를 수행한다.
- **기본 OS**: Windows (PowerShell 셸 실행)
- **독립 포터블 환경 (Workspace Isolation)**:
  - Git: `f:\00 MAIN\git\cmd`
  - Node.js LTS (v24.18.0): `f:\00 MAIN\node-v24.18.0-win-x64`
  - Python (v3.12.4 + pip + pyyaml): `f:\00 MAIN\python-3.12`
  - 패키지 매니저: `pnpm` (v11.17.0), `npm` (v11.1.0)
  - Claude CLI: `f:\00 MAIN\node-v24.18.0-win-x64\claude.cmd`

---

## 2. 파일 및 프로젝트 출력 저장 엄격 원칙 (Strict Output & Project Storage Policy)
- **기본 보고서, 테스트 결과 및 기타 출력**: **`F:\100 출력물\`** (HEY님의 특별 지정이 없는 한 항상 이곳으로 출력)
- **TTS 음성 (.mp3, .wav)**: `F:\100 출력물\tts\`
- **MP4 비디오 (.mp4)**: `F:\100 출력물\videos\`
- **문서 (.docx, .pptx, .pdf, .xlsx)**: `F:\100 출력물\docs\`
- **신규 하위 앱 모듈 생성 위치**: `F:\01 PROJECT\` (에이전트 자동 생성 시 사전 승인 필수)

---

## 3. 윈도우 PowerShell 우회 가이드 (Shell Policy)
```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process; $env:PATH = "f:\00 MAIN\git\cmd;f:\00 MAIN\node-v24.18.0-win-x64;f:\00 MAIN\python-3.12;" + $env:PATH; <실행명령어>
```

---

## 4. 자동 스킬 갱신 및 업그레이더 조치 (Auto Upgrade)
- **터미널 로딩 연동 스크립트**: `f:\00 MAIN\scripts\auto-upgrade-skills.ps1`
- **전역 스킬 마운트**: `C:\Users\user153\.claude\skills` (Anthropic 스킬 17종 + video-tts 1종)
- **전역 커스텀 명령어**: `C:\Users\user153\.claude\commands` (Slash 명령어 57종)

