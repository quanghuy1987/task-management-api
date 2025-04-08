import { ConfigModule } from '@nestjs/config';
import * as CryptoJS from 'crypto-js';

ConfigModule.forRoot({
  isGlobal: true,
});

const KEY = process.env.ENCRYPTION_KEY!;

export const encrypt = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), KEY).toString();
};

export const decrypt = (data: string): any => {
  return JSON.parse(
    CryptoJS.AES.decrypt(data, KEY).toString(CryptoJS.enc.Utf8),
  );
};
