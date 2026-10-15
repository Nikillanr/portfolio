/* Fullscreen image transition with a subtle curved distortion. CSS handles non-WebGL browsers. */
window.PortfolioScene = class PortfolioScene {
  constructor(canvas, images) {
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, preserveDrawingBuffer: true, powerPreference: 'low-power' });
    if (!gl) throw new Error('WebGL unavailable');
    this.gl = gl; this.canvas = canvas; this.images = images; this.current = 0; this.progress = 0; this.direction = 1;
    this.mouse = [0, 0]; this.target = [0, 0]; this.frame = null; this.moving = false;
    const vertex = `attribute vec2 aPosition; varying vec2 vUv; void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}`;
    const fragment = `precision mediump float;
      varying vec2 vUv; uniform sampler2D uFrom; uniform sampler2D uTo;
      uniform vec2 uViewport; uniform vec2 uFromSize; uniform vec2 uToSize; uniform vec2 uMouse;
      uniform float uProgress; uniform float uDirection;
      vec2 cover(vec2 uv,vec2 size){float vr=uViewport.x/uViewport.y;float ir=size.x/size.y;vec2 scale=vr>ir?vec2(1.,ir/vr):vec2(vr/ir,1.);return (uv-.5)*scale+.5;}
      void main(){float p=uProgress;float pulse=sin(p*3.14159265);vec2 uv=vUv;
        uv=(uv-.5)*.98+.5+uMouse*.004;
        float bend=sin(uv.x*3.14159265)*pulse*.085*uDirection;
        vec2 a=uv+vec2(0.,p*.09*uDirection+bend);
        vec2 b=uv-vec2(0.,(1.-p)*.09*uDirection-bend);
        vec3 from=texture2D(uFrom,cover(a,uFromSize)).rgb;
        vec3 to=texture2D(uTo,cover(b,uToSize)).rgb;
        float axis=uDirection>0.?uv.y:1.-uv.y;
        float edge=p*1.3-.15;
        float mixValue=1.-smoothstep(edge-.12,edge+.12,axis);
        if(p<.001)mixValue=0.;if(p>.999)mixValue=1.;
        gl_FragColor=vec4(mix(from,to,mixValue),1.);
      }`;
    const compile = (type, source) => { const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader compile failed'); return shader; };
    this.program = gl.createProgram(); gl.attachShader(this.program, compile(gl.VERTEX_SHADER, vertex)); gl.attachShader(this.program, compile(gl.FRAGMENT_SHADER, fragment)); gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) throw new Error('Shader link failed');
    gl.useProgram(this.program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(this.program, 'aPosition'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    this.uniforms = Object.fromEntries(['uFrom','uTo','uViewport','uFromSize','uToSize','uMouse','uProgress','uDirection'].map(key => [key, gl.getUniformLocation(this.program, key)]));
    this.textures = images.map(image => { const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); return texture; });
    if (gl.getError() !== gl.NO_ERROR) throw new Error('Image texture upload failed');
    this.next = 0;
    this.resize = () => { const dpr = Math.min(devicePixelRatio || 1, 1.5); canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr); gl.viewport(0, 0, canvas.width, canvas.height); this.draw(); };
    addEventListener('resize', this.resize); this.resize();
    document.querySelector('#gallery').addEventListener('pointermove', event => { if (event.pointerType === 'touch') return; this.target = [(event.clientX / innerWidth - .5) * 2, (.5 - event.clientY / innerHeight) * 2]; this.schedule(); });
    document.querySelector('#gallery').addEventListener('pointerleave', () => { this.target = [0, 0]; this.schedule(); });
    canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); document.querySelector('.scene').classList.remove('webgl-ready'); });
  }
  draw() {
    const gl = this.gl, u = this.uniforms;
    gl.useProgram(this.program);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.textures[this.current]); gl.uniform1i(u.uFrom, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.textures[this.next]); gl.uniform1i(u.uTo, 1);
    gl.uniform2f(u.uViewport, this.canvas.width, this.canvas.height);
    gl.uniform2f(u.uFromSize, this.images[this.current].naturalWidth, this.images[this.current].naturalHeight);
    gl.uniform2f(u.uToSize, this.images[this.next].naturalWidth, this.images[this.next].naturalHeight);
    gl.uniform2f(u.uMouse, ...this.mouse); gl.uniform1f(u.uProgress, this.progress); gl.uniform1f(u.uDirection, this.direction);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  schedule() {
    if (this.frame || this.moving) return;
    this.frame = requestAnimationFrame(() => { this.frame = null; this.mouse = this.mouse.map((v, i) => v + (this.target[i] - v) * .08); this.draw(); if (this.mouse.some((v, i) => Math.abs(v - this.target[i]) > .001)) this.schedule(); });
  }
  transition(index, direction) {
    this.next = index; this.direction = direction; this.moving = true;
    return new Promise(resolve => {
      const start = performance.now();
      const tick = now => {
        const t = Math.min((now - start) / 1150, 1);
        this.progress = t < .5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
        this.draw();
        if (t < 1) requestAnimationFrame(tick);
        else { this.current = index; this.progress = 0; this.moving = false; document.querySelector('#hero-image').src = this.images[index].src; this.draw(); resolve(); }
      };
      requestAnimationFrame(tick);
    });
  }
  jump(index) {
    this.current = index; this.next = index; this.progress = 0;
    document.querySelector('#hero-image').src = this.images[index].src;
    this.draw();
  }
};
