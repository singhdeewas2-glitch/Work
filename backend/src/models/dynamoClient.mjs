import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import config from "../../config.mjs";

const client = new DynamoDBClient({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKey,
    secretAccessKey: config.secretAccessKey,
  },
});

export const dynamo = DynamoDBDocumentClient.from(client);
