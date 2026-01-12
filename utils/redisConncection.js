import { Redis } from '@upstash/redis'
export const redis = new Redis({
  url: 'https://humble-python-31902.upstash.io',
  token: 'AXyeAAIncDJiMjMwZWQ4Y2Y4MGQ0YzUyYmVjYzU4OGRjYjI4M2ZiY3AyMzE5MDI',
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

