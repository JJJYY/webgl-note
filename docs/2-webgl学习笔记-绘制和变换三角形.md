# webgl学习笔记-绘制和变换三角形
## 缓冲区
缓冲区对象是 webgl 系统中提供的一块存储区，可以在其中保存想要绘制的所有顶点的数据，然后一次性向顶点着色器中传入数据。

!(缓冲区绘制)[]

使用缓冲区对象向顶点着色器传入数据的步骤为：
1. 创建缓冲区对象（`gl.createBuffer`）
2. 绑定缓冲区对象（`gl.bindBuffer`）
3. 将数据写入缓冲区对象（`gl.bufferData`）
4. 将缓冲区对象分配给一个 attribute 变量（`gl.vertexAttribPointer`）
5. 开启 attribute 变量（`gl.enableVertexAttribArray`）

```js
const canvas = document.getElementById('canvas')
const gl = canvas.getContext('webgl')

// 顶点着色器
const VSHADER_SOURCE = [
  'attribute vec4 a_Position;',
  'void main() {',
  '    gl_Position = a_Position;', // 定义点的位置
  '    gl_PointSize = 10.0;', // 定义点的大小
  '}',
].join('\n')

// 片原着色器
const FSHADER_SOURCE = [
  'void main() {',
  '    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
  '}',
].join('\n')

// initShader 定义在 utils/index.js 中，用于创建 program 并绑定着色器
if (gl && GlHelper.initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  const vertices = new Float32Array([
    0, 0, 0.5, 0.5, -0.5, -0.5
  ])

  const vertexBuffer = gl.createBuffer()
  if (!vertexBuffer) {
    console.error('创建Buffer失败！')
  } else {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

    gl.enableVertexAttribArray(a_Position)

    gl.drawArrays(gl.POINTS, 0, 3)
  }
}
```

[使用 Buffer 绘制多个点](https://jjjyy.github.io/webgl-note/webgl-tester/2/1-buffer.html)

## drawArrays
`gl.drawArrays(mode, start, end)`提供了绘制点、线、回路等绘制模式，通过第一个参数指定不同的值，就能以 7 种不同的方式来绘制图形。

| 基本图形 | 参数 mode | 描述 |
| :--: | :--: | :-- |
| 点 | gl.POINTS | 绘制 v0,...,vn 的点 |
| 三角形 | gl.LINES | 按照 (v0, v1),(v2,v3),... 规则绘制线，点数不足将忽略 |
| 线条 | gl.LINE_STRIP | 按照 (vs, vs+1),(vs+1,vs+2),... 规则绘制线 |
| 回路 | gl.LINE_LOOP | 按照 (vs, vs+1),(vs+1,vs+2),... 规则绘制线 |
| 三角形 | gl.TRIANGLES | 按照(v0, v1, v2),(v3, v4, v5),... 的规则绘制三角形，点数不足将忽略 |
| 三角带 | gl.TRIANGLE_STRIP | 按照(v0, v1, v2),(v1, v2, v3),... 的规则绘制三角形 |
| 三角扇 | gl.TRIANGLE_FAN | 按照(v0, v1, v2),(v0, v2, v3),... 的规则绘制三角形 |

[使用 drawArrays 绘制更多图形](https://jjjyy.github.io/webgl-note/webgl-tester/2/2-triangle.html)

## 变换
如果用 JS 写过动画的同学应该知道，可以通过相隔指定时间修改元素的宽、高等属性，来实现元素的动画，同样的方法我们可以通过修改指定图形的坐标来调整绘制图形的位置，进而实现动画。  
由于 webgl 是建立在三维坐标系上的，对三维坐标的变换就不得不提到矩阵，这里不做详细介绍，只提供平移、旋转、缩放的简单公式，仅供参考。

### 平移
```
x' = x + Tx
y' = y + Ty
z' = z + Tz
```

> 平移就是图形上的点全部加上相同的距离，可以通过调整 Tx、Ty、Tz 的值来实现曲线的平移效果。

[图形的平移变换](https://jjjyy.github.io/webgl-note/webgl-tester/2/3-translation.html)

### 旋转
```
x' = x * cosα - y * sinα
y' = x * sinα + y * cosα
z' = z
```

### 缩放
```
x' = S * x
y' = S * y
z' = S * z
```

[图形的缩放变换](https://jjjyy.github.io/webgl-note/webgl-tester/2/4-scale.html)
