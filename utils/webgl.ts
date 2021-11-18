abstract class Shader {
  constructor(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (shader) {
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (success) {
        return shader;
      }
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
    }
  }
}

export class VertexShader extends Shader {
  constructor(gl: WebGLRenderingContext, source: string) {
    super(gl, gl.VERTEX_SHADER, source);
  }
}

export class FragmentShader extends Shader {
  constructor(gl: WebGLRenderingContext, source: string) {
    super(gl, gl.FRAGMENT_SHADER, source);
  }
}

class Program {
  program: WebGLProgram | undefined;
  constructor(
    gl: WebGLRenderingContext,
    vertexshaderSource: string,
    fragmentShaderSource: string
  ) {
    const vertexShader = new VertexShader(gl, vertexshaderSource);
    const fragmentShader = new FragmentShader(gl, fragmentShaderSource);
    const program = gl.createProgram();
    if (program) {
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      const success = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (success) {
        this.program = program;
      }
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
    }
  }
}

class Texture {
  private textureValue: WebGLTexture | undefined;
  constructor(gl: WebGLRenderingContext) {
    const texture = gl.createTexture();
    if (texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);

      // Set the parameters so we can render any size image.
      // NEED TO LEARN WHAT EACH OF THESE DO
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

      this.textureValue = texture;
    }
  }

  get texture() {
    return this.textureValue;
  }
}
