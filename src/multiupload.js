const {
    S3Client,
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    UploadPartCommand,
} = require("@aws-sdk/client-s3");
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

// File
var fileName = "/images.zip";
var filePath = path.resolve() + fileName;
var fileKey = fileName;
var buffer = fs.readFileSync(filePath);
// S3 Upload options
var bucket = options.arvanStorageBucketName;

// Upload
var startTime = new Date();
var partNum = 0;
var partSize = 1024 * 1024 * 20; // Minimum 5MB per chunk (except the last part) http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadComplete.html
var numPartsLeft = Math.ceil(buffer.length / partSize);
var maxUploadTries = 3;
var multiPartParams = {
    Bucket: bucket,
    Key: fileKey,
    ACL: 'public-read', // 'private' | 'public-read'
};
var multipartMap = {
    Parts: [],
};

async function completeMultipartUpload(s3, doneParams) {
    console.log(doneParams);
    const completeMultipartUploadResponse = await s3.send(
        new CompleteMultipartUploadCommand(doneParams)
    );

    var delta = (new Date() - startTime) / 1000;
    console.log("Completed upload in", delta, "seconds");
    console.log("Final upload data:", completeMultipartUploadResponse);
}

async function uploadPart(s3, multipart, partParams, tryNum) {
    var tryNum = tryNum || 1;

    const uploadPartResponse = await s3.send(new UploadPartCommand(partParams));

    console.log(partParams);

    multipartMap.Parts[partParams.PartNumber - 1] = {
        ETag: uploadPartResponse.ETag,
        PartNumber: Number(partParams.PartNumber),
    };
    console.log("Completed part", partParams.PartNumber);
    console.log("mData", uploadPartResponse);
    if (--numPartsLeft > 0) return; // complete only when all parts uploaded

    var doneParams = {
        Bucket: bucket,
        Key: fileKey,
        MultipartUpload: multipartMap,
        UploadId: multipart.UploadId,
    };

    console.log("Completing upload...");
    completeMultipartUpload(s3, doneParams);
}

// Multipart
console.log("Creating multipart upload for:", fileKey);
let createMultipartUploadResponse = {};

s3.send(new CreateMultipartUploadCommand(multiPartParams)).then((value) => {
    const createMultipartUploadResponse = value;

    for (var rangeStart = 0; rangeStart < buffer.length; rangeStart += partSize) {
        partNum++;
        var end = Math.min(rangeStart + partSize, buffer.length),
            partParams = {
                Body: buffer.slice(rangeStart, end),
                Bucket: bucket,
                Key: fileKey,
                PartNumber: String(partNum),
                UploadId: createMultipartUploadResponse.UploadId,
            };

        // Send a single part
        console.log(
            "Uploading part: #",
            partParams.PartNumber,
            ", Range start:",
            rangeStart
        );
        uploadPart(s3, createMultipartUploadResponse, partParams);
    }
});