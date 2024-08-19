import { queryEventTypes } from '..';
import { describe, expect, it } from 'vitest';

describe('event-types', () => {
  it('queryEventTypes', async () => {
    const eventTypes = await queryEventTypes();
    expect(eventTypes).toBeDefined();
    expect(eventTypes).toBeInstanceOf(Object);
    expect(Object.keys(eventTypes)).toContain('嫁娶')
  });
});
