import { Button } from '@/components/ui/button';
import { useLanguage } from '@/store/LanguageContext';
import { Upload, X } from 'lucide-react';
import React, { useRef } from 'react';

interface FileUploadProps {
  files: File[];
  previews: string[];
  maxFiles?: number;
  onFilesChange: (files: File[]) => void;
  onPreviewsChange: (previews: string[]) => void;
  accept?: string;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
  buttonText?: string;
}

export function FileUpload({
  files,
  previews,
  maxFiles = 5,
  onFilesChange,
  onPreviewsChange,
  accept = 'image/*',
  label,
  description,
  icon,
  buttonText,
}: FileUploadProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Limit to maxFiles
    const remainingSlots = maxFiles - files.length;
    if (remainingSlots <= 0) return;

    const newFiles = selectedFiles.slice(0, remainingSlots);
    onFilesChange([...files, ...newFiles]);

    // Create previews for images only
    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length > 0) {
      const newPreviews: string[] = [];
      let loadedCount = 0;

      imageFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          loadedCount++;
          // Update previews when all images are loaded
          if (loadedCount === imageFiles.length) {
            onPreviewsChange([...previews, ...newPreviews]);
          }
        };
        reader.onerror = () => {
          console.error('Error reading file:', file.name);
          loadedCount++;
        };
        reader.readAsDataURL(file);
      });
    }

    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
    onPreviewsChange(previews.filter((_, i) => i !== index));
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
        {icon || (
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        )}
        {description && (
          <p className="text-sm text-muted-foreground mb-2">
            {description}
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept={accept}
          onChange={handleFileChange}
          disabled={files.length >= maxFiles}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          disabled={files.length >= maxFiles}
        >
          {buttonText || t('common.chooseFile')}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          {t('common.filesSelected', {
            count: files.length,
            total: maxFiles,
          })}
        </p>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative border border-border rounded-lg p-2"
            >
              {file.type.startsWith('image/') && previews[index] ? (
                <img
                  src={previews[index]}
                  alt={file.name}
                  className="w-full h-24 object-cover rounded"
                />
              ) : (
                <div className="w-full h-24 bg-muted rounded flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {file.name}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveFile(index)}
                className="absolute top-1 right-1 h-6 w-6 p-0 bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
