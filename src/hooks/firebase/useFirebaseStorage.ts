import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, StorageError } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

// Add timeout controller for Firebase Storage operations
class TimeoutController {
  private timeoutId: NodeJS.Timeout | null = null;
  
  constructor(private defaultTimeout: number = 30000) {} // 30 seconds default
  
  setTimeout(callback: () => void, timeout: number = this.defaultTimeout): void {
    this.clearTimeout();
    this.timeoutId = setTimeout(callback, timeout);
  }
  
  clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

export type UploadState = {
  progress: number;
  downloadURL: string | null;
  isUploading: boolean;
  error: Error | null;
};

/**
 * Hook for handling file uploads to Firebase Storage with progress tracking
 * @returns An object with upload state and upload function
 */
export function useFirebaseStorage() {
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    downloadURL: null,
    isUploading: false,
    error: null
  });

  // Reset the state when component unmounts or when needed
  const resetUploadState = useCallback(() => {
    setUploadState({
      progress: 0,
      downloadURL: null,
      isUploading: false,
      error: null
    });
  }, []);

  // Function to upload a file to Firebase Storage
  const uploadFile = useCallback((
    file: File,
    path: string,
    fileName?: string,
    timeoutMs: number = 60000 // 60 second timeout
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Reset state before starting a new upload
      setUploadState(prev => ({
        ...prev,
        progress: 0,
        downloadURL: null,
        isUploading: true,
        error: null
      }));

      // Create timeout controller for this upload
      const timeoutController = new TimeoutController(timeoutMs);
      
      try {
        const safeFileName = fileName || 
          `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        
        const fullPath = `${path}/${safeFileName}`;
        const storageRef = ref(storage, fullPath);
        
        // Set timeout handler
        timeoutController.setTimeout(() => {
          const timeoutError = new Error('Upload operation timed out');
          setUploadState(prev => ({
            ...prev,
            error: timeoutError,
            isUploading: false
          }));
          reject(timeoutError);
        });
        
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Reset timeout on progress
            timeoutController.clearTimeout();
            timeoutController.setTimeout(() => {
              const timeoutError = new Error('Upload operation timed out during progress update');
              reject(timeoutError);
            });
            
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadState(prev => ({
              ...prev,
              progress
            }));
          },
          (error: StorageError) => {
            timeoutController.clearTimeout();
            setUploadState(prev => ({
              ...prev,
              error,
              isUploading: false
            }));
            reject(error);
          },
          async () => {
            try {
              // Set a separate timeout for getDownloadURL
              const downloadURLPromise = getDownloadURL(uploadTask.snapshot.ref);
              
              // Race between timeout and download URL
              const downloadURL = await Promise.race([
                downloadURLPromise,
                new Promise<never>((_, reject) => {
                  setTimeout(() => reject(new Error('getDownloadURL timed out')), 15000);
                })
              ]);
              
              timeoutController.clearTimeout();
              setUploadState({
                progress: 100,
                downloadURL,
                isUploading: false,
                error: null
              });
              resolve(downloadURL);
            } catch (error) {
              timeoutController.clearTimeout();
              const storageError = error as StorageError;
              setUploadState(prev => ({
                ...prev,
                error: storageError,
                isUploading: false
              }));
              reject(error);
            }
          }
        );
      } catch (error) {
        timeoutController.clearTimeout();
        const err = error instanceof Error ? error : new Error('Unknown error');
        setUploadState(prev => ({
          ...prev,
          error: err,
          isUploading: false
        }));
        reject(error);
      }
    });
  }, []);

  // Function to delete a file from Firebase Storage using the file URL
  const deleteFile = useCallback(async (fileUrl: string, timeoutMs: number = 15000): Promise<boolean> => {
    if (!fileUrl || fileUrl.trim() === '') {
      console.log('No file URL provided for deletion');
      return false;
    }
    
    try {
      // Extract the path from the URL
      // Firebase Storage URLs are in the format:
      // https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?[params]
      const urlObj = new URL(fileUrl);
      const path = decodeURIComponent(urlObj.pathname.split('/o/')[1]?.split('?')[0]);
      
      if (!path) {
        console.error('Could not extract path from URL:', fileUrl);
        return false;
      }
      
      // Create a reference to the file
      const fileRef = ref(storage, path);
      
      // Delete the file with timeout
      const deleteWithTimeout = async (): Promise<void> => {
        return Promise.race([
          deleteObject(fileRef),
          new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Delete operation timed out')), timeoutMs);
          })
        ]);
      };
      
      try {
        await deleteWithTimeout();
        console.log('File successfully deleted:', path);
        return true;
      } catch (error) {
        const timeoutError = error as Error;
        if (timeoutError.message?.includes('timed out')) {
          console.error('Delete operation timed out:', fileUrl);
          // In case of timeout, consider it a partial success
          // The file might actually be deleted but we didn't get confirmation
          return false;
        }
        throw error; // re-throw if not a timeout
      }
    } catch (error) {
      // Handle specific Firebase Storage errors
      if ((error as StorageError).code === 'storage/object-not-found') {
        console.log('File does not exist, no need to delete:', fileUrl);
        return true; // Consider this a success since the goal was to not have the file
      }
      
      console.error('Error deleting file:', error);
      return false;
    }
  }, []);

  return {
    ...uploadState,
    uploadFile,
    deleteFile,
    resetUploadState
  };
}