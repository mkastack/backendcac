import { supabase } from './supabase';

/**
 * Uploads a file to the 'church-assets' storage bucket.
 * @param file The file to upload.
 * @returns The public URL of the uploaded file.
 */
export async function uploadChurchAsset(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('church-assets')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('church-assets')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading asset:', error);
    return null;
  }
}
