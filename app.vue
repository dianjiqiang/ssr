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
