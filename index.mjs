// import fetch from "node-fetch";

import dotenv from "dotenv";
import AWS from "aws-sdk";
const s3 = new AWS.S3();

dotenv.config();

export const handler = async (event, context) => {
  const bucketName = process.env.accessFileSystem_bucketName;

  try {
    const s3Params = {
      Bucket: bucketName,
    };
    const data = await s3.listObjectsV2(s3Params).promise();
    const files = data.Contents;
    const fileKeys = files.map(
      (file) => process.env.accessFileSystem_URL + file.Key,
    );
    return {
      statusCode: 200,
      body: { fileKeys },
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {},
      body: error.message,
    };
  }
};
