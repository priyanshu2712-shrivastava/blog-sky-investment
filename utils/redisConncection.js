import { Redis } from '@upstash/redis'
export const redis = new Redis({
  url: 'https://thankful-grubworm-68979.upstash.io',
  token: 'gQAAAAAAAQ1zAAIncDI2OGQxMjMyZDUxMjk0NDliODc5ZDI1Y2Y3NjcwNWVmN3AyNjg5Nzk',
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

