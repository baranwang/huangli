import { queryDailyDetail } from '..';
import { describe, expect, it } from 'vitest';

describe('daily-detail', () => {
  it('queryDailyDetail', async () => {
    const dailyDetail = await queryDailyDetail();
    expect(dailyDetail).toBeDefined();
    expect(dailyDetail).toBeInstanceOf(Object);
    expect(dailyDetail.favorable).toBeDefined();
    expect(dailyDetail.favorable).toBeInstanceOf(Array);
    expect(dailyDetail.unfavorable).toBeDefined();
    expect(dailyDetail.unfavorable).toBeInstanceOf(Array);
    expect(dailyDetail.hourlyDetails).toBeDefined();
    expect(dailyDetail.hourlyDetails).toBeInstanceOf(Array);
    expect(dailyDetail.hourlyDetails.length).toBe(12);
  });
});
