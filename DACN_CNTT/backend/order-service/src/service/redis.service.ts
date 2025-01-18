
import { Inject, Injectable } from "@nestjs/common";
import { Redis } from "ioredis";

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) { }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: any, ttl: number): Promise<void> {
    await this.redisClient.set(key, value, 'EX', ttl);
  }

  async del(key: string): Promise<void> {
    try {
      const result = await this.redisClient.del(key);
      if (result === 0) {
        console.warn(`Key "${key}" không tồn tại trong Redis.`);
      }
    } catch (err) {
      console.error(`Lỗi khi xóa key "${key}":`, err);
      throw err;
    }
  }

  // ioredis example
  async scanKeys(prefix: string): Promise<string[]> {
    let cursor = '0'; // Cursor ban đầu
    let keys: string[] = [];

    do {
      const [newCursor, result] = await this.redisClient.scan(
        cursor,
        'MATCH',
        `${prefix}*`
      );
      cursor = newCursor; // Cập nhật cursor

      // Lọc bỏ keys có ký tự không mong muốn
      const filteredKeys = result.filter(key => key.startsWith(prefix));
      keys = keys.concat(filteredKeys); // Gộp keys vào danh sách
    } while (cursor !== '0'); // Tiếp tục quét cho đến khi không còn keys mới

    return keys;
  }



  async getValuesByKeys(keys: string[]): Promise<string[]> {
    if (keys.length === 0) {
      return [];
    }
    // Lấy giá trị của tất cả các keys
    const values = await this.redisClient.mget(keys);
    return values
      .filter(value => value !== null)
      .map(value => {
        return value;
      });
  }


  async addToBlacklist(token: string, ttlInSeconds: number): Promise<void> {
    try {
      await this.redisClient.set(`blacklist:${token}`, 'blacklisted', 'EX', ttlInSeconds);
    } catch (error) {
      console.error('Error adding token to blacklist', error);
    }
  }

  // Kiểm tra token có trong blacklist hay không
  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const result = await this.redisClient.get(`blacklist:"${token}"`);
      if (result !== 'blacklisted' && result !== null) {
        return false
      }
      return true;
    } catch (error) {
      console.error('Error checking token in blacklist', error);
      return false;
    }
  }
}