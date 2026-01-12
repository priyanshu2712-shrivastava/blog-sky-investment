import { Redis } from '@upstash/redis'
export const redis = new Redis({
  url: 'https://valid-dodo-24896.upstash.io',
  token: 'AWFAAAIncDFlZDY2ZjEyNGE4Zjc0ZTAyOThlMjkzZjY4NjJlMDZlZXAxMjQ4OTY',
})

export async function testRedis() {
  try {
    await redis.set("test_key", "hello", { ex: 60 });
    const value = await redis.get("test_key");
    console.log("Redis connection successful, value:", value);
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
}

