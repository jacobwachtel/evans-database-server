require('dotenv').config();
const express = require('express');
const { TopologyClosedEvent } = require('mongodb');
const fs = require('fs');
const app = express();
const router = express.Router();
const DbConnection = require('./db/connect')
const ObjectId = require('mongodb').ObjectId;
const Tool = require('./models/Schema');
const s3Connection = require('./aws/connection')
const multer = require('multer')
const { Readable } = require('stream');
const MongoDB_URI = process.env.MONGO_URI
const port = process.env.PORT || 8000
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
// const upload = multer({ storage: "https://api.cloudinary.com/v1_1/evans-db/image/upload"})
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser');
let streamifier = require('streamifier');
// const uploadFromBuffer = require('./cloudinary/fileUploader');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  })

  cloudinary.config({
    cloud_name: "evans-db.mo.cloudinary.net",
    api_key: "239494999359417",
    api_secret: "gWCpUZXCx1sknd9Wz8G1nQQLvh8",
    secure: true
  });

  const bufferToStream = (buffer) => {
    const readable = new Readable({
        read() {
            this.push(buffer);
            this.push(null)
        }
    })
    return readable;
  }


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(express.static('public'))
// app.use(upload.none());
app.use(cors());
// app.use(fileUpload({
//     createParentPath: true,
// }))


// Creates a New Tool on DB
app.post('/api/v1/tools', upload.single('image'),(req, res) => {

    const formData = req.body

    // console.log(formData, req.file);
    res.send(req.body)
    
    const stream = cloudinary.uploader.upload_stream(
        { folder: 'Pictures' },
        (err, result) => {
            if(err) return console.error(err);
           
        }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
    // const uploadImage = async (rq.file)

    // function cloudinaryDone(error, result) {
    //     if (error) {
    //      console.log("Error in cloudinary.uploader.upload_stream\n", error);
    //      return;
    //     }

    // }
    // const tool = Tool.create(formData)
    // res.status(201).json({ tool })
})

// Gets all Tools from DB
app.get('/api/v1/tools', (req, res) => {

    Tool.find({}, (err, found) => {
        if (err) {
            console.log("ERROR!!!")
            return res.send("no data found");
        }
        if (found) {
            res.status(200).send(found);
        }
        
    })
})

// Get a single tool from DB

app.get('/api/v1/tools/:id', async(req, res) => {
    const {id: TaskID} = req.params;

    
    const tool = await Tool.findOne({ _id: ObjectId(TaskID)})
    
    if(!tool) {
        res.status(401).send("Tool does not exist!")
    }
    console.log("This worked!");
    res.status(200).send({tool})
})

// Update tool on DB

app.patch('/api/v1/tools/:id', async (req,res) => {

        const { id: TaskID } = req.params;
        console.log(req.body);

        const tool = await Tool.findOneAndUpdate({ _id: ObjectId(TaskID) }, req.body, {
            new: true,
            runValidators: true,
        })
        console.log("tool", tool);

        if(!tool) {
            res.status(401).send("no task was found")
        }
        res.status(200).send(tool);
})

// Delete tool from DB

app.delete('/api/v1/tools/:id', async (req, res) => {
    const { id: TaskID } = req.params;

    const tool = await Tool.findOneAndDelete({ _id: ObjectId(TaskID) });

    if(!tool) {
        res.status(401).send("no task was found")
    }
    res.status(200).send(tool);
})

const start = async () => {
    try {
        await DbConnection(MongoDB_URI)
        app.listen(port, console.log(`Server is listening on port ${port}`))
    }
    catch (err) {
        console.log(err);
    }
}

start();
