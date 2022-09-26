"use strict";

var _require = require('@aws-sdk/client-s3'),
    S3Client = _require.S3Client,
    HeadBucketCommand = _require.HeadBucketCommand,
    CreateBucketCommand = _require.CreateBucketCommand,
    DeleteBucketCommand = _require.DeleteBucketCommand,
    PutObjectCommand = _require.PutObjectCommand,
    ListObjectsCommand = _require.ListObjectsCommand,
    GetBucketLifecycleConfigurationCommand = _require.GetBucketLifecycleConfigurationCommand;

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
});

var headBucket = function headBucket() {
  var data;
  return regeneratorRuntime.async(function headBucket$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(s3.send(new HeadBucketCommand({
            Bucket: options.arvanStorageBucketName
          })));

        case 3:
          data = _context.sent;
          console.log(data);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log('Error', _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

headBucket();
var file = path.resolve() + '/pant.mp4';
var uploadParams = {
  Bucket: options.arvanStorageBucketName,
  // bucket name
  Key: file,
  // the name of the selected file
  ACL: 'public-read',
  // 'private' | 'public-read'
  Body: 'BODY'
};

var upload = function upload() {
  var fileStream, data;
  return regeneratorRuntime.async(function upload$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          // Configure the file stream and obtain the upload parameters
          fileStream = fs.createReadStream(file);
          fileStream.on('error', function (err) {
            console.log('File Error', err);
          });
          uploadParams.Key = path.basename(file); // call S3 to upload file to specified bucket

          uploadParams.Body = fileStream;
          _context2.prev = 4;

          uploadParams.Body.addListener = function () {
            console.log(e);
          };

          _context2.next = 8;
          return regeneratorRuntime.awrap(s3.send(new PutObjectCommand(uploadParams)));

        case 8:
          data = _context2.sent;
          console.log('Success', data);
          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](4);
          console.log('Error', _context2.t0);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 12]]);
};

upload(); // const listOfFilesInsideBucket = async() => {
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