# vite条件注释插件
如果你有一些代码只想在开发模式使用，在生产环境想去掉你可以使用此插件

### 下载地址

npm i vite-plugin-isdev
### 插件用法
该插件支持 vue ts tsx 文件
该插件接受两个参数
```ts
export interface Options{
    prefix?:string, //条件注释前缀 默认dev
    debugger?:boolean, //是否开启调试模式
}
```
vite.config.ts
```ts
import comments from 'vite-plugin-isdev'
plugins: [comments({
    prefix:"xm", //自定义前缀 默认dev
    debugger:false//是否开启调试模式
})],
```
条件注释语法
template 中使用  `<!--#if-dev-->  <!--#end-dev-->`

script ts tsx css 使用 `//#if-dev //#end-dev`

### 案例如下
```vue
<template>
    <div>
        <div>扰乱</div>
        <!--#if-dev-->
        <div>dev1</div>
        <div>dev2</div>
        <!--#end-dev-->
    </div>
    <h2>
        <!--#if-dev-->
        <div>dev</div>
        <!--#end-dev-->
    </h2>
   <xxxx></xxxx>
</template>

<script lang="ts" setup>
import random from "random-words"
import xxxx from './App'
console.log(123)
const a = random(5)
//#if-dev
var b = "__dev__"
//#end-dev
console.log('动次打次')
//#if-dev
console.log(a)
//#end-dev
</script>

<style lang="less">
//#if-dev
body{
   background: red;
}
//#end-dev
</style>

<style scoped>
div{
    color:white
}
</style>
```
编译之后 被条件注释包裹的代码将会在生产环境删除
```vue
<template>
    <div>
        <div>扰乱</div>
        
    </div>
    <h2>
        
    </h2>
   <xxxx></xxxx>
</template>
<script setup lang='ts' >
import random from "random-words"
import xxxx from './App'
console.log(123)
const a = random(5)

console.log('动次打次')

</script>
<style  lang='less'>

</style>
<style scoped >
div{
    color:white
}
</style>
```