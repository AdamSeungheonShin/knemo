import { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { cn, isSupportedImageType, formatFileSize } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onError?: (error: string) => void;
  maxSize?: number; // MB 단위
  className?: string;
}

const ImageUploader = ({
  onImageSelect,
  onError,
  maxSize = 10,
  className,
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // 파일 형식 검증
    if (!isSupportedImageType(file)) {
      return '지원하지 않는 파일 형식입니다. JPEG, PNG, WebP 파일만 업로드 가능합니다.';
    }

    // 파일 크기 검증 (MB를 바이트로 변환)
    const maxSizeInBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return `파일 크기가 너무 큽니다. 최대 ${maxSize}MB까지 업로드 가능합니다. (현재: ${formatFileSize(
        file.size
      )})`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      onError?.(validationError);
      return;
    }

    setError(null);
    onImageSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      handleFileSelect(imageFile);
    } else if (files.length > 0) {
      setError('이미지 파일을 업로드해주세요.');
      onError?.('이미지 파일을 업로드해주세요.');
    }
  };

  return (
    <div
      className={cn(
        'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors',
        'hover:border-gray-400 focus-within:border-blue-500',
        isDragging && 'border-blue-500 bg-blue-50',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Upload className="w-8 h-8 text-gray-400" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">
            이미지를 업로드하세요
          </h3>
          <p className="text-sm text-gray-500">
            JPEG, PNG, WebP 파일을 지원합니다 (최대 {maxSize}MB)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <label className="relative cursor-pointer">
            <input
              type="file"
              className="sr-only"
              accept="image/jpeg,image/png,image/webp"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileSelect(file);
                }
              }}
            />
            <div className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              파일 선택
            </div>
          </label>

          <span className="text-sm text-gray-400">또는</span>

          <span className="text-sm text-gray-500">
            여기에 파일을 드래그하세요
          </span>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
