import { ssmGetParameter } from '../../src/configs/app.config';
import { SSMClient, GetParameterCommandOutput } from '@aws-sdk/client-ssm';

jest.mock('@aws-sdk/client-ssm');

describe('ssmGetParameter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('gets value from AWS', async () => {
    const ssmPath = '/test/path';
    const expectedValue = 'test-value';

    // Giả lập giá trị trả về từ SSMClient
    (SSMClient as jest.Mock).mockImplementationOnce(() => {
      return {
        send: jest.fn().mockResolvedValueOnce({
          Parameter: {
            Value: expectedValue,
          },
        } as GetParameterCommandOutput),
      };
    });

    // Gọi hàm ssmGetParameter
    const value = await ssmGetParameter(ssmPath, false);

    // Kiểm tra kết quả
    expect(value).toBe(expectedValue);
    expect(SSMClient).toHaveBeenCalledTimes(1);
    expect(SSMClient).toHaveBeenCalledWith({ region: 'ap-northeast-1' });
    // expect(
    //   (SSMClient as jest.Mock).mock.instances[0].send,
    // ).toHaveBeenCalledWith(
    //   new GetParameterCommand({ Name: ssmPath, WithDecryption: true }),
    // );
  });

  it('throws an error when unable to get value', async () => {
    const ssmPath = '/test/path/test02';

    // Giả lập giá trị trả về từ SSMClient
    (SSMClient as jest.Mock).mockImplementationOnce(() => {
      return {
        send: jest
          .fn()
          .mockRejectedValueOnce(new Error(`Parameter ${ssmPath} not found`)),
      };
    });

    try {
      const value = await ssmGetParameter(ssmPath, false);
    } catch (e: any) {
      expect(e.message).toBe(`Parameter ${ssmPath} not found`);
    }

    // Kiểm tra kết quả
    expect(SSMClient).toHaveBeenCalledTimes(1);
    expect(SSMClient).toHaveBeenCalledWith({ region: 'ap-northeast-1' });
  });

  it('gets value from cache', async () => {
    const ssmPath = '/test/path';
    const expectedValue = 'test-value';

    // Gọi hàm ssmGetParameter
    const value = await ssmGetParameter(ssmPath, false);

    // Kiểm tra kết quả
    expect(value).toBe(expectedValue);
    expect((SSMClient as jest.Mock).mock.calls.length).toBe(0); // Kiểm tra xem SSMClient có được gọi hay không
  });
});
