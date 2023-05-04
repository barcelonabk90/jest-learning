import {
  DynamoDBClient,
  QueryCommand,
  QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { ddbClient } from '../configs/dynamodb.access';

export class UserRepository {
  private ddbClient: DynamoDBClient;
  constructor(ddbClient: DynamoDBClient) {
    this.ddbClient = ddbClient;
  }

  async getIdByAttribute(attrKey: string, attrValue: string): Promise<unknown> {
    const inputParams: QueryCommandInput = {
      KeyConditionExpression: 'attrKey = :attrKey and attrValue = :attrValue',
      ExpressionAttributeValues: {
        ':attrKey': { S: attrKey },
        ':attrValue': { S: attrValue },
      },
      IndexName: 'user-gsi',
      TableName: 'user',
    };

    try {
      const data = await ddbClient.send(new QueryCommand(inputParams));
      console.log(data);
      if (data && data.Items && data.Items.length) {
        return data.Items[0].id.S;
      }

      return undefined;
    } catch (err) {
      console.log(err);
      throw new Error(`A fatal error has occured`);
    }
  }

  async getAllById(id: string): Promise<any[]> {
    const inputParams: QueryCommandInput = {
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': { S: id },
      },
      TableName: 'user',
    };

    try {
      const data = await ddbClient.send(new QueryCommand(inputParams));
      return data.Items || [];
    } catch (err) {
      console.log(err);
      throw new Error(`A fatal error has occured`);
    }
  }
}
