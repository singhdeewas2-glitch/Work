export const uploadImageToS3 = async (file, token, folder = 'profiles') => {
  try {
    const res = await fetch(`http://localhost:8080/api/upload-url?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&folder=${encodeURIComponent(folder)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) throw new Error("Failed to get upload URL");
    
    const { uploadUrl, imageUrl } = await res.json();
    
    const s3Res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type
      },
      body: file
    });

    if (!s3Res.ok) throw new Error("Failed to upload to S3");
    
    return imageUrl;
  } catch (err) {
    throw err;
  }
};
