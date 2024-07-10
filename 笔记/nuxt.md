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
  // 在这里定义的运行时配置 不会导入到 对应的 process.env 中
  // 可以通过.env文件中的环境变量来覆盖, 优先级 .env > runtimeConfig
  runtimeConfig: {
    appKey: 'ABC', // server
    public: {
      baseUrl: 'http://codercba.com' // server and client -> client_bundle.js
    }
  },
  // appConfig 应用配置, 定义在构建时确定的公共变量, 如: theme
  // 配置会和 app.config.ts 的配置合并  优先级(app.config.ts > appConfig)
  appConfig: {
    title: 'Hello Next3 HYKJ',
    theme: {
      primary: 'blue'
    }
  },
  // app 配置 这里的配置会被注入到我们所有的页面中(SEO)
  app: {
    head: {
      title: 'HYKJ',
      charset: 'UTF-8',
      viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no",
      bodyAttrs: {
        class: 'liujun'
      },
      meta: [
        {
          name: 'keywords',
          content: '关键词'
        },
        {
          name: 'description',
          content: "页面描述"
        }
      ],
      link: [
        {
          rel: "shortcut icon",
          href: "favicon.icon",
          type: "image/x-icon"
        }
      ],
      style: [
        {
          children: `body{ color: red }`
        }
      ],
      script: [
        {
          src: 'http://xxx.js',
          body: true,
        }
      ]
    },
  },
  // ssr 配置 指定应用渲染模式
  ssr: true, // 默认是 true, 如果我们现在想要开发对应的spa页面 我们只需要设置为 false 即可
})
```

`.env`

.env的变量会覆盖上面添加的全局变量 是在运行的时候才会加载这些变量  优先级比较高

.env的变量会进入 process.env 中 符合规则的会覆盖 runtimeConfig 中

.env一般用于某些终端启动时, 动态指定配置, 同时支持 develop 和 production

```env
NUXT_APP_KEY = 'DDDD'  变量规则对应 appKey  必须拆开对应的驼峰
```

`app.config.ts`  可以在项目根目录中创建

默认会和对应的appConfig合并 app.config.ts 优先级比对应的appConfig更高

```ts
export default defineAppConfig({
  title: '张三',
  theme: {
    primary: 'green'
  }
})
```



### nuxt.config获取

#### runtimeConfig

```ts
const runtimeConfig = useRuntimeConfig() // 这个会区分对应的 server 端 和 client 端
console.log(runtimeConfig.appKey)
```

#### appConfig

```ts
let appConfig = useAppConfig() // 这个不会区分对应的 server 端 和 client端
console.log(appConfig.title)

// 还可以在里面修改
onMounted(() => {
  // 这里不需要担心获取不到对应的document对象 因为我们的 vue 的钩子只会在 client 端执行
  document.title = appConfig.title
})
```

#### useHead

```ts
// 在这里修改 是对于当前页面的修改 这里的优先级比在 nuxt.config.ts 中的高
useHead({
  title: '张三',
  ...
})
```

我们也可以在vue中的template代码中如此

```vue
<template>
	<div>
    <!-- 第一个为大写的 Head 中存放对应的 Head 中的元素为 Nuxt 的内置组件 我们在这里编写的 Head 中的元素会被挂载到实际的页面上 -->
    <Head>
      <Meta name="key" content="key1 key2 key3" />
      <Style></Style>
      <Link />
  	</Head>
  </div>
</template>
```

优先级为:  内置组件 > JS代码 > Nuxt.config.ts

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

## 辅助函数

