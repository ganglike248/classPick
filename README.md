# ClassPick — 수강신청 연습 시뮬레이터

> 대학교 수강신청 매번 너무 어렵죠? 이제 ClassPick으로 충분히 연습하고 도전해보세요!

[![Netlify Status](https://img.shields.io/badge/배포-Netlify-00C7B7?logo=netlify)](https://classpick.netlify.app)
![Version](https://img.shields.io/badge/버전-1.6.28-blue)

**지금 바로 사용해보세요** → <https://classpick.netlify.app>

---

## 스크린샷

### 설정 화면
<img width="824" height="860" alt="image" src="https://github.com/user-attachments/assets/aa3279e0-a843-4a0d-96ca-9f870f62d285" />

### 수강신청 화면
<img width="810" height="922" alt="image" src="https://github.com/user-attachments/assets/e6d6a8f5-db24-49e9-93dd-0165d7bb1b0b" />

### 실전 모드 로그인 대기 화면
<img width="1060" height="862" alt="image" src="https://github.com/user-attachments/assets/649c204d-766b-400f-bb4e-a0b3afd0fd0f" />

### 랭킹 도전 화면
<img width="774" height="914" alt="image" src="https://github.com/user-attachments/assets/c108939f-0d95-48c1-89ab-2f92a09472f8" />
<img width="1031" height="767" alt="image" src="https://github.com/user-attachments/assets/3861e95f-7099-45c8-a15f-e652249c167f" />


### 랭킹 조회 화면
<img width="1052" height="698" alt="image" src="https://github.com/user-attachments/assets/4c594d01-3707-4ecf-a951-a129fa607c6e" />

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

### 1. 지금 바로 체험하기

별도의 과목 설정 없이 지금 바로 수강신청을 체험할 수 있어요!

- '지금 바로 체험하기' 버튼 하나로 즉시 시작해요.
- 타이머 제한 없이 전 과목 신청 시 자동 완료돼요.
- 결과는 일회용이며 랭킹에 기록되지 않아요.
- 체험 종료 후 기존 설정이 자동으로 복원돼요.

### 2. 자유 연습 모드

원하는 과목을 직접 설정하고 수강신청 화면을 자유롭게 체험해볼 수 있어요.

- **수강꾸러미**: 화면에 목록으로 표시되는 과목이에요. [신청] 버튼을 클릭해서 신청해요.
- **이미 신청된 과목**: 연습 시작 시점에 이미 신청 완료 상태로 설정할 수 있어요.
- **코드 입력 과목**: 강좌번호를 직접 타이핑해야 신청되는 과목이에요.

### 3. 캡차 인증

신청·삭제할 때마다 화면에 표시된 숫자를 입력해야 해요.
실제 수강신청의 보안코드 입력 과정을 그대로 재현했어요.

### 4. 실전 모드

진짜 수강신청 당일 상황을 재현해드려요!

- 오전 10시 대기 화면 → 입장 직후 흰 화면(서버 부하 상황) → 과목 마감 순서로 진행돼요.
- 각 과목은 설정된 난이도에 따라 랜덤 시간에 자동으로 마감돼요.
- **쉬움 / 보통 / 어려움** 세 가지 난이도 중에서 선택할 수 있어요.

### 5. 랭킹 도전 모드

모든 사용자가 **동일한 과목 세트**로 경쟁하는 모드예요!

- 닉네임을 입력하고 도전하면 소요 시간이 서버(Firebase Server Timestamp)에 기록돼요.
- **전 과목 신청 성공** 시에만 랭킹에 등록돼요. 하나라도 마감되면 기록되지 않아요.
- 사용자(uid)별로 최고 기록만 유지되고, 재도전 횟수 제한은 없어요. 얼마든지 도전해보세요!
- 도전 과목 구성이나 캡차 지연처럼 소요 시간에 영향을 주는 변경이 생기면 **챌린지 버전(challengeId)**을 올려요.
  버전이 다른 기록끼리는 서로 비교되지 않아, 항상 공정한 순위를 볼 수 있어요.

### 6. 명예의 전당

홈 화면과 랭킹 도전 화면에서 현재 버전 상위 3명의 기록을 바로 확인할 수 있어요.

- 1·2·3위를 시상대(또는 목록) 형태로 보여줘요.
- 지금까지 이 버전에 도전한 누적 참여자 수도 함께 표시돼요.

### 7. 랭킹 조회

다른 사람들의 기록도 한눈에 볼 수 있어요.

- 닉네임으로 검색하거나, 소요 시간순/최신순으로 정렬할 수 있어요.
- 100명씩 무한 스크롤로 편하게 탐색할 수 있어요.
- 챌린지 버전별로 순위표가 구분되고, 본인 기록의 닉네임 수정·삭제도 할 수 있어요.

### 8. 손풀기 반응속도 미니게임

수강신청을 시작하기 전, 홈 화면에서 가볍게 반응속도를 테스트해볼 수 있어요.

- 초록불이 켜지는 순간 클릭! 반응 속도(ms)를 측정해요.
- 기록은 어디에도 저장되지 않는 순수 놀이용 기능이에요.

### 9. 피드백 보내기

이메일을 안 열어도 화면에서 바로 의견을 남길 수 있어요.

- 하단 푸터의 "메시지로 간편하게 보내기" 버튼으로 로그인 없이 익명 전송돼요.
- 부적절한 내용은 관리자가 확인 후 삭제할 수 있어요.

### 10. 편의 기능

더 빠르고 편하게 연습할 수 있도록 다양한 편의 기능도 준비했어요.

- **프리셋 저장/불러오기**: 자주 쓰는 과목 세트를 이름 붙여 저장해두세요.
- **과목 이동**: 수강꾸러미 ↔ 이미 신청된 과목 ↔ 코드 입력 과목 간에 자유롭게 이동할 수 있어요.
- **업데이트 내역 확인**: 화면 최상단 헤더에서 현재 버전을 바로 확인하고, "업데이트 내역"을 눌러 그동안 뭐가 달라졌는지 한눈에 볼 수 있어요. 어느 페이지에서나 확인 가능해요.

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
| 분석 | **Firebase Analytics** | 페이지 조회·버튼 클릭 등 주요 사용자 액션 추적 |
| 배포 | **Netlify** | GitHub 연동 자동 배포, SPA 라우팅 지원 |
| 상태 저장 | **localStorage** | 과목 설정·프리셋을 브라우저에 영구 보존 |

---

## 로컬 실행 방법

### 사전 요구사항

- Node.js 20 이상 (Vite 7 요구사항)
- Firebase 프로젝트 (Firestore + Anonymous Auth 활성화)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/ganglike248/classPick.git
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
├── main.jsx              # React 앱 마운트 진입점
├── App.jsx               # 라우팅 설정
├── firebase.js           # Firebase 초기화
├── components/
│   ├── common/           # 공통 컴포넌트
│   │   ├── Modal.jsx
│   │   ├── FeedbackModal.jsx # 피드백 전송 모달 (Footer, 설명서 모달 등에서 공통 사용)
│   │   ├── HallOfFame.jsx    # 명예의 전당 (상위 3위 + 누적 참여자 수)
│   │   ├── ReactionGame.jsx  # 손풀기 반응속도 미니게임
│   │   └── AdFitBanner.jsx   # 카카오 애드핏 배너 (unitId 없으면 렌더링 안 함)
│   ├── layout/           # TopBand(버전/업데이트 내역 모달 포함), Footer(피드백 모달 포함), MainNav
│   ├── setup/            # 설정 화면 전용 컴포넌트
│   │   ├── CourseTable.jsx
│   │   ├── CourseAddForm.jsx
│   │   ├── PresetManager.jsx
│   │   └── PracticeModeSetup.jsx
│   └── register/         # 수강신청 화면 전용 컴포넌트
│       ├── Captcha.jsx
│       ├── CartCourses.jsx
│       ├── CodeInput.jsx
│       ├── PracticeTimer.jsx
│       ├── RegisteredCourses.jsx
│       └── StudentInfo.jsx
├── constants/
│   └── site.js           # 사이트 전역 상수 (피드백 관리자 이메일 등)
├── data/
│   ├── challengeData.js  # 랭킹 도전 과목 세트·챌린지 버전(challengeId) 설정
│   └── updateLog.js      # 홈 화면 "업데이트 내역" 모달에 표시되는 사용자용 변경 이력
├── hooks/
│   ├── useClock.js       # 실시간 시계 훅
│   └── useCaptcha.js     # 보안코드 생성 및 검증 훅
├── pages/
│   ├── SetupPage.jsx         # 과목 설정 화면 (메인)
│   ├── RegisterPage.jsx      # 수강신청 연습 화면
│   ├── PracticeLoginPage.jsx # 실전/체험 모드 로그인 대기 화면
│   ├── ChallengePage.jsx     # 랭킹 도전 참가 화면
│   ├── RankingPage.jsx       # 랭킹 조회 화면
│   ├── ResultPage.jsx        # 결과 화면
│   ├── PrivacyPage.jsx       # 개인정보처리방침
│   ├── TermsPage.jsx         # 이용약관
│   └── FeedbackAdminPage.jsx # 피드백 관리자 전용 조회/삭제 화면 (/feedback)
├── utils/
│   ├── storage.js        # localStorage 상태 관리
│   ├── courseUtils.js    # 과목 관련 유틸 함수
│   ├── practiceUtils.js  # 실전 모드 타이밍·난이도 로직
│   ├── rankingUtils.js   # Firebase 랭킹 CRUD, 버전별 캐시(1분 TTL)
│   ├── versionUtils.js   # 챌린지 버전 메타데이터 조회
│   ├── feedbackUtils.js  # Firebase 피드백 CRUD
│   ├── analytics.js      # Firebase Analytics 이벤트 트래킹
│   └── adsense.js        # 구글 애드센스 로더 스크립트 삽입 (클라이언트 ID 있을 때만)
└── styles/
    └── global.css        # 전체 공통 스타일
```

> `firestore.rules`(저장소 루트)에 랭킹·피드백 컬렉션의 서버 측 권한 규칙이 정의되어
> 있어요. Firebase Console의 Rules 탭에 그대로 붙여넣어 배포해야 실제로 적용돼요.

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