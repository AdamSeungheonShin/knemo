# 픽셀 아트 변환기 (Knemo) - 프로젝트 기획서

## 📋 프로젝트 개요

### 서비스 명

**Knemo** - 이미지를 픽셀 아트로 변환하고 편집할 수 있는 웹 애플리케이션

### 서비스 목적

- 일반 이미지를 픽셀 아트 스타일로 변환
- 변환된 픽셀 아트를 직관적으로 편집
- 도안 이미지로 저장하여 크로스 스티치, 비즈공예 등에 활용

### 핵심 가치 제안

- 🎨 간단한 이미지 업로드만으로 픽셀 아트 생성
- ⚡ 실시간 미리보기와 편집 기능
- 💾 브라우저 기반 로컬 저장으로 개인정보 보호
- 📱 반응형 디자인으로 다양한 디바이스 지원

---

## 🏗️ 기술 아키텍처

### 기술 스택

- **Frontend**: Next.js 16.0.1 + React 19.2.0
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Storage**: IndexedDB (브라우저 로컬 DB)
- **Image Processing**: Canvas API + Web Workers

### 아키텍처 원칙

1. **서버리스**: 백엔드 없이 클라이언트 사이드에서 모든 처리
2. **로컬 퍼스트**: 업로드된 이미지는 서버에 저장하지 않음
3. **반응형**: 모바일부터 데스크톱까지 대응
4. **성능 최적화**: Web Workers를 활용한 비동기 이미지 처리

### 시스템 구조

```
Client Browser
├── Next.js App Router
├── Image Processing Engine (Canvas API + Web Workers)
├── IndexedDB Storage Manager
└── Pixel Art Editor Component
```

---

## 🎯 주요 기능 명세

### 1. 이미지 업로드 및 처리

**기능 설명**: 사용자가 이미지를 업로드하면 픽셀 아트로 변환

**상세 요구사항**:

- 지원 형식: JPEG, PNG, WebP (정적 이미지만 지원)
- 최대 파일 크기: 10MB
- 드래그 앤 드롭 지원
- 미리보기 기능

**기술 구현**:

- File API를 통한 이미지 업로드
- Canvas API를 통한 이미지 렌더링
- Image resizing 알고리즘 적용

### 2. 픽셀화 설정

**기능 설명**: 사용자가 원하는 픽셀화 정도와 색상 수를 설정

**상세 요구사항**:

- 가로/세로 칸 수: 1~500칸
- 색상 수: 2~14색
- 실시간 미리보기
- 프리셋 제공 (16x16, 32x32, 64x64 등)

**기술 구현**:

- K-means clustering을 통한 색상 양자화
- 이미지 리샘플링 알고리즘
- React 상태 관리를 통한 실시간 업데이트

### 3. 자동 픽셀 아트 변환

**기능 설명**: 원본 이미지를 설정값에 따라 픽셀 아트로 자동 변환

**처리 과정**:

1. 이미지 비율 유지하며 크기 조정
2. 지정된 칸 수에 맞게 리샘플링
3. 색상 양자화 (K-means clustering)
4. 픽셀 그리드 생성

**기술 구현**:

```typescript
interface PixelArtConfig {
  width: number; // 1-500
  height: number; // 1-500
  colorCount: number; // 2-14
  dithering: boolean; // 디더링 적용 여부
}
```

### 4. 픽셀 아트 편집 모드

**기능 설명**: 변환된 픽셀 아트를 개별 픽셀 단위로 편집

**상세 요구사항**:

- 색상 팔레트에서 색상 선택
- 픽셀 클릭으로 색상 변경
- 브러쉬 크기 조절 (1x1, 2x2, 3x3)
- 실행 취소/다시 실행 기능
- 격자 표시/숨김 토글

**기술 구현**:

- Canvas 기반 픽셀 에디터
- 이벤트 핸들링 최적화
- 상태 히스토리 관리

### 5. 로컬 저장 및 관리

**기능 설명**: 최근 작업한 픽셀 아트를 브라우저에 저장

**상세 요구사항**:

- 최대 20개까지 저장
- 썸네일과 메타데이터 포함
- 저장/불러오기/삭제 기능
- 자동 저장 (5분마다)

**기술 구현**:

- IndexedDB를 통한 로컬 저장
- 썸네일 자동 생성
- LRU 캐시 정책 적용

### 6. 도안 이미지 내보내기

**기능 설명**: 완성된 픽셀 아트를 PNG 파일로 저장

**내보내기 옵션**:

- 원본 크기 (픽셀 단위)
- 확대 크기 (2x, 4x, 8x, 16x)
- 격자 포함/제외 선택
- 색상 정보 텍스트 포함 옵션

**기술 구현**:

- Canvas toBlob API 활용
- 고해상도 렌더링
- 메타데이터 임베딩

---

## 🎨 UI/UX 설계

### 디자인 컨셉

- **미니멀리즘**: 깔끔하고 직관적인 인터페이스
- **다크/라이트 모드**: 사용자 선호도에 따른 테마 제공
- **접근성**: WCAG 2.1 AA 레벨 준수

### 주요 화면 구성

#### 1. 메인 화면

```
┌─────────────────────────────────────────┐
│  🎨 Knemo - Pixel Art Converter         │
├─────────────────────────────────────────┤
│                                         │
│        [📁 Upload Image]                │
│                                         │
│  Recent Projects:                       │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐               │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │               │
│  └───┘ └───┘ └───┘ └───┘               │
└─────────────────────────────────────────┘
```

#### 2. 변환 설정 화면

```
┌─────────────────────────────────────────┐
│ Original Image    │    Preview          │
│ ┌─────────────┐   │   ┌─────────────┐   │
│ │             │   │   │ ░░░▓▓▓░░░   │   │
│ │   Original  │   │   │ ░▓▓▓▓▓▓▓░   │   │
│ │    Image    │   │   │ ▓▓▓▓▓▓▓▓▓   │   │
│ │             │   │   │ ▓▓▓▓▓▓▓▓▓   │   │
│ └─────────────┘   │   └─────────────┘   │
├─────────────────────────────────────────┤
│ Grid: 32x32  Colors: 8  [Convert]       │
└─────────────────────────────────────────┘
```

#### 3. 편집 화면

```
┌─────────────────────────────────────────┐
│ 🎨 [Save] [Export] [Undo] [Redo]        │
├─────────────────────────────────────────┤
│ Canvas Area          │   Color Palette  │
│ ┌─────────────────┐  │   ┌─┬─┬─┬─┬─┐    │
│ │ ▓▓░░▓▓░░▓▓░░    │  │   │1│2│3│4│5│    │
│ │ ░░▓▓░░▓▓░░▓▓    │  │   ├─┼─┼─┼─┼─┤    │
│ │ ▓▓░░▓▓░░▓▓░░    │  │   │6│7│8│ │ │    │
│ │ ░░▓▓░░▓▓░░▓▓    │  │   └─┴─┴─┴─┴─┘    │
│ └─────────────────┘  │                  │
│                      │   Brush: [1x1]   │
│                      │   Grid: [ON]     │
└─────────────────────────────────────────┘
```

### 반응형 브레이크포인트

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 🔧 구현 상세

### 폴더 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 메인 페이지
│   ├── editor/
│   │   └── page.tsx            # 편집기 페이지
│   └── globals.css             # 전역 스타일
├── components/
│   ├── ui/                     # 재사용 가능한 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── Slider.tsx
│   ├── ImageUploader.tsx       # 이미지 업로드 컴포넌트
│   ├── PixelConverter.tsx      # 픽셀 변환 컴포넌트
│   ├── PixelEditor.tsx         # 픽셀 편집기
│   ├── ColorPalette.tsx        # 색상 팔레트
│   └── RecentProjects.tsx      # 최근 프로젝트 목록
├── lib/
│   ├── pixelArt.ts            # 픽셀 아트 변환 로직
│   ├── colorQuantization.ts   # 색상 양자화 알고리즘
│   ├── storage.ts             # IndexedDB 래퍼
│   └── utils.ts               # 유틸리티 함수
├── types/
│   └── index.ts               # TypeScript 타입 정의
└── workers/
    └── imageProcessor.ts      # 이미지 처리 웹 워커
```

### 핵심 알고리즘

#### 1. 색상 양자화 (K-means Clustering)

```typescript
interface Color {
  r: number;
  g: number;
  b: number;
}

function quantizeColors(imageData: ImageData, k: number): Color[] {
  // K-means clustering을 통한 색상 양자화
  // 1. 랜덤 중심점 초기화
  // 2. 픽셀을 가장 가까운 중심점에 할당
  // 3. 중심점 업데이트
  // 4. 수렴할 때까지 반복
}
```

#### 2. 이미지 리샘플링

```typescript
function resampleImage(
  canvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): ImageData {
  // 1. 원본 이미지 데이터 추출
  // 2. 목적 크기로 리샘플링
  // 3. 최근접 이웃 또는 이중선형 보간법 적용
}
```

#### 3. 픽셀 그리드 생성

```typescript
function createPixelGrid(
  imageData: ImageData,
  colors: Color[],
  gridWidth: number,
  gridHeight: number
): PixelGrid {
  // 1. 이미지를 그리드로 분할
  // 2. 각 셀의 평균 색상 계산
  // 3. 가장 가까운 팔레트 색상으로 매핑
}
```

### 상태 관리

```typescript
interface AppState {
  currentImage: File | null;
  pixelArt: PixelGrid | null;
  editorMode: 'view' | 'edit';
  selectedColor: Color;
  brushSize: 1 | 2 | 3;
  showGrid: boolean;
  history: PixelGrid[];
  historyIndex: number;
}
```

### 성능 최적화

1. **이미지 처리 비동기화**: Web Workers 활용
2. **가상화**: 대용량 그리드를 위한 가상 스크롤링
3. **메모이제이션**: React.memo와 useMemo 적극 활용
4. **지연 로딩**: 컴포넌트와 이미지 지연 로딩

---

## 📊 개발 계획

### Phase 1: 기본 기능 구현 (2주)

- [ ] 프로젝트 초기 설정
- [ ] 이미지 업로드 컴포넌트
- [ ] 기본 픽셀 변환 알고리즘
- [ ] 미리보기 기능

### Phase 2: 편집 기능 (2주)

- [ ] 픽셀 편집기 구현
- [ ] 색상 팔레트
- [ ] 실행 취소/다시 실행
- [ ] 브러쉬 도구

### Phase 3: 저장 및 내보내기 (1주)

- [ ] IndexedDB 저장소 구현
- [ ] 최근 프로젝트 관리
- [ ] PNG 내보내기 기능

### Phase 4: UI/UX 개선 (1주)

- [ ] 반응형 디자인 적용
- [ ] 다크/라이트 모드
- [ ] 접근성 개선
- [ ] 성능 최적화

### Phase 5: 테스트 및 배포 (1주)

- [ ] 단위 테스트 작성
- [ ] E2E 테스트
- [ ] 브라우저 호환성 테스트
- [ ] Vercel 배포

---

## 🧪 테스트 전략

### 단위 테스트

- 색상 양자화 알고리즘 테스트
- 이미지 리샘플링 테스트
- 저장소 로직 테스트

### 통합 테스트

- 이미지 업로드부터 변환까지 전체 플로우
- 편집 기능 통합 테스트

### E2E 테스트

- Playwright를 활용한 사용자 시나리오 테스트

### 성능 테스트

- 대용량 이미지 처리 성능
- 메모리 사용량 모니터링

---

## 🚀 배포 및 운영

### 배포 환경

- **플랫폼**: Vercel
- **도메인**: knemo.app (예정)
- **CDN**: Vercel Edge Network

### 모니터링

- **성능**: Web Vitals 모니터링
- **에러 추적**: Sentry 연동
- **사용자 분석**: Google Analytics

### 브라우저 지원

- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

---

## 🔒 보안 및 개인정보

### 개인정보 보호

- 모든 이미지는 클라이언트에서만 처리
- 서버에 이미지 데이터 전송 없음
- 브라우저 로컬 저장소만 사용

### 보안 고려사항

- XSS 방지를 위한 입력값 검증
- CSP(Content Security Policy) 적용
- 파일 업로드 크기 제한

---

## 📈 향후 확장 계획

### 추가 기능 아이디어

1. **애니메이션 픽셀 아트**: GIF 지원
2. **협업 기능**: 실시간 공동 편집
3. **템플릿 제공**: 미리 만들어진 픽셀 아트 템플릿
4. **벡터 내보내기**: SVG 형식 지원
5. **3D 픽셀 아트**: 복셀 아트 지원

### 기술적 개선

1. **오프라인 지원**: PWA 적용
2. **모바일 앱**: React Native 포팅
3. **AI 기능**: 스타일 전이, 자동 색상 추천

---

## 💰 비즈니스 모델 (선택사항)

### 무료 서비스

- 기본 픽셀 아트 변환 및 편집
- 최대 64x64 그리드
- 최대 8색 팔레트

### 프리미엄 기능

- 최대 500x500 그리드
- 최대 14색 팔레트
- 고급 내보내기 옵션
- 클라우드 저장소 연동

---

## 📝 개발 규칙 및 컨벤션

### 커밋 메시지 컨벤션

프로젝트의 일관성 있는 버전 관리를 위해 다음 커밋 메시지 규칙을 따릅니다.

#### 형식

```
Keyword: 작업 내용 설명
```

#### 키워드 종류

- **Feat**: 새로운 기능 추가
- **Fix**: 버그 수정
- **Docs**: 문서 수정
- **Style**: 코드 포맷팅, 세미콜론 누락 등 (기능 변경 없음)
- **Refactor**: 코드 리팩토링 (기능 변경 없음)
- **Test**: 테스트 코드 추가 또는 수정
- **Chore**: 빌드 스크립트, 패키지 매니저 설정 등
- **Perf**: 성능 개선
- **UI**: UI/UX 관련 작업
- **Config**: 설정 파일 변경

#### 예시

```bash
# 기능 추가
git commit -m "Feat: 이미지 업로드 컴포넌트 구현"
git commit -m "Feat: 픽셀 아트 변환 알고리즘 추가"

# 버그 수정
git commit -m "Fix: 색상 팔레트 선택 오류 수정"
git commit -m "Fix: 모바일에서 터치 이벤트 처리 개선"

# UI 작업
git commit -m "UI: 반응형 레이아웃 적용"
git commit -m "UI: 다크 모드 스타일 추가"

# 설정 변경
git commit -m "Config: TypeScript 경로 매핑 설정"
git commit -m "Config: ESLint 규칙 추가"

# 리팩토링
git commit -m "Refactor: 색상 유틸리티 함수 모듈화"
git commit -m "Refactor: 컴포넌트 props 인터페이스 개선"

# 문서
git commit -m "Docs: README 사용법 추가"
git commit -m "Docs: API 문서 업데이트"

# 테스트
git commit -m "Test: 색상 양자화 알고리즘 단위 테스트 추가"
git commit -m "Test: 이미지 업로드 E2E 테스트 구현"

# 성능
git commit -m "Perf: 이미지 처리 Web Worker 적용"
git commit -m "Perf: 메모이제이션을 통한 렌더링 최적화"

# 기타
git commit -m "Chore: 패키지 의존성 업데이트"
git commit -m "Chore: 빌드 스크립트 개선"
```

#### 상세 규칙

1. **첫 글자 대문자**: 키워드는 첫 글자를 대문자로 작성
2. **한글 사용**: 작업 내용은 명확한 한글로 작성
3. **현재형 사용**: "구현했다" 보다는 "구현" 사용
4. **간결하게**: 50자 이내로 요약, 필요시 본문에 상세 설명
5. **단일 작업**: 하나의 커밋은 하나의 논리적 변경사항만 포함

#### 브랜치 전략

- **main**: 배포 가능한 안정적인 코드
- **develop**: 개발 중인 최신 코드
- **feature/기능명**: 새로운 기능 개발
- **fix/버그명**: 버그 수정
- **hotfix/긴급수정**: 운영 환경 긴급 수정

#### 예시 워크플로우

```bash
# 새로운 기능 개발
git checkout -b feature/image-uploader
git commit -m "Feat: 이미지 업로드 컴포넌트 기본 구조 생성"
git commit -m "Feat: 드래그 앤 드롭 기능 추가"
git commit -m "UI: 업로드 진행 상태 표시 구현"
git commit -m "Test: 이미지 업로드 컴포넌트 테스트 추가"

# develop 브랜치로 병합
git checkout develop
git merge feature/image-uploader
git push origin develop
```

---
