import { Injectable } from '@nestjs/common';
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

@Injectable()
export class CacheCompressionHelper {
  static async compress(value: any): Promise<string | any> {
    if (value === undefined || value === null) return value;
    
    try {
      const stringified = JSON.stringify(value);
      const buffer = await gzip(Buffer.from(stringified));
      return buffer.toString('base64');
    } catch (e) {
      return value;
    }
  }

  static async decompress(value: any): Promise<any> {
    if (typeof value !== 'string') return value;

    try {
      const buffer = Buffer.from(value, 'base64');
      const decompressed = await gunzip(buffer);
      return JSON.parse(decompressed.toString());
    } catch (e) {
      // Se não for um valor comprimido, retorna como está (tentando parse JSON se possível)
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
  }
}
