# Claude Code 및 Claude CLI 구동 가이드 (CLAUDE.md)

## 1. 지휘관 및 3대 동급 사령관 체제 (User Identity & Tri-Commander Council)
- **최고 지휘관**: **HEY님** (모든 답변과 지시 수행 시 항상 **"HEY님"**으로 호칭한다)
- **시스템 철학**: **"안되는 것 없는 전천후 자율 하네스 (Zero-Blocker Unstoppable Harness)"**
- **3대 동급 AI 사령관 협업 규칙**:
  - **Claude, Codex, Gemini**는 동등한 최고 계급의 **3대 Co-Commanders**이다.
  - HEY님이 각 모델의 구독 계정으로 가동하는 즉시, Claude는 필요시 언제든지 Codex 및 Gemini 사령관 세션을 불러 다자간 상의(Council Discussion) 및 크로스 리비전(Cross-Review)을 수행한다.

---

## 2. 파일 및 프로젝트 출력 저장 엄격 원칙 (Strict Output & Project Storage Policy)

> [!CRITICAL]
> **어떠한 경우에도 무단으로 개별 프로젝트 내부 폴더나 무기고사령부(f:\00 MAIN) 루트에 출력물이나 하위 앱을 생성하여 저장하면 안 된다.**

### 1) 미디어, 문서 및 서비스 출력물 저장 경로: `F:\100 출력물\`
- 모든 보고서, 테스트 결과, 미디어 및 생성물은 무기고사령부를 벗어나 **`F:\100 출력물\`** 지정 기본 폴더로 출력한다.
  - **기본 보고서 / 테스트 / 기타 일반 출력**: `F:\100 출력물\` (HEY님의 특별 지정이 없는 한 항상 이곳으로 출력)
  - **TTS 음성 파일 (.mp3, .wav)**: `F:\100 출력물\tts\`
  - **MP4 동영상/비디오 파일 (.mp4)**: `F:\100 출력물\videos\`
  - **생성 문서 파일 (.docx, .pptx, .pdf, .xlsx)**: `F:\100 출력물\docs\`

### 2) 하위 앱 및 서브 프로젝트 생성 경로: `F:\01 PROJECT\`
- 새로 생성하거나 추가 설치되는 신규 하위 앱 및 프로젝트 모듈은 반드시 **`F:\01 PROJECT\`** 디렉터리 하위에 설치한다.
- **하위 앱 폴더 생성 승인 수칙**:
  - HEY님이 직접 만들어 지정해 주시거나,
  - 에이전트가 자동으로 새 프로젝트 폴더를 생성할 때는 **반드시 HEY님께 사전에 폴더명을 승인받은 후** 생성한다.

---

## 3. 런타임 및 포터블 환경 규격 (Runtime Specs)
- **Git**: `f:\00 MAIN\git\cmd`
- **Node.js LTS (v24.18.0)**: `f:\00 MAIN\node-v24.18.0-win-x64`
- **Python (v3.12.4)**: `f:\00 MAIN\python-3.12`
- **PowerShell 실행 패턴**:
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process; $env:PATH = "f:\00 MAIN\git\cmd;f:\00 MAIN\node-v24.18.0-win-x64;f:\00 MAIN\python-3.12;" + $env:PATH; <실행명령어>
  ```

---

## 4. 자율적 스킬 확장 및 업그레이드 파이프라인
1. **GitHub 오픈소스 수집**: 스킬이나 기능이 부족할 경우 GitHub 생태계에서 라이브러리를 탐색해 하네스에 즉각 이식한다.
2. **시동 시 자동 업그레이더**: 터미널 로딩 시 `f:\00 MAIN\scripts\auto-upgrade-skills.ps1`을 가동해 전역 스킬(`~/.claude/skills`, `~/.claude/commands`) 및 패키지를 자동 최신화한다.

