const axios = require('axios');

const uploadToImgBB = async (base64) => {
    try {
        const formDataString = `key=${encodeURIComponent(process.env.IMGBB_API_KEY)}&image=${encodeURIComponent(base64)}`;
        const response = await axios.post(
            'https://api.imgbb.com/1/upload',
            formDataString,
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
        return 'empty';
    }
};

module.exports = uploadToImgBB;