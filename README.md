# ClassPick — 수강신청 연습 시뮬레이터

> 대학교 수강신청 매번 너무 어렵죠? 이제 ClassPick으로 충분히 연습하고 도전해보세요!

[![Netlify Status](https://img.shields.io/badge/배포-Netlify-00C7B7?logo=netlify)](https://classpick.netlify.app)

**지금 바로 사용해보세요** → <https://classpick.netlify.app>

---

## 스크린샷

<!-- 아래 주석을 지우고 스크린샷 이미지를 넣어 주세요 -->

### 설정 화면

<!-- ![설정 화면](docs/screenshots/setup.png) -->

### 수강신청 화면

<!-- ![수강신청 화면](docs/screenshots/register.png) -->

### 실전 모드 로그인 대기 화면

<!-- ![로그인 대기 화면](docs/screenshots/practice-login.png) -->

### 랭킹 도전 화면

<!-- ![랭킹 도전 화면](docs/screenshots/challenge.png) -->

### 랭킹 조회 화면

<!-- ![랭킹 화면](docs/screenshots/ranking.png) -->

---

## 왜 만들었나요?

수강신청, 한 번쯤 망쳐본 적 있으시죠?

짧은 시간 안에 정확하게 클릭해야 하는데, 처음 수강신청을 앞둔 신입생은 실제 화면을 한 번도
본 적 없이 당일을 맞이하게 돼요. 긴장되는 건 당연한 일이에요.

**ClassPick**은 실제 수강신청 흐름인 로그인 대기 → 화면 접속 → 캡차 인증 → 과목 신청 → 마감을
그대로 재현해서, 실전처럼 연습할 수 있는 환경을 제공해요.
미리 충분히 손에 익혀두면, 당일에 훨씬 여유롭게 신청할 수 있어요!

---

## 주요 기능

### 1. 자유 연습 모드

원하는 과목을 직접 설정하고 수강신청 화면을 자유롭게 체험해볼 수 있어요.

- **수강꾸러미**: 화면에 목록으로 표시되는 과목이에요. [신청] 버튼을 클릭해서 신청해요.
- **이미 신청된 과목**: 연습 시작 시점에 이미 신청 완료 상태로 설정할 수 있어요.
- **코드 입력 과목**: 강좌번호를 직접 타이핑해야 신청되는 과목이에요.

### 2. 캡차 인증

신청·삭제할 때마다 화면에 표시된 숫자를 입력해야 해요.
실제 수강신청의 보안코드 입력 과정을 그대로 재현했어요.

### 3. 실전 모드

진짜 수강신청 당일 상황을 재현해드려요!

- 오전 10시 대기 화면 → 입장 직후 흰 화면(서버 부하 상황) → 과목 마감 순서로 진행돼요.
- 각 과목은 설정된 난이도에 따라 랜덤 시간에 자동으로 마감돼요.
- **쉬움 / 보통 / 어려움** 세 가지 난이도 중에서 선택할 수 있어요.

### 4. 랭킹 도전 모드

모든 사용자가 **동일한 과목 세트**로 경쟁하는 모드예요!

- 닉네임을 입력하고 도전하면 소요 시간이 서버에 기록돼요.
- **전 과목 신청 성공** 시에만 랭킹에 등록돼요. 하나라도 마감되면 기록되지 않아요.
- 닉네임별로 최고 기록만 유지되고, 재도전 횟수 제한은 없어요. 얼마든지 도전해보세요!

### 5. 랭킹 조회

다른 사람들의 기록도 한눈에 볼 수 있어요.

- 닉네임으로 검색하거나, 소요 시간순/최신순으로 정렬할 수 있어요.
- 100명씩 무한 스크롤로 편하게 탐색할 수 있어요.

### 6. 편의 기능

더 빠르고 편하게 연습할 수 있도록 다양한 편의 기능도 준비했어요.

- **프리셋 저장/불러오기**: 자주 쓰는 과목 세트를 이름 붙여 저장해두세요.
- **랜덤 채우기**: 과목 이름·학점을 자동 생성해서 빠르게 연습 환경을 구성해요.
- **과목 이동**: 수강꾸러미 ↔ 이미 신청된 과목 ↔ 코드 입력 과목 간에 자유롭게 이동할 수 있어요.

---

## 기술 스택

| 분류 | 기술 | 선택 이유 |
| --- | --- | --- |
| UI 프레임워크 | **React 19** | 컴포넌트 기반 구조로 수강신청 UI를 재사용 가능하게 분리 |
| 빌드 도구 | **Vite 7** | 빠른 개발 서버와 번들링으로 즉각적인 피드백 |
| 라우팅 | **React Router v7** | SPA에서 설정/로그인/수강신청/결과 화면 간 이동 관리 |
| 백엔드 | **Firebase Firestore** | 별도 서버 없이 랭킹 데이터를 실시간으로 저장·조회 |
| 인증 | **Firebase Anonymous Auth** | 회원가입 없이 익명으로 랭킹 도전 가능 |
| 시간 측정 | **Firebase Server Timestamp** | 클라이언트 조작이 불가능한 공정한 서버 기준 시간 기록 |
| 배포 | **Netlify** | GitHub 연동 자동 배포, SPA 라우팅 지원 |
| 상태 저장 | **localStorage** | 과목 설정·프리셋을 브라우저에 영구 보존 |

---

## 로컬 실행 방법

### 사전 요구사항

- Node.js 18 이상
- Firebase 프로젝트 (Firestore + Anonymous Auth 활성화)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/your-username/classPick.git
cd classPick

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일에 Firebase 설정값 입력

# 4. 개발 서버 실행
npm run dev
```

### 환경 변수 (.env)

```sh
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 빌드

```bash
npm run build
```

---

## 프로젝트 구조

```text
src/
├── components/
│   ├── common/          # Modal, Captcha 등 공통 컴포넌트
│   ├── layout/          # TopBand, Footer, MainNav
│   └── register/        # 수강신청 화면 전용 컴포넌트
├── data/
│   └── challengeData.js # 랭킹 도전 과목 세트 설정
├── pages/
│   ├── SetupPage.jsx         # 과목 설정 화면 (메인)
│   ├── RegisterPage.jsx      # 수강신청 연습 화면
│   ├── PracticeLoginPage.jsx # 실전 모드 로그인 대기 화면
│   ├── ChallengePage.jsx     # 랭킹 도전 참가 화면
│   ├── RankingPage.jsx       # 랭킹 조회 화면
│   ├── ResultPage.jsx        # 결과 화면
│   └── ...
├── utils/
│   ├── storage.js       # localStorage 상태 관리
│   ├── practiceUtils.js # 실전 모드 타이밍·난이도 로직
│   └── rankingUtils.js  # Firebase 랭킹 CRUD
└── styles/
    └── global.css       # 전체 공통 스타일
```

---

## 문의 및 피드백

문의와 피드백은 언제나 환영해요!
사용하다가 불편한 점이나 개선됐으면 하는 부분이 있다면 언제든지 아래 메일로 편하게 보내주세요.

**📬 [business9498@gmail.com](mailto:business9498@gmail.com)**

더 좋은 서비스를 만드는 데 큰 도움이 돼요. 감사합니다!

---

## 라이선스

본 프로젝트는 교육 목적의 개인 포트폴리오예요.
실제 대학교 수강신청 시스템과는 무관합니다.
