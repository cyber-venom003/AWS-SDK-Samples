import dynamoose from 'dynamoose';
import AWS from 'aws-sdk';

//Method-1 using dynamoose

//Configuring DynamoDB instance
const DynamoDB = new dynamoose.aws.sdk.DynamoDB({
    "accessKeyId": `${process.env.AWS_ACCESS_KEY}`,
    "secretAccessKey": `${process.env.AWS_SECRET_ACCESS}`,
    "region": `localhost`,
    "endpoint": `${process.env.DB_ENDPOINT}`,
});

//Instantiating DynamoDB using dynamoose;
dynamoose.aws.ddb.set(DynamoDB);

//Defining model 
const User = dynamoose.model("User" , {"name": String , "email": String});
//Creating Object
const myUser = new User({
    "name": "Tejas Agrawal",
    "email": "tejas3601@gmail.com"
});
//Saving object in db
async function saveIndb() {
    try{
        await myUser.save();
        console.log(`${myUser} saved successfully!`);
    } catch(err){
        console.log(err);
    }
}

saveIndb();
//Deleting from db
async function deleteFromdb() {
    try{
        const key = {
            "email": "tejas3601@gmail.com"
        }
        const userToDelete = await User.get(key);
        //console.log(userToDelete);
        await userToDelete.delete();
        console.log('Document deleted successfully!!');
    } catch(err){
        console.log(err);
    }
}

deleteFromdb();

//Method-2 using AWS-SDK

//For using this, firstly you have to configure aws-sdk as given in aws-config.ts file
AWS.config.update({
    accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESS}`,
    region: `${process.env.DB_REIGON}`,
    dynamodb: {                             //Use this if you are using dynamodb local
        endpoint: 'http://localhost:8000',      
        region: 'localhost',
    }
});

const dynamoDoc = new AWS.DynamoDB.DocumentClient();

const dynamo = new AWS.DynamoDB();

const tableParams = {
    AttributeDefinitions: [
    {
        AttributeName: "name", 
        AttributeType: "S"
    }, 
    {
      AttributeName: "email", 
      AttributeType: "S"
    }
    ], 
    KeySchema: [
        {
        AttributeName: "name", 
        KeyType: "S"
        }, 
        {
        AttributeName: "email", 
        KeyType: "S"
        }
    ], 
    ProvisionedThroughput: {
     ReadCapacityUnits: 5, 
     WriteCapacityUnits: 5
    }, 
    TableName: "Users"
};
//Create Table
dynamo.createTable(tableParams , (err , data) => {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

//Creating an object in table
var params = {
    TableName: "Users",
    Item: {
        "id": 2,
        "name": "Tejas Agrawal",
        "email": "tejas3601@gmail.com",
    }
};

dynamoDoc.put(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});