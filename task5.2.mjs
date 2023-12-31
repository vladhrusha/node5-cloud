// import fetch from "node-fetch";

import dotenv from "dotenv";
import AWS from "aws-sdk";
const ses = new AWS.SES({ region: "eu-north-1" });

dotenv.config();

export const handler = async (event, context) => {
  try {
    const { question, email, name } = JSON.parse(event.body);
    await verifyEmailAddress(email);

    const userParams = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Text: {
            Data: `Hello ${name},\n\n ${question}`,
          },
        },
        Subject: {
          Data: "Service1234 Notification",
        },
      },
      Source: "hrushavladwork@gmail.com",
    };
    await ses.sendEmail(userParams).promise();

    const adminParams = {
      Destination: {
        ToAddresses: ["hrushavladyslavwork@gmail.com"],
      },
      Message: {
        Body: {
          Text: {
            Data: `User ${name}, asked this \n\n ${question}`,
          },
        },
        Subject: {
          Data: `Service1234 question from ${name}`,
        },
      },
      Source: "hrushavladwork@gmail.com",
    };
    await ses.sendEmail(adminParams).promise();
    return {
      statusCode: 200,
      body: "email sent",
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: err.message,
    };
  }
};
async function verifyEmailAddress(email) {
  const verifyParams = {
    EmailAddress: email,
  };

  await ses.verifyEmailAddress(verifyParams).promise();
}
