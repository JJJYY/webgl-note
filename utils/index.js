(function (globel) {
    function initShader (gl, vertex, fragment) {
        try {
            const program = createProgram(gl, vertex, fragment)
        
            gl.useProgram(program)
            gl.program = program
        
            return true
        } catch (e) {
            console.error(e)
            return false
        }
    }
    
    function createProgram (gl, vertex, fragment) {
        const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertex)
        const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragment)
    
        const program = gl.createProgram()
    
        if (!program) {
            throw new Error('Program 创建失败！')
        }
    
        gl.attachShader(program, vertexShader)
        gl.attachShader(program, fragmentShader)
    
        gl.linkProgram(program)
        const linked = gl.getProgramParameter(program, gl.LINK_STATUS)
        if (!linked) {
            const err = gl.getProgramInfoLog(program)
            gl.deleteProgram(program)
            gl.deleteShader(vertexShader)
            gl.deleteShader(fragmentShader)
            throw new Error('Program 连接失败！\n' + err)
        }
    
        return program
    }
    
    function loadShader (gl, type, source) {
        const shader = gl.createShader(type)
        if (!shader) {
            throw new Error('Shader 创建失败！类型：' + type)
        }
    
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            const err = gl.getShaderInfoLog(shader)
            gl.deleteShader(shader);
            throw new Error('Shader 编译失败！\n' + err)
        }
    
        return shader
    }

    globel.GlHelper = {
        initShader
    }
})(this)
