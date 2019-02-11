const canvas = document.getElementById('canvas') as HTMLCanvasElement
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
// if (gl && GlHelper.initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
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
// }