import path from 'node:path';
import { getUrlDocument } from './helper';

export async function queryEventTypes() {
  try {
    const document = await getUrlDocument('/hdjr/yi/');
    const list = document.querySelectorAll('.jiri1 .jiri_box .ind_fk a');

    return Array.from(list).reduce(
      (acc, item) => {
        const text = item.textContent;
        const [id] = path.basename(item.getAttribute('href') ?? '').split('_');
        if (text && id) {
          acc[text] = id;
        }
        return acc;
      },
      {} as Record<string, string>,
    );
  } catch (error) {
    throw new Error(`获取类型失败：${(error as Error).message}`);
  }
}
