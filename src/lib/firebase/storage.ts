import { storage } from './config';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  uploadBytesResumable,
  deleteObject,
  listAll,
  StorageError
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Types for storage operations
export type UploadProgressCallback = (progress: number, bytesTransferred: number, totalBytes: number) => void;

/**
 * Uploads a file to Firebase Storage
 * @param file - The file to upload
 * @param path - The storage path (folder) to upload to
 * @param customFileName - Optional custom filename, if not provided uses a UUID
 * @returns The download URL for the uploaded file
 */
export const uploadFile = async (
  file: File,
  path: string,
  customFileName?: string
): Promise<string> => {
  try {
    const fileName = customFileName || `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const fullPath = `${path}/${fileName}`;
    const storageRef = ref(storage, fullPath);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    const storageError = error as StorageError;
    console.error('Error uploading file:', storageError.message);
    throw error;
  }
};

/**
 * Uploads a file to Firebase Storage with progress tracking
 * @param file - The file to upload
 * @param path - The storage path (folder) to upload to
 * @param progressCallback - Callback function for tracking upload progress
 * @param customFileName - Optional custom filename, if not provided uses a UUID
 * @returns The download URL for the uploaded file
 */
export const uploadFileWithProgress = (
  file: File,
  path: string,
  progressCallback: UploadProgressCallback,
  customFileName?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = customFileName || `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const fullPath = `${path}/${fileName}`;
      const storageRef = ref(storage, fullPath);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressCallback(progress, snapshot.bytesTransferred, snapshot.totalBytes);
        },
        (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    } catch (error) {
      console.error('Error initiating upload:', error);
      reject(error);
    }
  });
};

/**
 * Deletes a file from Firebase Storage by URL
 * @param url - The download URL of the file to delete
 */
export const deleteFileByUrl = async (url: string): Promise<void> => {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    const storageError = error as StorageError;
    console.error('Error deleting file:', storageError.message);
    throw error;
  }
};

/**
 * Deletes a file from Firebase Storage by path
 * @param path - The storage path of the file to delete
 */
export const deleteFileByPath = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    const storageError = error as StorageError;
    console.error('Error deleting file:', storageError.message);
    throw error;
  }
};

/**
 * Lists all files in a specific directory
 * @param path - The storage path to list files from
 * @returns Array of file download URLs
 */
export const listFiles = async (path: string): Promise<string[]> => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    const urls = await Promise.all(
      result.items.map(async (itemRef) => {
        return await getDownloadURL(itemRef);
      })
    );
    
    return urls;
  } catch (error) {
    const storageError = error as StorageError;
    console.error('Error listing files:', storageError.message);
    throw error;
  }
};

// Event-specific helper functions

/**
 * Uploads an event cover image
 * @param file - The image file to upload
 * @param eventId - The ID of the event
 * @returns The download URL for the uploaded image
 */
export const uploadEventCoverImage = async (
  file: File, 
  eventId: string
): Promise<string> => {
  return await uploadFile(file, `events/${eventId}/coverImage`);
};

/**
 * Deletes an event's cover image
 * @param eventId - The ID of the event
 * @param imageUrl - The URL of the image to delete
 */
export const deleteEventCoverImage = async (
  eventId: string, 
  imageUrl: string
): Promise<void> => {
  try {
    await deleteFileByUrl(imageUrl);
  } catch (error) {
    console.error(`Error deleting cover image for event ${eventId}:`, error);
    throw error;
  }
};