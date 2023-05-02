import {
  SSMClient,
  GetParameterCommand,
  GetParameterCommandOutput,
} from '@aws-sdk/client-ssm';

// Khai báo biến cache dưới dạng Map để lưu trữ các giá trị parameter đã lấy từ SSM Parameter Store
export const ssmCache: Map<string, string> = new Map();

export async function ssmGetParameter(
  ssmPath: string,
  decryption: boolean,
): Promise<string> {
  // Kiểm tra xem giá trị của ssmPath có tồn tại trong cache hay không
  if (ssmCache.has(ssmPath)) {
    return ssmCache.get(ssmPath) as string;
  }

  // Nếu giá trị của ssmPath không tồn tại trong cache, sử dụng SSMClient để lấy giá trị parameter từ SSM Parameter Store
  const client = new SSMClient({ region: 'ap-northeast-1' });
  const command = new GetParameterCommand({
    Name: ssmPath,
    WithDecryption: decryption,
  });
  const response: GetParameterCommandOutput = await client.send(command);
  // Nếu giá trị parameter đã lấy được từ SSM Parameter Store, set vào cache để sử dụng lại trong tương lai
  if (response && response.Parameter?.Value) {
    const value = response.Parameter?.Value;
    ssmCache.set(ssmPath, value);
    return value;
  }

  // Nếu không tìm thấy giá trị parameter, throw một lỗi
  throw new Error(`Parameter ${ssmPath} not found`);
}
