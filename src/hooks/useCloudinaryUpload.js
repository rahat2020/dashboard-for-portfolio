import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

/**
 * Uploads files directly to Cloudinary using an unsigned upload preset.
 * The API secret must never be used here — unsigned presets let the browser
 * upload without exposing any credential that could be used to sign requests.
 */
const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback((file) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      const message =
        'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.';
      toast.error(message);
      return Promise.reject(new Error(message));
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    setUploading(true);
    setProgress(0);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', UPLOAD_URL);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        let data;
        try {
          data = JSON.parse(xhr.responseText);
        } catch {
          data = null;
        }

        if (xhr.status >= 200 && xhr.status < 300 && data?.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(new Error(data?.error?.message || 'Image upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));

      xhr.send(formData);
    })
      .catch((err) => {
        toast.error(err.message || 'Image upload failed');
        throw err;
      })
      .finally(() => {
        setUploading(false);
        setProgress(0);
      });
  }, []);

  return { uploadFile, uploading, progress };
};

export default useCloudinaryUpload;
