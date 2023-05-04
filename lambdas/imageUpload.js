const multer = require('multer')
const multers3 = require('multer-s3')
const AWS = require('aws-sdk')

const s3 = new AWS.S3();

export const upload = multer({
    storage: multers3({
        s3: s3,
        bucket: 's3://evans-db-server/images/',
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
