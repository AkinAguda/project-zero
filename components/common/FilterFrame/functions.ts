import {
  createShader,
  createProgram,
  resizeCanvasToDisplaySize,
  setRectangle,
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

    uniform vec2 u_resolution;

    varying vec2 v_texCoord;

    vec2 convertToClipSpace(vec2 position) {

    vec2 zeroToOne = position / u_resolution;
    
    vec2 zeroToTwo = zeroToOne * 2.0;
    
    vec2 clipSpace = zeroToTwo - 1.0;
    
    return clipSpace;
    }

    void main() {
        gl_Position = vec4(convertToClipSpace(a_position), 0, 1);
        v_texCoord = a_texCoord;
    }
`;

  const fragmentShaderSource = `
    precision mediump float;

    uniform sampler2D u_image;
    uniform vec2 u_textureSize;     
    uniform float u_kernel[9];
    uniform float u_kernelWeight;

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
    
    // Divide the sum by the weight but just use rgb
    // we'll set alpha to 1.0
    gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1.0);
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

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setRectangle(gl, 0, 0, canvas.width, canvas.height);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const textureLocation = gl.getAttribLocation(program, "a_texCoord");
  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
    ]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(textureLocation);
  gl.vertexAttribPointer(textureLocation, 2, gl.FLOAT, false, 0, 0);

  const kernelWeightUniformLocation = gl.getUniformLocation(
    program,
    "u_kernelWeight"
  );

  const textureSize = gl.getUniformLocation(program, "u_textureSize");
  gl.uniform2f(textureSize, image.width, image.height);

  const setFramebuffer = (
    frameBuffer: WebGLFramebuffer | null,
    config: TextureConfig
  ) => {
    const { width, height } = config;
    // make this the framebuffer we are rendering to.
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    gl.uniform2f(resolutionUniformLocation, width, height);

    // Tell webgl the viewport setting needed for framebuffer.
    gl.viewport(0, 0, width, height);
  };

  const kernelUniformLocation = gl.getUniformLocation(program, "u_kernel");
  const drawWithKernel = (kernel: number[]) => {
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
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  return { drawWithKernel, setFramebuffer };
};
