const multer = require('multer')
const multers3 = require('multer-s3')
const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();
// const AWS = require('aws-sdk')

// const s3 = new AWS.S3();
const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

let s3 = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
});

const upload = multer({
    storage: multers3({
        s3: s3,
        bucket: bucketName,
        acl: 'public-read',
        contentType: multers3.AUTO_CONTENT_TYPE,
        metadata: function(req, file, cb) {
            cb(null, { fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname)
        }
    })
});

module.exports = upload;