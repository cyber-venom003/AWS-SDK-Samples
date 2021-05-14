import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

//Method-1

const myCredentials = {
    'accessKeyId': `${process.env.AWS_ACCESS_KEY}`,
    'secretAccessKey': `${process.env.AWS_SECRET_ACCESS}`};

const cloud = new AWS.Config({
    credentials: myCredentials,
    region: process.env.AWS_REIGON,
});

//Method-2

AWS.config.update({
    accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS}`,
    region: `${process.env.DB_REIGON}`,
    dynamodb: {
        endpoint: 'http://localhost:8000',
        region: 'localhost',
    }
});
