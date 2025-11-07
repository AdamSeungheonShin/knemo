// 기본 색상 인터페이스
export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

// 픽셀 아트 설정
export interface PixelArtConfig {
  width: number; // 1-500
  height: number; // 1-500
  colorCount: number; // 2-14
  dithering: boolean; // 디더링 적용 여부
}

// 픽셀 그리드의 개별 픽셀
export interface Pixel {
  x: number;
  y: number;
  color: Color;
  colorIndex: number; // 팔레트에서의 인덱스
}

// 픽셀 그리드 전체
export interface PixelGrid {
  width: number;
  height: number;
  pixels: Pixel[][];
  palette: Color[];
}

// 픽셀 아트 프로젝트
export interface PixelArtProject {
  id: string;
  name: string;
  pixelGrid: PixelGrid;
  originalImage?: string; // base64 데이터 URL
  config: PixelArtConfig;
  createdAt: Date;
  updatedAt: Date;
  thumbnail: string; // base64 썸네일
}

// 앱 전체 상태
export interface AppState {
  // 현재 작업 중인 이미지와 프로젝트
  currentImage: File | null;
  currentProject: PixelArtProject | null;
  pixelGrid: PixelGrid | null;

  // 편집기 상태
  editorMode: 'view' | 'edit';
  selectedColor: Color;
  selectedColorIndex: number;
  brushSize: 1 | 2 | 3;
  showGrid: boolean;

  // 히스토리 (실행 취소/다시 실행)
  history: PixelGrid[];
  historyIndex: number;

  // UI 상태
  isLoading: boolean;
  error: string | null;

  // 설정
  theme: 'light' | 'dark' | 'system';
}

// 브러쉬 도구 타입
export type BrushTool = 'pixel' | 'fill' | 'eyedropper' | 'eraser';

// 내보내기 옵션
export interface ExportOptions {
  scale: 1 | 2 | 4 | 8 | 16;
  showGrid: boolean;
  includeColorInfo: boolean;
  fileName: string;
}

// 파일 업로드 상태
export interface UploadState {
  isDragging: boolean;
  progress: number;
  error: string | null;
}

// 색상 양자화 결과
export interface QuantizationResult {
  palette: Color[];
  quantizedData: Uint8ClampedArray;
}

// 이미지 처리 워커 메시지
export interface WorkerMessage {
  type: 'quantize' | 'resample' | 'generate-grid';
  payload: {
    imageData?: ImageData;
    config?: PixelArtConfig;
    [key: string]: unknown;
  };
}

export interface WorkerResponse {
  type: string;
  result?: QuantizationResult | PixelGrid | ImageData;
  error?: string;
}
