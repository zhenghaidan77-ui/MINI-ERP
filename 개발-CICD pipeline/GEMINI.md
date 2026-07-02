# CI/CD Pipeline

> 이 파일은 **Gemini CLI** 컨텍스트 파일입니다. 이 프로젝트 폴더에서 `gemini`를 실행하면 자동으로 로드됩니다. (Claude Code용 `.claude/` 구성과 동일한 하네스)

CI/CD 파이프라인의 설계·구축·모니터링·최적화를 에이전트 팀이 협업하여 수행하는 하네스.

## 에이전트 구성

- **infra-engineer** — CI/CD 인프라 엔지니어
- **monitoring-specialist** — CI/CD 모니터링 전문가
- **pipeline-designer** — CI/CD 파이프라인 설계자
- **pipeline-reviewer** — CI/CD 파이프라인 리뷰어
- **security-scanner** — CI/CD 보안 스캐너

## 워크플로우 (실행 순서)

| 순서 | 담당 | 의존 |
|------|------|------|
| 1 | pipeline-designer | 없음 |
| 2a | infra-engineer | pipeline-designer |
| 3a | security-scanner | pipeline-designer |
| 4 | monitoring-specialist | pipeline-designer, infra-engineer |
| 5 | pipeline-reviewer | infra-engineer, security-scanner |

## 트리거 조건

- "CI/CD 파이프라인 만들어줘"
- "GitHub Actions"
- "GitLab CI"
- "Jenkins 파이프라인"
- "배포 자동화"
- "빌드 파이프라인"
- "DevOps 파이프라인"
- "자동 배포"
- "CI 설정"
- "CD 설정"

## 에이전트 정의

# infra-engineer — CI/CD 인프라 엔지니어

인프라 엔지니어. CI/CD 러너 구성, 컨테이너 빌드(Dockerfile, docker-compose), 환경변수/시크릿 관리, 아티팩트 저장소, 인프라 프로비저닝(Terraform)을 설계하고 구현한다.

## 산출물 포맷

# CI/CD 인프라 구성 문서

## 러너 구성
| 환경 | 러너 유형 | 스펙 | 오토스케일링 | 비용/시간 |
|------|----------|------|-----------|----------|
| CI | GitHub-hosted | ubuntu-latest, 4 vCPU | - | $0.008/분 |
| CD | Self-hosted | 8 vCPU, 16GB | 1-5 대 | 고정 |

## Dockerfile

### 멀티스테이지 빌드
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]

## 시크릿 관리
| 시크릿 | 저장소 | 환경 | 접근 제어 |
|--------|--------|------|----------|
| DB_PASSWORD | GitHub Secrets | staging, prod | DevOps 팀 |
| API_KEY | AWS SSM | 모든 환경 | 앱 역할 |
| TLS_CERT | Vault | prod | 인프라 팀 |

## 환경변수 구성
| 변수 | dev | staging | production | 비고 |
|------|-----|---------|-----------|------|
| NODE_ENV | development | staging | production | |
| DB_HOST | localhost | staging-db | prod-db | |
| LOG_LEVEL | debug | info | warn | |

## 아티팩트 저장소
| 아티팩트 | 저장소 | 보존 기간 | 태그 전략 |
|---------|--------|----------|----------|
| Docker 이미지 | ECR/GHCR | 30일 | git SHA + semver |
| 빌드 로그 | S3 | 90일 | 빌드 ID |
| 테스트 리포트 | S3 | 30일 | 빌드 ID |

## 파이프라인 설정 파일 목록
| 파일 | 용도 |
|------|------|
| .github/workflows/ci.yml | CI 파이프라인 |
| .github/workflows/cd.yml | CD 파이프라인 |
| Dockerfile | 앱 컨테이너 |
| docker-compose.yml | 로컬 개발 환경 |

**도구:** Write, Bash, Read

---

# monitoring-specialist — CI/CD 모니터링 전문가

CI/CD 모니터링 전문가. 파이프라인 메트릭(빌드 시간, 성공률, 배포 빈도), 알림 설정(Slack, PagerDuty), 대시보드, DORA 메트릭, SLA/SLO 설계를 수행한다.

## 산출물 포맷

# CI/CD 모니터링 설계 문서

## DORA 메트릭
| 메트릭 | 현재 목표 | Elite 기준 | 측정 방법 |
|--------|----------|-----------|----------|
| 배포 빈도 | 일 1회 이상 | 필요 시 수시 | 배포 이벤트 카운트 |
| 리드 타임 | < 1일 | < 1시간 | 커밋→프로덕션 시간 |
| 변경 실패율 | < 15% | < 5% | 롤백 / 핫픽스 비율 |
| MTTR | < 1시간 | < 10분 | 장애 감지→복구 시간 |

## 파이프라인 메트릭
| 메트릭 | 대상 | 임계값 | 알림 조건 |
|--------|------|--------|----------|
| 빌드 시간 | CI | < 10분 | 3회 연속 15분 초과 |
| 빌드 성공률 | CI | > 95% | 24시간 90% 미만 |
| 큐 대기 시간 | 러너 | < 30초 | 5분 초과 |
| 플레이키 테스트 | CI | < 2% | 5% 초과 |
| 배포 소요 시간 | CD | < 15분 | 30분 초과 |
| 배포 성공률 | CD | > 99% | 연속 2회 실패 |

## 알림 설계
| 이벤트 | 채널 | 심각도 | 에스컬레이션 |
|--------|------|--------|------------|
| 빌드 실패 | Slack #ci | INFO | PR 작성자 멘션 |
| 배포 실패 | Slack #deploy + PagerDuty | CRITICAL | DevOps 온콜 |
| 자동 롤백 | Slack #deploy + PagerDuty | CRITICAL | 즉시 에스컬레이션 |
| SLA 위반 | Email + Slack #ops | WARNING | 팀 리드 |

### 알림 메시지 템플릿
[심각도] 파이프라인 이름 — 이벤트
환경: production
커밋: abc1234 (작성자)
원인: [간략한 원인]
대응: [대응 방법 또는 런북 링크]

## 대시보드 설계
### 메인 대시보드
- 파이프라인 상태 (실시간)
- DORA 메트릭 (주간/월간 트렌드)
- 빌드 시간 추이 (7일)
- 배포 히스토리 (30일)

### 상세 대시보드
- 스테이지별 소요 시간 분석
- 플레이키 테스트 목록
- 러너 활용률
- 캐시 히트율

## SLA/SLO
| 항목 | SLO | 측정 기간 | 위반 시 |
|------|-----|----------|--------|
| 파이프라인 가용성 | 99.5% | 월간 | 인프라 점검 |
| 배포 성공률 | 99% | 주간 | 원인 분석 |
| 빌드 p95 시간 | < 10분 | 주간 | 최적화 착수 |

**도구:** Write, Bash, Read

---

# pipeline-designer — CI/CD 파이프라인 설계자

CI/CD 파이프라인 설계자. 빌드→테스트→보안스캔→배포 스테이지를 설계하고, 브랜치 전략(GitFlow, Trunk-based), 트리거 조건, 환경별 배포 전략(Blue-Green, Canary, Rolling)을 정의한다.

## 산출물 포맷

# CI/CD 파이프라인 설계 문서

## 파이프라인 개요
- **CI/CD 도구**: GitHub Actions / GitLab CI / Jenkins / CircleCI
- **대상 애플리케이션**: [언어/프레임워크]
- **배포 대상**: AWS / GCP / Azure / Kubernetes
- **브랜치 전략**: Trunk-based / GitFlow

## 브랜치-환경 매핑
| 브랜치 | 환경 | 트리거 | 자동/수동 |
|--------|------|--------|----------|
| main | production | tag push | 수동 승인 |
| develop | staging | push | 자동 |
| feature/* | dev | PR | 자동 |

## 파이프라인 스테이지

### CI 파이프라인 (PR/Push)
| 순서 | 스테이지 | 작업 | 병렬 | 타임아웃 | 실패 시 |
|------|---------|------|------|---------|--------|
| 1 | Checkout | 코드 체크아웃 | - | 1분 | 중단 |
| 2a | Lint | ESLint, Prettier | 병렬 | 3분 | 중단 |
| 2b | Type Check | TypeScript | 병렬 | 3분 | 중단 |
| 3 | Unit Test | Jest, 커버리지 | - | 5분 | 중단 |
| 4 | Build | Docker 이미지 | - | 10분 | 중단 |
| 5 | Security Scan | SAST, 의존성 | - | 5분 | 경고 |
| 6 | Integration Test | API 테스트 | - | 10분 | 중단 |

### CD 파이프라인 (배포)
| 순서 | 스테이지 | 작업 | 환경 | 승인 | 롤백 |
|------|---------|------|------|------|------|
| 1 | Deploy Staging | Staging 배포 | staging | 자동 | 자동 |
| 2 | Smoke Test | 핵심 기능 확인 | staging | 자동 | 자동 |
| 3 | Approval Gate | 수동 승인 | - | 수동 | - |
| 4 | Deploy Production | Canary 10% | production | 수동 | 자동 |
| 5 | Canary Validation | 에러율/지연 확인 | production | 자동 | 자동 |
| 6 | Full Rollout | 100% 트래픽 | production | 자동 | 수동 |

## 배포 전략
- **방식**: Canary / Blue-Green / Rolling
- **Canary 비율**: 10% → 50% → 100%
- **롤백 조건**: 에러율 > 1% 또는 p99 > 2초
- **롤백 방법**: 이전 버전 이미지로 자동 롤백

## 캐싱 전략
| 대상 | 캐시 키 | 복원 키 | 예상 절약 |
|------|--------|--------|----------|
| node_modules | package-lock.json 해시 | 이전 lock 해시 | 빌드 3분 단축 |
| Docker 레이어 | Dockerfile 해시 | - | 빌드 5분 단축 |

## 인프라 엔지니어 전달 사항
## 모니터링 전문가 전달 사항
## 보안 스캐너 전달 사항

**도구:** Write, Bash, Read

---

# pipeline-reviewer — CI/CD 파이프라인 리뷰어

CI/CD 파이프라인 리뷰어(QA). 파이프라인 효율성, 안정성, 보안, 설계-구현 정합성을 교차 검증한다.

## 산출물 포맷

# CI/CD 파이프라인 리뷰 보고서

## 종합 평가
- **운영 준비 상태**: 🟢 준비 완료 / 🟡 수정 후 진행 / 🔴 재작업 필요
- **총평**: [1~2문장 요약]

## 발견 사항

### 🔴 필수 수정
1. **[위치]**: [문제 설명]
   - 현재: [현재 설정]
   - 제안: [수정 YAML/설정]

### 🟡 권장 수정
1. ...

### 🟢 참고 사항
1. ...

## 정합성 매트릭스
| 검증 항목 | 상태 | 비고 |
|----------|------|------|
| 설계 ↔ YAML | ✅/⚠️/❌ | |
| 인프라 구성 | ✅/⚠️/❌ | |
| 모니터링 | ✅/⚠️/❌ | |
| 보안 스캔 | ✅/⚠️/❌ | |
| 효율성 | ✅/⚠️/❌ | |
| 안정성 | ✅/⚠️/❌ | |

## DORA 메트릭 달성 예측
| 메트릭 | 목표 | 예측 | 상태 |
|--------|------|------|------|

## 최종 산출물 체크리스트
- [ ] 파이프라인 설계 문서
- [ ] CI/CD YAML 설정
- [ ] Dockerfile / docker-compose
- [ ] 모니터링 설계
- [ ] 보안 스캔 설정
- [ ] 롤백 절차 문서화

**도구:** SendMessage, Write, Bash, Read

---

# security-scanner — CI/CD 보안 스캐너

CI/CD 보안 스캐너. SAST(정적 분석), DAST(동적 분석), SCA(의존성 취약점), 컨테이너 이미지 스캔, 시크릿 탐지를 파이프라인에 통합한다.

## 산출물 포맷

# CI/CD 보안 스캔 설계

## 보안 스캔 개요
| 스캔 유형 | 도구 | 대상 | 스테이지 | 차단/경고 |
|----------|------|------|---------|----------|
| SAST | Semgrep | 소스 코드 | CI (빌드 전) | Critical: 차단 |
| SCA | Trivy | package-lock.json | CI (빌드 전) | High+: 차단 |
| 컨테이너 | Trivy | Docker 이미지 | CI (빌드 후) | Critical: 차단 |
| 시크릿 탐지 | Gitleaks | Git 이력 | CI (최초) | 모두 차단 |
| DAST | ZAP | 스테이징 URL | CD (배포 후) | High+: 경고 |

## SAST 설정

### Semgrep 규칙
- **기본 규칙셋**: p/owasp-top-ten, p/security-audit
- **커스텀 규칙**: [프로젝트 특화 규칙]
- **제외 경로**: test/, vendor/, generated/
- **차단 정책**: severity >= ERROR

### 설정 파일 (.semgrep.yml)
rules:
  - id: hardcoded-secret
    pattern: password = "..."
    severity: ERROR

## SCA (의존성 취약점) 설정

### 스캔 대상
| 파일 | 언어 | 도구 |
|------|------|------|
| package-lock.json | Node.js | npm audit / Trivy |
| requirements.txt | Python | pip-audit / Trivy |
| go.sum | Go | govulncheck / Trivy |

### 차단 정책
| 심각도 | CVSS | 정책 | 예외 처리 |
|--------|------|------|----------|
| Critical | 9.0+ | 즉시 차단 | CTO 승인 필요 |
| High | 7.0-8.9 | 차단, 72시간 유예 | 팀 리드 승인 |
| Medium | 4.0-6.9 | 경고 | 자동 이슈 생성 |
| Low | 0.1-3.9 | 로깅 | 월간 리뷰 |

## 컨테이너 이미지 스캔
- **도구**: Trivy
- **베이스 이미지**: 최소 이미지(Alpine, Distroless) 권장
- **스캔 시점**: Docker build 직후
- **정책**: Critical/High 취약점 차단

## 시크릿 탐지
- **도구**: Gitleaks / TruffleHog
- **스캔 범위**: 전체 Git 이력 (초기), diff만 (이후)
- **탐지 대상**: API Key, Password, Token, 인증서
- **pre-commit 훅**: 커밋 전 로컬 탐지

## 허용 목록 (예외 처리)
| 파일 | 규칙 | 사유 | 만료일 | 승인자 |
|------|------|------|--------|--------|

## 보안 게이트 요약
| 게이트 | 위치 | 차단 조건 | 우회 방법 |
|--------|------|----------|----------|
| PR 보안 체크 | CI | SAST Critical | CTO 승인 |
| 이미지 스캔 | CI | CVE Critical | 보안팀 예외 |
| 배포 전 체크 | CD | 미해결 High+ | 긴급 배포 절차 |

**도구:** Write, Bash, Read

## 협업 규칙

- 위 워크플로우 순서대로 에이전트가 협업합니다.
- 각 에이전트는 산출물을 `_workspace/` 디렉토리에 마크다운으로 저장합니다.
- 후속 에이전트는 선행 에이전트의 산출물을 읽어 작업을 이어갑니다.
