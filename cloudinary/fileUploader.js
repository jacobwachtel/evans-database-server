let cloudinary = require("cloudinary").v2;
let streamifier = require('streamifier');
const fs = require('fs');

let uploadFromBuffer = (req) => {

   return new Promise((resolve, reject) => {

     let stream = cloudinary.v2.uploader.upload_stream(
      (error, result) => {

        if (result) {
          resolve(result);
        } else {
          reject(error);
         }
       }
     );

     streamifier.createReadStream(req.file.buffer).pipe(stream);
   });

};
async function async_func(req) {
    let result = await uploadFromBuffer(req);
    console.log(result)
}

let file_name = __dirname + '/my_picture.jpg';

async_func(file_name)

// module.exports = uploadFromBuffer;