import axios from 'axios';
import { JSDOM } from 'jsdom';

export const instance = axios.create({
  baseURL: 'https://m.huangli.com',
  headers: {
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
  },
});

const cache = new Map<string, Document>();

// 使用 async/await 语法
export async function getUrlDocument(url: string): Promise<Document> {
  if (cache.has(url)) {
    return cache.get(url)!;
  }
  try {
    const resp = await instance.get(url);
    if (resp.status !== 200) {
      throw new Error(`请求失败：${resp.status} ${resp.statusText}`);
    }
    const { document } = new JSDOM(resp.data).window;
    cache.set(url, document);
    return document;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`网络请求错误: ${error.message}`);
    } else {
      throw new Error(`解析错误: ${(error as Error).message}`);
    }
  }
}
