import { Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

@Injectable()
export class CompressedCacheInterceptor extends CacheInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const key = this.trackBy(context);
    if (!key) {
      return next.handle();
    }

    const cachedValue = await this.cacheManager.get(key);
    if (cachedValue) {
      // Se o valor estiver em Base64 e começar com a assinatura de Gzip, descompacta
      if (typeof cachedValue === 'string' && cachedValue.length > 20) {
        try {
          const buffer = Buffer.from(cachedValue, 'base64');
          const decompressed = await gunzip(buffer);
          return of(JSON.parse(decompressed.toString()));
        } catch (e) {
          // Se falhar a descompressão, assume que é dado puro (legado ou não comprimido)
          return of(cachedValue);
        }
      }
      return of(cachedValue);
    }

    return next.handle().pipe(
      tap(async (value) => {
        if (value) {
          try {
            const stringified = JSON.stringify(value);
            // Comprime apenas se o dado for razoavelmente grande (> 1KB)
            if (stringified.length > 1024) {
              const compressed = await gzip(Buffer.from(stringified));
              await this.cacheManager.set(key, compressed.toString('base64'));
            } else {
              await this.cacheManager.set(key, value);
            }
          } catch (e) {
            await this.cacheManager.set(key, value);
          }
        }
      }),
    );
  }
}
