import { queryMonthlyLuckyDays } from '..';
import { describe, expect, it } from 'vitest';

describe('monthly-lucky-days', () => {
  it('queryMonthlyLuckyDays', async () => {
    const monthlyLuckyDays = await queryMonthlyLuckyDays({ eventType: '嫁娶' });
    expect(monthlyLuckyDays).toBeDefined();
    expect(monthlyLuckyDays).toBeInstanceOf(Array);
  });
});
