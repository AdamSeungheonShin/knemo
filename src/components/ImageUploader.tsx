import { useState } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  maxSize?: number; // MB 단위
  className?: string;
}

const ImageUploader = ({ 
  onImageSelect, 
  maxSize = 10,
  className 
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={cn(
        'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors',
        'hover:border-gray-400 focus-within:border-blue-500',
        isDragging && 'border-blue-500 bg-blue-50',
        className
      )}
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
        
        {/* 파일 선택 버튼은 다음 단계에서 구현 */}
      </div>
    </div>
  );
};

export default ImageUploader;
