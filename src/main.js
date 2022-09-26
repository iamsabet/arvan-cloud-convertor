const { S3Client, HeadBucketCommand, CreateBucketCommand, DeleteBucketCommand, PutObjectCommand, ListObjectsCommand, GetBucketLifecycleConfigurationCommand } = require('@aws-sdk/client-s3');
const options = require('./options');
const fs = require('fs');
const path = require('path');
console.log("path :" + path.resolve());
const s3 = new S3Client({
    region: 'default',
    endpoint: options.arvanS3EndPoint,
    credentials: {
        accessKeyId: options.arvanAccessKeyId,
        secretAccessKey: options.arvanSecretAccessKey,
    },
});

const headBucket = async() => {
    try {
        const data = await s3.send(
            new HeadBucketCommand({
                Bucket: options.arvanStorageBucketName,

            })
        );
        console.log(data);
    } catch (err) {
        console.log('Error', err);
    }
};

headBucket();
const file = path.resolve() + '/pant.mp4';
const uploadParams = {
    Bucket: options.arvanStorageBucketName, // bucket name
    Key: file, // the name of the selected file
    ACL: 'public-read', // 'private' | 'public-read'
    Body: 'BODY',
};
const upload = async() => {
    // Configure the file stream and obtain the upload parameters
    const fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err) {
        console.log('File Error', err);
    });
    uploadParams.Key = path.basename(file);
    // call S3 to upload file to specified bucket
    uploadParams.Body = fileStream;

    try {
        uploadParams.Body.addListener = () => {
            console.log(e);
        };
        const data = await s3.send(new PutObjectCommand(uploadParams));
        console.log('Success', data);
    } catch (err) {
        console.log('Error', err);
    }
};

upload();

// const listOfFilesInsideBucket = async() => {
//     try {
//         const response = await s3.send(
//             new ListObjectsCommand({
//                 Bucket: options.arvanStorageBucketName,
//             })
//         );
//         console.log('Success', response);
//     } catch (err) {
//         console.log('Error', err);
//     }
// };

// listOfFilesInsideBucket();