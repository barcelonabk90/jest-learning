import { UserRepository } from '../../src/repositories/UserRepository';
// import { ddbClient } from '../../src/configs/dynamodb.access';
import { QueryCommandOutput } from '@aws-sdk/client-dynamodb';

jest.mock('@aws-sdk/client-dynamodb');

describe('Test UserRepository.getByAttribute() ', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Test case 01 : Hit a record ', async () => {
    const key = 'email';
    const value = 'buiquangbk90@gmail.com';
    const testId = '100';

    // Giả lập giá trị trả về từ SSMClient
    const DynamoDBClient = jest.fn().mockImplementationOnce(() => {
      return {
        send: jest.fn().mockResolvedValueOnce({
          $metadata: {},
          Count: 1,
          Items: [
            {
              id: {
                S: testId,
              },
            },
          ],
          ScannedCount: 1,
        } as QueryCommandOutput),
      };
    });

    const userRepository = new UserRepository(new DynamoDBClient({}));

    const id = await userRepository.getIdByAttribute(key, value);
    expect(id).toBe(testId);
    expect(DynamoDBClient).toHaveBeenCalledTimes(1);
    // expect(DynamoDBClient).toHaveBeenCalledWith({
    //   endpoint: 'http://localhost:8000',
    // });

    console.log((DynamoDBClient as jest.Mock).mock.calls.length);
  });
});

// import { UserRepository } from '../../src/repositories/UserRepository';
// import { DynamoDBClient, QueryCommandOutput } from '@aws-sdk/client-dynamodb';

// jest.mock('@aws-sdk/client-dynamodb');

// describe('UserRepository', () => {
//   let userRepository: UserRepository;
//   let mockDdbClient: DynamoDBClient;

//   beforeEach(() => {
//     mockDdbClient = new DynamoDBClient({});
//     userRepository = new UserRepository(mockDdbClient);
//   });

//   describe('getIdByAttribute', () => {
//     it('should return the id if the item is found', async () => {
//       const mockQueryResult = {
//         Items: [
//           {
//             id: { S: '123' },
//           },
//         ],
//         $metadata: {},
//       };
//       jest.spyOn(mockDdbClient, 'send').mockResolvedValue(mockQueryResult);

//       const result = await userRepository.getIdByAttribute(
//         'email',
//         'test@example.com',
//       );

//       expect(mockDdbClient.send).toHaveBeenCalledWith(expect.anything());
//       expect(result).toEqual('123');
//     });

//     // it('should return undefined if the item is not found', async () => {
//     //   const mockQueryResult: QueryCommandOutput = {
//     //     Items: [],
//     //     $metadata: {},
//     //   };
//     //   mockDdbClient.send.mockReturnValue(mockQueryResult);

//     //   const result = await userRepository.getIdByAttribute(
//     //     'email',
//     //     'test@example.com',
//     //   );

//     //   expect(mockDdbClient.send).toHaveBeenCalledWith(expect.anything());
//     //   expect(result).toBeUndefined();
//     // });

//     // it('should throw an error if an error occurs', async () => {
//     //   const mockError = new Error('Something went wrong');
//     //   mockDdbClient.send.mockRejectedValue(mockError);

//     //   await expect(
//     //     userRepository.getIdByAttribute('email', 'test@example.com'),
//     //   ).rejects.toThrow('A fatal error has occured');
//     // });
//   });

//   // describe('getAllById', () => {
//   //   it('should return an empty array if no items are found', async () => {
//   //     const mockQueryResult: QueryCommandOutput = {
//   //       Items: [],
//   //       $metadata: {},
//   //     };
//   //     mockDdbClient.send.mockReturnValue(mockQueryResult);

//   //     const result = await userRepository.getAllById('123');

//   //     expect(mockDdbClient.send).toHaveBeenCalledWith(expect.anything());
//   //     expect(result).toEqual([]);
//   //   });

//   //   it('should return an array of items if they are found', async () => {
//   //     const mockQueryResult: QueryCommandOutput = {
//   //       Items: [
//   //         {
//   //           id: { S: '123' },
//   //           email: { S: 'test@example.com' },
//   //         },
//   //         {
//   //           id: { S: '123' },
//   //           email: { S: 'another@example.com' },
//   //         },
//   //       ],
//   //       $metadata: {},
//   //     };
//   //     mockDdbClient.send.mockReturnValue(mockQueryResult);

//   //     const result = await userRepository.getAllById('123');

//   //     expect(mockDdbClient.send).toHaveBeenCalledWith(expect.anything());
//   //     expect(result).toEqual([
//   //       { id: { S: '123' }, email: { S: 'test@example.com' } },
//   //       { id: { S: '123' }, email: { S: 'another@example.com' } },
//   //     ]);
//   //   });

//   //   it('should throw an error if an error occurs', async () => {
//   //     const mockError = new Error('Something went wrong');
//   //     mockDdbClient.send.mockRejectedValue(mockError);

//   //     await expect(userRepository.getAllById('123')).rejects.toThrow(
//   //       'A fatal error has occured',
//   //     );
//   //   });
//   // });
// });
