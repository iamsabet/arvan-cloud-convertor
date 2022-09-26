"use strict";

var _require = require("@aws-sdk/client-s3"),
    S3Client = _require.S3Client,
    CompleteMultipartUploadCommand = _require.CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand = _require.CreateMultipartUploadCommand,
    UploadPartCommand = _require.UploadPartCommand;

var options = require('./options');

var fs = require('fs');

var path = require('path');

console.log("path :" + path.resolve());
var s3 = new S3Client({
  region: 'default',
  endpoint: options.arvanS3EndPoint,
  credentials: {
    accessKeyId: options.arvanAccessKeyId,
    secretAccessKey: options.arvanSecretAccessKey
  }
}); // File

var fileName = "/images.zip";
var filePath = path.resolve() + fileName;
var fileKey = fileName;
var buffer = fs.readFileSync(filePath); // S3 Upload options

var bucket = options.arvanStorageBucketName; // Upload

var startTime = new Date();
var partNum = 0;
var partSize = 1024 * 1024 * 20; // Minimum 5MB per chunk (except the last part) http://docs.aws.amazon.com/AmazonS3/latest/API/mpUploadComplete.html

var numPartsLeft = Math.ceil(buffer.length / partSize);
var maxUploadTries = 3;
var multiPartParams = {
  Bucket: bucket,
  Key: fileKey,
  ACL: 'public-read' // 'private' | 'public-read'

};
var multipartMap = {
  Parts: []
};

function completeMultipartUpload(s3, doneParams) {
  var completeMultipartUploadResponse, delta;
  return regeneratorRuntime.async(function completeMultipartUpload$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(doneParams);
          _context.next = 3;
          return regeneratorRuntime.awrap(s3.send(new CompleteMultipartUploadCommand(doneParams)));

        case 3:
          completeMultipartUploadResponse = _context.sent;
          delta = (new Date() - startTime) / 1000;
          console.log("Completed upload in", delta, "seconds");
          console.log("Final upload data:", completeMultipartUploadResponse);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

function uploadPart(s3, multipart, partParams, tryNum) {
  var uploadPartResponse, doneParams;
  return regeneratorRuntime.async(function uploadPart$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          tryNum = tryNum || 1;
          _context2.next = 3;
          return regeneratorRuntime.awrap(s3.send(new UploadPartCommand(partParams)));

        case 3:
          uploadPartResponse = _context2.sent;
          console.log(partParams);
          multipartMap.Parts[partParams.PartNumber - 1] = {
            ETag: uploadPartResponse.ETag,
            PartNumber: Number(partParams.PartNumber)
          };
          console.log("Completed part", partParams.PartNumber);
          console.log("mData", uploadPartResponse);

          if (!(--numPartsLeft > 0)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return");

        case 10:
          // complete only when all parts uploaded
          doneParams = {
            Bucket: bucket,
            Key: fileKey,
            MultipartUpload: multipartMap,
            UploadId: multipart.UploadId
          };
          console.log("Completing upload...");
          completeMultipartUpload(s3, doneParams);

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  });
} // Multipart


console.log("Creating multipart upload for:", fileKey);
var createMultipartUploadResponse = {};
s3.send(new CreateMultipartUploadCommand(multiPartParams)).then(function (value) {
  var createMultipartUploadResponse = value;

  for (var rangeStart = 0; rangeStart < buffer.length; rangeStart += partSize) {
    partNum++;
    var end = Math.min(rangeStart + partSize, buffer.length),
        partParams = {
      Body: buffer.slice(rangeStart, end),
      Bucket: bucket,
      Key: fileKey,
      PartNumber: String(partNum),
      UploadId: createMultipartUploadResponse.UploadId
    }; // Send a single part

    console.log("Uploading part: #", partParams.PartNumber, ", Range start:", rangeStart);
    uploadPart(s3, createMultipartUploadResponse, partParams);
  }
});