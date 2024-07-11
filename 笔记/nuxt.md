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
  // 当我们页面属于 spa 模式的时候, 我们这边可以给对应的路由模式
  router: {
    options: {
      hashMode: true, // hash 只在我们的spa模式中应用
    }
  },
  // 路径别名, 内置 无需修改
  alias: {
    "~": "/<srcDir>",
    "@": "/<srcDir>",
    "~~": "/<rootDir>",
    "@@": "/<rootDir>",
    "assets": "/<srcDir>/assets",
    "public": "/<srcDir>/public"
  },
  // modules: 配置Nuxt拓展的模块, 比如: @pinia/nuxt   @nuxt/image 等等
  // routeRules: 定义路由规则,可以更改路由的渲染模式或分配基于路由缓存策略(公测阶段)
  // builder: 可指定用 vite 还是 webpack 来构建应用 默认是 vite 如切换为 webpack 还需要安装额外的依赖
  css: [
    // 在这里引入的样式为全局样式
    "@/assets/css/reset.css"
  ],
  // 自动导入对应的css全局样式
  vite: {
    preprocessorOptions: {
      additionals: ['']
    }
  }
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



### nuxt.config API

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

#### runtimeConfig 和 app.config

runtimeConfig 和 app.config 都用于向应用程序公开变量, 但是需要注意的是 runtimeConfig 是`运行时`变量

app.config 定义公共变量, 比如在构建时确定公共的token, 网站配置.

![image-20240711111643613](https://picgoload-1310759961.cos.ap-nanjing.myqcloud.com/ssrimage-20240711111643613.png)

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

## 内置组件

### SEO组件

Html/Body/Head/Title/Meta/Style/Link/NoScript/Base 等等 第一个为大写开头的组件

### NuxtWelcome

欢迎页面组件, 该组件是@nuxt/ui 中的一部分

### NuxtLayout

是 nuxt 自带的页面布局组件

```vue
<template>
	<NuxtLayout :name="layout">
  	<NuxtPage />
  </NuxtLayout>
</template>

<script setup>
  const layout = 'custom'
</script>
```

### NuxtPage

* 需要显示位于目录中的顶级或嵌套页面 pages/
* 是对router-view的封装

### clientOnly

该组件中的默认插槽的内容 只在 `客户端`渲染

```html
<template>
	<div>
    <div>
      我是homePage
    </div>
    <!--这个clientOnly 在我们这个js还没有正确加载的时候会显示loading 有点像 react 的预加载组件-->
    <!--这里原先在加载的时候 默认的占位元素是 span 我们可以通过修改对应的 fallback-tag 来修改对应的默认展示元素-->
    <ClientOnly fallback-tag="h3" fallback="loading">
    	<div>
        我只会在客户端渲染
      </div>
    </ClientOnly>
    
    <!--当然除了上面的通过对应的属性进行渲染 还可以通过插槽进行渲染-->
    <ClientOnly>
    	<div>
        我只会在客户端渲染
      </div>
      <template #fallback>
      	<h2>
          服务端渲染的loading页面
        </h2>
      </template>
    </ClientOnly>
  </div>
</template>
```

### NuxtLink

nuxt自带的页面导航组件

是Vue Router`<RouterLink>` 组件和 HTML`<a>`标签的封装

## 导入

### 样式

#### 全局样式

1. 在assets中编写全局样式 比如 global.scss
2. 接着在nuxt.config中的css选项中配置
3. pnpm add sass -D

#### 局部样式和全局样式的应用

`子页面`

```scss
@import "@/assets/css/reset.scss" // 引入方式1
  
// as "name": 给这个模块起一个命名空间
@use "@/assets/css/reset.scss" as nuxt-text
  
// as * 表示可以省略这个命名空间
@use "@/assets/css/reset.scss" as *
  
  .assets{
    color: nuxt-test.$color
 }
```

#### 自动导入css

详情参见对应的 nuxt.config

### 资源

#### 图片

如果是放在我们的public下的资源文件,我可能可以直接通过 / 的方式去访问 我们的 / 就是我们public下的图片文件

```html
<img src="/user.png" alt="用户头像" />

在css中也是同理 可以这样访问到
```

如果是放在我们其他地方的图片 我们也可以通过 @/assets... 来访问

#### 字体图标

同理

### 静态路由

#### 单路由

> 方法1

1. 在对应的pages 文件夹中新建文件 对应的目录结构可以是  /pages/category.vue  对应nuxt会自动加载对应的路由   也可以是 /pages/category/index.vue
2. 我们对应的 index.vue 是默认路由 也就是对应的 localhost:3000/
3. 我们只需要创建对应的 vue 文件 nuxt会默认给我们注册页面 我们直接可以通过 history 的方式进行访问

> 方法2

npx nuxi add page find/index

#### 路由跳转

> 方法1

1. 在html中编写对应的 NuxtLink 元素   赋予对应的 to 属性

```html
<NuxtLink to="/category">
	<Button>
    路由1
  </Button>
</NuxtLink>
```

这个组件是内部组件,用来实现页面导航,是对RouterLink的拓展, 比如: 进入视口的链接启用预取资源等.

* 底层是一个 a 标签, 因此使用 a + href 属性也支持路由导航
* 但是用 a 标签导航会有触发浏览器默认刷新事件, 而 NuxtLink 不会, NuxtLink 还拓展了其他属性和功能

1. 应用`Hydration`后(已激活/可交互), `页面导航会通过前端路由来实现. 这可以防止整页刷新`. 当然, 手动输入URL后, 点击刷新浏览器也可以导航, 这会导致整个页面刷新.
2. to 属性  支持路由路径 路由对象 url
3. href = to
4. replace 默认为 false 是否替换当前路由
5. activeClass 激活链接的类名
6. target 和 a 标签的 target 一样 指定何种方式显示刷新页面
7. external 如果我们跳转的是对应的外部链接 需要给他加上对应的属性 然后就不会携带多余的参数

> 方法2

next3 除了可以通过 `<NuxtLink>` 内置组件方式来实现导航, 同时也支持 编程导航 : navigateTo

但是编程式导航不利于 SEO

1. navigateTo 函数在服务器端和客户端都可以使用, 也可以在插件/中间键中使用, 也可以直接调用执行页面导航
2. navigateTo(to, options) 函数  to和 NaviLink 的 to 同理 options 是导航中对应的参数

> 方法3

Nuxt3中的编程导航除了可以通过 `navigateTo` 来实现导航 同时也支持 useRouter 或者 optionsApi 中的 this.$route 和对应的 vue3中的 vue-router 一模一样 `路由守卫`等 都可以支持
