# webgl 学习笔记（一）
## 前言
本系列为作者初学 webgl 的过程记录文章，欢迎大牛多多指点，本系列掺杂作者本人个人理解绝对会存在错误，会出现不定期勘误。  
作者文笔有限，主要以代码为主，见谅～

## 什么是 webgl
简单来说 webgl 为浏览器提供了渲染复杂三维图形的能力，不了解的可以自行搜索，这里不在赘述。

## canvans 创建 webgl 上下文
html
```html
<canvas id='canvas'></canvas>
```

js
```js
const ctx = document.getElementById('canvas')
ctx.getContext('webgl') // 获取 webgl 上下文
```

对 canvas 比较了解的同学应该知道`ctx.getContext`存在两个选项`2d`/`webgl`，前者用来创建 2d 渲染上下文，后者用来创建 webgl 渲染上下文，这里主要是针对 webgl 绘制上下文的学习。  

一个问题：假如我们描述一个点需要怎样描述？  
我们需要描述这个点的位置、大小、颜色，那么这些属性在 webgl 中就可以通过**顶点着色器与片元着色器**来进行描述。

## 顶点着色器与片元着色器
**顶点着色器：** 顶点着色器是用来描述顶点特性（如位置）的程序。顶点是指二维或三维空间中的一个点，比如二维或三维图像的端点或交点。  
**片元着色器：** 进行逐片元处理过程如光照的程序。片元是一个 webgl 的术语，可以将其理解为像素。

着色器可以通过下图理解：
![webgl 着色器]()

上面的概念知道就好，下面我们来画个点，理解下着色器。

### 画个点

```js
const ctx = document.getElementById('canvas').getContext('webgl')

// 顶点着色器
const VSHADER_SOURCE = [
    'void main() {',
    '    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);', // 定义点的位置
    '    gl_PointSize = 10.0;', // 定义点的大小
    '}',
].join('\n')

// 片原着色器
const FSHADER_SOURCE = [
    'void main() {',
    '    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
    '}',
].join('\n')

if (ctx) {
    // initShader 定义在 utils/index.js 中，用于创建 program 并绑定着色器
    if (initShader(ctx, VSHADER_SOURCE, FSHADER_SOURCE)) {
        ctx.clearColor(0.0, 0.0, 0.0, 1.0)
        ctx.clear(ctx.COLOR_BUFFER_BIT)

        ctx.drawArrays(ctx.POINTS, 0, 1)
    }
}
```
通过调整着色器代码，可以改变点的位置、大小、颜色。
> 这里`vec4`是`GLSL`中的数据类型，表示 4 个 float 的矢量。

### 点击画点
```js
// 顶点着色器
const VSHADER_SOURCE = [
    'attribute vec4 a_Position;', // 定义一个变量
    'void main() {',
    '    gl_Position = a_Position;', // 定义点的位置
    '    gl_PointSize = 10.0;', // 定义点的大小
    '}',
].join('\n')

// 获取 a_Position 的存储位置
const a_Position = gl.getAttribLocation(gl.program, 'a_Position')

gl.vertexAttrib3f(a_Position, x, y, 0.0) // 设置属性值
```

上面的代码只包含差异部分，顶点着色器中定义了变量 a_Position，然后在 js 中获取变量存储位置，鼠标点击后获取点击位置并改变 a_Position 的值，然后 webgl 将点渲染出来。

> 这里作者在调整位置时候发现不论画布多大，canvas 坐标的范围始终是`[-1, 1]`，应该跟其他因素有关，这里保留疑问。

### 画多个点
```js
const points = []
canvas.addEventListener('click', e => {
    const x = (e.clientX - left) * 2 / canvas.width - 1
    const y = 1 - (e.clientY - top) * 2 / canvas.height
    points.push(x, y)
    clearCanvas()

    for (let i = 0, len = points.length; i < len; i += 2) {
        gl.vertexAttrib3f(a_Position, points[i], points[i + 1], 0.0) // 设置属性值
        gl.drawArrays(gl.POINTS, 0, 1) // 画点
    }
})
```
对比画一个点和画多个点会知道，webgl 在每次绘制时会将画布清空，所以画多个点时，需要将以前的点重新绘制。

### 修改点的颜色
```js
// 片原着色器
const FSHADER_SOURCE = [
    'precision mediump float;',
    'uniform vec4 u_FragColor;', // 定义一个变量
    'void main() {',
    '    gl_FragColor = u_FragColor;',
    '}',
].join('\n')

gl.uniform4f(u_FragColor, points[i + 2], points[i + 3], points[i + 4], 1.0) // 设置颜色属性值
```
片原着色器中定义变量，使用`uniform`，对应设置为`gl.uniform4f`。  
在修改片原着色器过程中，漏掉了`precision mediump float;`，找到了[stackoverflow的解释](https://stackoverflow.com/questions/13780609/what-does-precision-mediump-float-mean)，在定义变量时需要告诉 GPU 变量的精度。

## 扩展一个 Demo
使用上面的例子，写一个模仿鼠标涟漪效果的 [Demo]()，当然形状使用正方形代替。
