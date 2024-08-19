# huangli

黄历信息查询工具

## 安装

```shell
pnpm add huangli
```

## 使用

### 查询某月的黄历信息

```javascript
import { queryMonthlyLuckyDays } from 'huangli';

// 查询 2024 年 8 月宜嫁娶的黄历信息
await queryMonthlyLuckyDays({
  eventType: '嫁娶',
  month: '2024-08',
  luckType: 'favorable',
});
```

### 查询某日的黄历信息

```javascript
import { queryDailyDetail } from 'huangli';

// 查询 2024 年 8 月 20 日的黄历信息
await queryDailyDetail('2024-08-20');
```

### 查询黄历名称与 ID 的对应关系

```javascript
import { queryEventTypes } from 'huangli';

await queryEventTypes();
```

## 说明

- 项目使用 [老黄历](https://www.huangli.com/) 网页的数据
- 项目仅供学习交流使用，请勿用于商业用途
