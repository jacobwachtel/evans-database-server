

export const s3AndDynamoUpload = exports.handler = async (event) => {
    const file = event.file;
    const formData = event.formdata;

    const s3Params = {
        Bucket: '<my-bucket>',
        Key: file.key
    };

    const s3Url = "<AWS URL>"

    const dynamoDBParams = {
        TableName: "<'my-dynamo-table'>",
        Item: {
            name: formData.name,
            description: formData.description,
            owner: formdata.owner,
            image: s3Url
        }
    }

    try {
        const s3Response = await s3.getSignedUrlPromise('putObject', s3Params);
        const dynamoResponse = await DynamoDB.put(dynamoDBParams).promise();

        return {
            s3Response,
            dynamoResponse,
        };
    } catch (err) {
        console.log(err)
        throw err;
    }
}