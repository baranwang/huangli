import dayjs from 'dayjs';
import { getUrlDocument } from './helper';

import type { LuckType } from './types';

export type WuxingElement = 'metal' | 'water' | 'wood' | 'fire' | 'earth';

export interface HourlyDetail {
  /**
   * 时辰
   */
  time: string;
  /**
   * 吉凶
   */
  luckType: LuckType;
  /**
   * 宜忌
   */
  luck: {
    favorable: string[];
    unfavorable: string[];
  };
  /**
   * 五行占比
   */
  wuxing: Record<WuxingElement, number>;
  /**
   * 信息
   */
  extraInfo: Record<string, string>;
}

const WUXING_ELEMENT_MAP: Record<string, WuxingElement> = {
  金: 'metal',
  水: 'water',
  木: 'wood',
  火: 'fire',
  土: 'earth',
};

export async function queryDailyDetail(date: string | Date = new Date()) {
  const day = dayjs(date);
  if (!day.isValid()) {
    throw new Error('日期格式有误');
  }

  const document = await getUrlDocument(`/${day.format('YYYY/MM/DD')}.html`);

  const extractLuckData = (selector: string): string[] =>
    Array.from(document.querySelectorAll(selector))
      .map((a) => a.textContent?.trim() ?? '')
      .filter(Boolean);

  const favorable = extractLuckData('.box3 > div:first-child .box_a a');
  const unfavorable = extractLuckData('.box3 > div:last-child .box_a a');

  const hourlyDetails: HourlyDetail[] = Array.from(document.querySelectorAll('#ind5_cen .con')).map((item) => {
    const result = {} as HourlyDetail;
    const info = Object.fromEntries(
      Array.from(item.querySelectorAll('.tli span')).map((span) => span.textContent?.split('：') as [string, string]),
    );
    result.extraInfo = info;
    result.time = info['时辰'].slice(1);
    result.luckType = info['吉凶'] === '吉' ? 'favorable' : 'unfavorable';

    item.querySelectorAll('.sli p').forEach((p, index) => {
      result.luck ??= { favorable: [], unfavorable: [] };
      result.luck[index === 0 ? 'favorable' : 'unfavorable'] = p.textContent?.split(' ') ?? [];
    });

    item.querySelectorAll('ul li').forEach((li) => {
      const title = li.querySelector('font')?.textContent;
      const value = li.querySelector('span')?.textContent;
      if (title && value) {
        result.wuxing ??= {} as Record<WuxingElement, number>;
        result.wuxing[WUXING_ELEMENT_MAP[title]] = Number(value);
      }
    });
    return result;
  });

  return { favorable, unfavorable, hourlyDetails };
}
