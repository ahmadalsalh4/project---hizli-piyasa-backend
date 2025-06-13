async function uploadToImgBB(base64Image) {
  const formData = new FormData();
  formData.append("key", process.env.IMGBB_API_KEY);
  formData.append("image", base64Image);

  try {
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });
    result = await response.json();
    return result.data.url;
  } catch (err) {
    console.log(err);
    return "empty";
  }
}

module.exports = uploadToImgBB;
