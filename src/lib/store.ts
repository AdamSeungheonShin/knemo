import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { AppState, PixelGrid, Color, PixelArtProject } from '@/types';

interface AppActions {
  // 이미지 관련
  setCurrentImage: (image: File | null) => void;
  setCurrentProject: (project: PixelArtProject | null) => void;
  setPixelGrid: (grid: PixelGrid | null) => void;

  // 편집기 상태
  setEditorMode: (mode: 'view' | 'edit') => void;
  setSelectedColor: (color: Color, index: number) => void;
  setBrushSize: (size: 1 | 2 | 3) => void;
  toggleGrid: () => void;

  // 히스토리 관리
  addToHistory: (grid: PixelGrid) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;

  // UI 상태
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;

  // 픽셀 편집
  updatePixel: (x: number, y: number, colorIndex: number) => void;
  updatePixels: (
    updates: Array<{ x: number; y: number; colorIndex: number }>
  ) => void;
}

type AppStore = AppState & AppActions;

// 기본 색상 팔레트
const DEFAULT_COLORS: Color[] = [
  { r: 0, g: 0, b: 0 }, // 검은색
  { r: 255, g: 255, b: 255 }, // 흰색
  { r: 255, g: 0, b: 0 }, // 빨간색
  { r: 0, g: 255, b: 0 }, // 초록색
  { r: 0, g: 0, b: 255 }, // 파란색
  { r: 255, g: 255, b: 0 }, // 노란색
  { r: 255, g: 0, b: 255 }, // 마젠타
  { r: 0, g: 255, b: 255 }, // 시안
];

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      currentImage: null,
      currentProject: null,
      pixelGrid: null,
      editorMode: 'view',
      selectedColor: DEFAULT_COLORS[0],
      selectedColorIndex: 0,
      brushSize: 1,
      showGrid: true,
      history: [],
      historyIndex: -1,
      isLoading: false,
      error: null,
      theme: 'system',

      // 액션들
      setCurrentImage: image => {
        set({ currentImage: image, error: null });
      },

      setCurrentProject: project => {
        set({ currentProject: project });
      },

      setPixelGrid: grid => {
        set({ pixelGrid: grid });
        if (grid) {
          // 새로운 그리드가 설정되면 히스토리에 추가
          get().addToHistory(grid);
        }
      },

      setEditorMode: mode => {
        set({ editorMode: mode });
      },

      setSelectedColor: (color, index) => {
        set({ selectedColor: color, selectedColorIndex: index });
      },

      setBrushSize: size => {
        set({ brushSize: size });
      },

      toggleGrid: () => {
        set(state => ({ showGrid: !state.showGrid }));
      },

      addToHistory: grid => {
        set(state => {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(JSON.parse(JSON.stringify(grid))); // 깊은 복사

          // 히스토리 크기 제한 (50개)
          if (newHistory.length > 50) {
            newHistory.shift();
          }

          return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      undo: () => {
        set(state => {
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            const previousGrid = state.history[newIndex];
            return {
              historyIndex: newIndex,
              pixelGrid: JSON.parse(JSON.stringify(previousGrid)),
            };
          }
          return state;
        });
      },

      redo: () => {
        set(state => {
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            const nextGrid = state.history[newIndex];
            return {
              historyIndex: newIndex,
              pixelGrid: JSON.parse(JSON.stringify(nextGrid)),
            };
          }
          return state;
        });
      },

      clearHistory: () => {
        set({ history: [], historyIndex: -1 });
      },

      setLoading: loading => {
        set({ isLoading: loading });
      },

      setError: error => {
        set({ error });
      },

      setTheme: theme => {
        set({ theme });
        // 실제 테마 적용 로직은 별도 구현 필요
      },

      updatePixel: (x, y, colorIndex) => {
        set(state => {
          if (!state.pixelGrid) return state;

          const newGrid = JSON.parse(JSON.stringify(state.pixelGrid));
          if (newGrid.pixels[y] && newGrid.pixels[y][x]) {
            newGrid.pixels[y][x].colorIndex = colorIndex;
            newGrid.pixels[y][x].color = newGrid.palette[colorIndex];
          }

          return { pixelGrid: newGrid };
        });
      },

      updatePixels: updates => {
        set(state => {
          if (!state.pixelGrid) return state;

          const newGrid = JSON.parse(JSON.stringify(state.pixelGrid));

          updates.forEach(({ x, y, colorIndex }) => {
            if (newGrid.pixels[y] && newGrid.pixels[y][x]) {
              newGrid.pixels[y][x].colorIndex = colorIndex;
              newGrid.pixels[y][x].color = newGrid.palette[colorIndex];
            }
          });

          return { pixelGrid: newGrid };
        });
      },
    }),
    {
      name: 'knemo-app-store',
    }
  )
);

// 선택자 함수들 (성능 최적화를 위해)
export const useCurrentImage = () => useAppStore(state => state.currentImage);
export const usePixelGrid = () => useAppStore(state => state.pixelGrid);
export const useEditorMode = () => useAppStore(state => state.editorMode);
export const useSelectedColor = () =>
  useAppStore(state => ({
    color: state.selectedColor,
    index: state.selectedColorIndex,
  }));
export const useBrushSize = () => useAppStore(state => state.brushSize);
export const useShowGrid = () => useAppStore(state => state.showGrid);
export const useHistoryState = () =>
  useAppStore(state => ({
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
  }));
export const useLoadingState = () =>
  useAppStore(state => ({
    isLoading: state.isLoading,
    error: state.error,
  }));
