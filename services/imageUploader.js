const axios = require('axios');

const uploadToImgBB = async (base64) => {
    try {
        const formData = new URLSearchParams();
        formData.append('key', process.env.IMGBB_API_KEY);
        formData.append('image', base64);

        const response = await axios.post(
            'https://api.imgbb.com/1/upload',
            formData.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return response.data.data.url;
    } catch (error) {
        console.error('ImgBB Upload Error:', {
            message: error.message,
            response: error.response?.data,
            stack: error.stack
        });
        throw error; // Re-throw for the calling function to handle
    }
};

module.exports = uploadToImgBB;