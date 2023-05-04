import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
// Create an Amazon DynamoDB service client object.
// const ddbClient = new DynamoDBClient({ region: 'ap-northeast-1' });
const ddbClient = new DynamoDBClient({ endpoint: 'http://localhost:8000' });
export { ddbClient };
