const streamifier = require("streamifier")
const cloudinaryV2 = require('cloudinary');
const multer = require("multer")
require("dotenv").config()

const settings = () => {
    cloudinaryV2.v2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    });

    const storage = multer.memoryStorage()

    const upload = multer({ storage })

    return upload
}


const streamUploadFile = async (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinaryV2.v2.uploader.upload_stream(
            {
                resource_type: "auto",
                // You can add other upload options here
            },
            function (err, result){
                if(err) reject(`error ${err}`)
                resolve(result)
            }
        );

        // Pipe the buffer to the Cloudinary stream
        streamifier.createReadStream(buffer).pipe(stream);
    });
};


module.exports = {
    cloudinaryV2,
    streamUploadFile,
    settings
}