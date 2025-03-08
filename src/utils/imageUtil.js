const fs = require('fs');
const initCloudinary = require('../config/cloudinary');

const imageUpload = async (reqFile) => {
    const cld = initCloudinary()

    try {
        const uploadResult = await cld.uploader.upload(reqFile.path)

        fs.unlinkSync(reqFile.path)
    
        return uploadResult.secure_url
    } catch (error) {
        throw new Error('Cloudinary Error Upload')
    }
}

const imageUploadBase64 = async (base64String) => {
    const cld = initCloudinary()

    try {
        // Remove the data:image/<format>;base64, prefix if it exists
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        
        // Upload directly using base64
        const uploadResult = await cld.uploader.upload(`data:image/png;base64,${base64Data}`, {
            resource_type: 'image'
        });
    
        return uploadResult.secure_url
    } catch (error) {
        throw new Error('Cloudinary Error Upload')
    }
}

module.exports = {
    imageUpload,
    imageUploadBase64
}