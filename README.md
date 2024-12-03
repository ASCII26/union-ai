
# Union AI

Union AI是一个可以一键接入多个不同AI模型的SDK，避免开发者把大量时间消耗在各种AI接口的对接上，把精力留给你的产品开发。


## 特性

- 多个主流AI提供商
- 支持web/node两种调用模式
- 简洁的API


## 安装

使用 npm或pnpm 安装 unionai

```bash
  npm install @unionai/core
```
    
## 使用方法/示例

1. 引入UnionAI，传入你想调用的AI服务商的openapi key，并创建实例。

```javascript
import { UnionAI } from "@unionai/core";

const unai = new UnionAI({
  openai: {
    apiKey: 'your openai api key',
  },
  claude: {
    apiKey: 'your claude api key',
  },
});
```

2. 发送消息
```javascript
unai.request(
  {
    provider: '要调用的服务商名',
    model: '要调用的模型',
    messages: [{ role: "user", content: "who are you?" }],
  },
  {
    onMessage: (chunk: string) => console.log('chunk message:', chunk),
    onError: (error) => console.error("error:", error),
    onFinish: ({ usage }) => console.log('usage:', usage),
  }
);
```



## Demo
1. Clone本项目到你电脑上，安装项目依赖
```
git clone git@github.com:ASCII26/union-ai.git
npm i // 或 pnpm i
```
2. 打开 `union-ai`项目，进入examples文件夹
```
cd union-ai/apps/examples
```
3. 运行 `npm run dev`




## 作者

- [@ASCII26](https://github.com/ASCII26) 沐洒，公众号同名

