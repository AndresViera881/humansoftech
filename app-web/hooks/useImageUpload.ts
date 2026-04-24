'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';

interface UseImageUploadResult {
  uploading: boolean;
  uploadImages: (files: File[]) => Promise<string[]>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  openFilePicker: () => void;
}

export function useImageUpload(): UseImageUploadResult {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!files.length) return [];
    setUploading(true);
    try {
      const results = await api.upload.images(files);
      return results.map(r => r.url);
    } finally {
      setUploading(false);
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();

  return { uploading, uploadImages, fileInputRef, openFilePicker };
}
