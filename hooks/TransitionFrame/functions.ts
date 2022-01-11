import {
  createShader,
  createProgram,
  resizeCanvasToDisplaySize,
  // setRectangle,
  TextureConfig,
} from "@hzn/utils/webgl";

export const setupImageRenderer = (
  gl: WebGLRenderingContext,
  image: HTMLImageElement,
  canvas: HTMLCanvasElement
) => {
  // Setting a local canvas variable
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  resizeCanvasToDisplaySize(canvas);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Doing some shady stuff (pun intended)
  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;

    uniform vec2 u_canvasResolution;
    uniform vec2 u_imageResolution;
    uniform vec2 u_resolution;

    varying vec2 v_texCoord;

    vec2 convertToClipSpace(vec2 position, vec2 resolution) {

      vec2 zeroToOne = position / resolution;
      
      vec2 zeroToTwo = zeroToOne * 2.0;
      
      vec2 clipSpace = vec2(zeroToTwo.x - 1.0, 1.0 - zeroToTwo.y);
      
      return clipSpace;
    }

    vec2 convertToTextureClipSpace(vec2 position, vec2 resolution) {

      vec2 zeroToOne = position / resolution;
      
      vec2 clipSpace = vec2(zeroToOne.x, 1.0 - zeroToOne.y);
      
      return clipSpace;
    }

    void main() {
        gl_Position = vec4(convertToClipSpace(a_position, u_canvasResolution), 0, 1);
        v_texCoord = convertToTextureClipSpace(a_texCoord, u_imageResolution);
    }
`;

  const fragmentShaderSource = `
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_textureSize;     
    uniform float u_greyscaleFactor;
    uniform float u_noise;

    varying vec2 v_texCoord;

    float random2d(){
      return fract(sin(dot(v_texCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    vec4 generateNoise(vec4 color) {
      if (u_noise == 0.0) {
        return color;
      }
      vec4 color_copy = color;
      float noise = random2d() - 0.5 * u_noise;

      color_copy.r += noise;
      color_copy.g += noise;
      color_copy.b += noise;

      return color_copy;
    }

    vec4 performGreyscale(vec4 color) {
      float grey = 0.21 * color.r + 0.71 * color.g + 0.07 * color.b;
      return vec4(color.rgb * (1.0 - u_greyscaleFactor) + (grey * u_greyscaleFactor), color.a);
    }

    void main() {
    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;    
    gl_FragColor = generateNoise(performGreyscale(texture2D(u_image, v_texCoord).rgba));
    }
`;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)!;
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  )!;
  const program = createProgram(gl, vertexShader, fragmentShader)!;
  gl.useProgram(program);

  const canvasResolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_canvasResolution"
  );

  const imageResolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_imageResolution"
  );

  const greyscaleFactorUniform = gl.getUniformLocation(
    program,
    "u_greyscaleFactor"
  );

  const noiseUniformLocation = gl.getUniformLocation(program, "u_noise");

  const textureSize = gl.getUniformLocation(program, "u_textureSize");
  gl.uniform2f(textureSize, image.width, image.height);
  gl.uniform2f(imageResolutionUniformLocation, image.width, image.height);

  const setVertices = (aPosition: number[], aTexCoord: number[]) => {
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aPosition), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const textureLocation = gl.getAttribLocation(program, "a_texCoord");
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aTexCoord), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(textureLocation);
    gl.vertexAttribPointer(textureLocation, 2, gl.FLOAT, false, 0, 0);
  };

  const setupRenderer = (config: TextureConfig) => {
    const { width, height } = config;

    gl.uniform2f(canvasResolutionUniformLocation, width, height);

    // Tell webgl the viewport setting needed for framebuffer.
    gl.viewport(0, 0, width, height);
  };

  /**
   * A floating point value between 0.0 and 1
   * @param value
   */
  const setGreyscale = (value: number) => {
    gl.uniform1f(greyscaleFactorUniform, value);
  };

  /**
   * A floating point valu
   * @param value
   */
  const setNoise = (value: number) => {
    gl.uniform1f(noiseUniformLocation, value);
  };

  return {
    setupRenderer,
    setVertices,
    setGreyscale,
    setNoise,
  };
};
