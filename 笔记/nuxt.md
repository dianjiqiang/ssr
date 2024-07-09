# nuxt

## 初始化

包名: npm install nuxi -g

构建: nuxi init 项目名

安装依赖

```shell
yarn
npm install
pnpm install --shamefully-hoist (创建一个扁平的 node_modules 目录结构 类似 npm 和 yarn) 或者是创建一个 .npmrc 文件
在最后添加上
shamefully-hoist=true
```

`package.json`

```json
"scripts": {
  "build": "nuxt build", // 打包正式版本
  "dev": "nuxt dev",
  "generate": "nuxt generate", // 打包正式版本项目, 会提前渲染每个路由
  "preview": "nuxt preview", // 打包项目之后的本地预览效果
  "postinstall": "nuxt prepare" // npm生命周期钩子, 当执行完npm install 之后会自动执行nuxt prepare    nuxt prepare -> 一般用来生成.next 和 ts 类型等等
},
```

![image-20240709173819549](https://picgoload-1310759961.cos.ap-nanjing.myqcloud.com/ssrimage-20240709173819549.png)

### 全局变量(nuxt.config)

`nuxt.config.ts`

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    appKey: 'ABC', // server
    public: {
      baseUrl: 'http://codercba.com' // server and client -> client_bundle.js
    }
  }
})
```

`.env`

.env的变量会覆盖上面添加的全局变量 是在运行的时候才会加载这些变量  优先级比较高

```env
NUXT_APP_KEY = 'DDDD'  变量规则对应 appKey  必须拆开对应的驼峰
```

### 判断当前环境

```vue
<template>
  <div>
    <h2>Hello Nuxt3</h2>
  </div>
</template>

<script setup>
// 判断代码执行环境
if (import.meta.server) {
  console.log('运行在服务端');
}
if (import.meta.client) {
  console.log('运行在客户端');
}
// 或者
if (typeof window === 'object') {
  // 运行在client端
}

// 1. 获取运行时配置
const runtimeConfig = useRuntimeConfig()
if (import.meta.server) {
  console.log(runtimeConfig.appKey);
}else{
  console.log(runtimeConfig);
}
</script>
```

