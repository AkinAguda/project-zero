import {
  createShader,
  createProgram,
  resizeCanvasToDisplaySize,
  // setRectangle,
  TextureConfig,
} from "@hzn/utils/webgl";
import { FilterTypes } from "./types";

export const getConvolutionKernel = (filter: FilterTypes): number[] => {
  switch (filter) {
    case "NORMAL":
      return [0, 0, 0, 0, 1, 0, 0, 0, 0];
    case "GAUSSIAN_BLUR":
      return [0.045, 0.122, 0.045, 0.122, 0.332, 0.122, 0.045, 0.122, 0.045];
    case "UNSHARPEN":
      return [-1, -1, -1, -1, 9, -1, -1, -1, -1];
    case "EMBOSS":
      return [-2, -1, 0, -1, 1, 1, 0, 1, 2];

    default:
      return [0, 0, 0, 0, 1, 0, 0, 0, 0];
  }
};

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
    uniform float u_kernel[9];
    uniform float u_kernelWeight;
    uniform float u_greyscaleFactor;

    varying vec2 v_texCoord;

    void main() {
    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
    vec4 colorSum =
        texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
        texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
        texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
        texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
    
    vec4 rgba = (colorSum / u_kernelWeight).rgba;
    float grey = 0.21 * rgba.r + 0.71 * rgba.g + 0.07 * rgba.b;
    gl_FragColor = vec4(rgba.rgb * (1.0 - u_greyscaleFactor) + (grey * u_greyscaleFactor), rgba.a);
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

  gl.uniform1f(greyscaleFactorUniform, 0.0);

  const kernelWeightUniformLocation = gl.getUniformLocation(
    program,
    "u_kernelWeight"
  );

  const textureSize = gl.getUniformLocation(program, "u_textureSize");
  gl.uniform2f(textureSize, image.width, image.height);

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

  gl.uniform2f(imageResolutionUniformLocation, image.width, image.height);

  const setFramebuffer = (
    frameBuffer: WebGLFramebuffer | null,
    config: TextureConfig
  ) => {
    const { width, height } = config;
    // make this the framebuffer we are rendering to.
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    gl.uniform2f(canvasResolutionUniformLocation, width, height);

    // Tell webgl the viewport setting needed for framebuffer.
    gl.viewport(0, 0, width, height);
  };

  const kernelUniformLocation = gl.getUniformLocation(program, "u_kernel");
  const drawWithKernel = (kernel: number[], verticesCount: number) => {
    // set the kernel
    gl.uniform1fv(kernelUniformLocation, kernel);

    gl.uniform1f(
      kernelWeightUniformLocation,
      Math.min(
        kernel.reduce((a, b) => a + b),
        1
      )
    );

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, verticesCount);
  };
  return { drawWithKernel, setFramebuffer, setVertices };
};
