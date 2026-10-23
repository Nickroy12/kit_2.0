
const IMGBB_API_KEY =
  process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
  process.env.VITE_IMGBB_API_KEY ||
  '';

export async function uploadImage(file: File): Promise<string> {
  const apiKey = IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error('ImgBB API key is missing');
  }

  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Image upload failed');
  }

  const result = await response.json();

  if (!result.success || !result.data?.url) {
    throw new Error('Invalid image upload response');
  }

  return result.data.url as string;
}
