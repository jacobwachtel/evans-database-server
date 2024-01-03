require('dotenv').config();
const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const router = express.Router();
const DbConnection = require('./db/connect')
const ObjectId = require('mongodb').ObjectId;
const Tool = require('./models/Schema');
// const s3Connection = require('./aws/connection')
const multer = require('multer')
const multers3 = require('multer-s3')
const MongoDB_URI = process.env.MONGO_URI
const port = process.env.PORT || 8000
const cors = require('cors');
const bodyParser = require('body-parser');
// const s3AndDynamoUpload = require('./lambdas/lambdas')
// const upload = require('./lambdas/imageUpload');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: bucketRegion
})


app.use(cors());

const generatedImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// Creates a New Tool on DB
app.post('/api/v1/tools/', upload.single('image'), async (req, res) => {

    // const buffer = await sharp(req.file.buffer).resize({height: 1920, width: 1080, fit: "contain"}).toBuffer

    const params = {
        Bucket: bucketName,
        Key: generatedImageName(),
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    }

    const command = new PutObjectCommand(params)
    await s3.send(command, (err, data) => {
        console.log(err, data);
    })

    const updatedFormData = {
        ...req.body,
        image: params.Key
    }
      
    const tool = Tool.create(updatedFormData)
    res.status(201).json({ tool })
    // res.send('tool hit the server...')
})


// Gets all Tools from DB
app.get('/api/v1/tools/', async (req, res) => {

    try {
        const allTools = await Tool.find({})

        if (!allTools || allTools.length === 0) {
            return res.status(404).json({ error: 'No tools found' });
        }

        for (const tool of allTools) {
            if (tool.image) {        
                const getObjectParams = {
                    Bucket: bucketName,
                    Key: tool.image,
                };
            
                const command = new GetObjectCommand(getObjectParams);
                const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
            
                // Update the imageUrl property in the 'tool' object
                tool.image = url;
            
                console.log(tool);
            } else {
                console.log("No image found for tool:", tool);
                // HANDLING NO IMAGE USE-CASE!!!!
                // I plan to have a generic/default image....
                // tool.image = 'defaultImageUrl';
            }
        }

        res.status(200).send(allTools);

    } catch (errors) {
        console.error('Error fetching tools:', error)
        res.status(500).json({ error: "Internal Server Error" })
    }
    
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
