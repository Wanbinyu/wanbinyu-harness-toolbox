const canvas = document.querySelector('#water-background')
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')

if (canvas && !reducedMotion.matches) {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: 'low-power',
  })

  if (gl) startWaterBackground(gl)
}

function startWaterBackground(gl) {
  const vertexSource = `
    attribute vec2 position;
    varying vec2 uv;

    void main() {
      uv = position * .5 + .5;
      gl_Position = vec4(position, 0., 1.);
    }
  `

  const fragmentSource = `
    precision highp float;

    varying vec2 uv;
    uniform vec2 resolution;
    uniform float time;
    uniform float scrollPhase;
    uniform vec4 ripples[6];

    float softLine(float value, float width) {
      return exp(-value * value / width);
    }

    void main() {
      vec2 p = uv - .5;
      p.x *= resolution.x / resolution.y;
      float t = time * .22;
      float displacement = 0.;
      float rippleLight = 0.;

      for (int i = 0; i < 6; i++) {
        vec4 ripple = ripples[i];
        vec2 origin = ripple.xy - .5;
        origin.x *= resolution.x / resolution.y;
        float distanceFromOrigin = distance(p, origin);
        float radius = ripple.z * .19;
        float life = max(0., 1. - ripple.z / 3.2) * ripple.w;
        float ringDistance = distanceFromOrigin - radius;
        float ring = exp(-ringDistance * ringDistance * 820.);
        displacement += sin(ringDistance * 40.) * ring * life * .024;
        rippleLight += ring * life;
      }

      float drift = scrollPhase * .00022;
      float waveA = p.y + .20
        + sin(p.x * 2.8 + t + drift) * .075
        + sin(p.x * 6.1 - t * 1.7) * .018
        + displacement;
      float waveB = p.y - .16
        + sin(p.x * 2.15 - t * .72 - drift) * .09
        + cos(p.x * 5.3 + t) * .022
        - displacement * .72;
      float waveC = p.y - .39
        + sin(p.x * 3.4 + t * .55) * .055
        + displacement * .45;

      float bandA = softLine(waveA, .014);
      float edgeA = softLine(waveA, .00042);
      float bandB = softLine(waveB, .022);
      float edgeB = softLine(waveB, .00055);
      float bandC = softLine(waveC, .01);

      vec3 color = vec3(.024, .055, .105);
      color += vec3(.025, .08, .18) * (1. - length(p) * .42);
      color += vec3(.10, .30, .72) * bandA * .23;
      color += vec3(.10, .53, .61) * bandB * .16;
      color += vec3(.18, .30, .72) * bandC * .10;
      color += vec3(.20, .47, .92) * edgeA * .27;
      color += vec3(.24, .78, .76) * edgeB * .18;
      color += vec3(.24, .68, .95) * min(rippleLight, 1.) * .16;

      float vignette = smoothstep(1.05, .18, length(p * vec2(.70, 1.)));
      color *= .70 + vignette * .30;
      gl_FragColor = vec4(color, 1.);
    }
  `

  const compile = (type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('Water background shader unavailable')
      gl.deleteShader(shader)
      return null
    }
    return shader
  }

  const vertex = compile(gl.VERTEX_SHADER, vertexSource)
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource)
  if (!vertex || !fragment) return

  const program = gl.createProgram()
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return

  gl.useProgram(program)
  canvas.dataset.renderer = 'webgl'
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'position')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const uniforms = {
    resolution: gl.getUniformLocation(program, 'resolution'),
    time: gl.getUniformLocation(program, 'time'),
    scroll: gl.getUniformLocation(program, 'scrollPhase'),
    ripples: gl.getUniformLocation(program, 'ripples[0]'),
  }

  const mobile = matchMedia('(max-width: 660px)').matches
  const start = performance.now()
  const rippleData = new Float32Array(24)
  const ripples = []
  let width = 0
  let height = 0
  let frame = 0
  let lastDraw = 0
  let lastPointer = { x: .72, y: .28, at: 0 }
  let lastScroll = scrollY

  const resize = () => {
    const pixelRatio = Math.min(devicePixelRatio || 1, mobile ? 1 : 1.5)
    const nextWidth = Math.max(1, Math.round(innerWidth * pixelRatio))
    const nextHeight = Math.max(1, Math.round(innerHeight * pixelRatio))
    if (nextWidth === width && nextHeight === height) return
    width = canvas.width = nextWidth
    height = canvas.height = nextHeight
    gl.viewport(0, 0, width, height)
    gl.uniform2f(uniforms.resolution, width, height)
  }

  const addRipple = (x, y, strength = 1) => {
    ripples.push({ x, y: 1 - y, born: performance.now(), strength })
    if (ripples.length > 6) ripples.shift()
  }

  const onPointerMove = event => {
    if (event.pointerType === 'touch') return
    const now = performance.now()
    const x = event.clientX / innerWidth
    const y = event.clientY / innerHeight
    const distance = Math.hypot(x - lastPointer.x, y - lastPointer.y)
    if (now - lastPointer.at > 85 && distance > .018) {
      addRipple(x, y, Math.min(.9, .34 + distance * 4))
      lastPointer = { x, y, at: now }
    }
  }

  const onPointerDown = event => addRipple(event.clientX / innerWidth, event.clientY / innerHeight, 1.15)
  const onScroll = () => {
    const delta = Math.abs(scrollY - lastScroll)
    if (delta > 22) {
      addRipple(lastPointer.x, lastPointer.y, Math.min(.72, .28 + delta / 500))
      lastScroll = scrollY
    }
  }

  const draw = now => {
    frame = requestAnimationFrame(draw)
    if (mobile && now - lastDraw < 32) return
    lastDraw = now
    resize()

    rippleData.fill(0)
    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      const ripple = ripples[index]
      const age = (now - ripple.born) / 1000
      if (age > 3.2) {
        ripples.splice(index, 1)
        continue
      }
      rippleData[index * 4] = ripple.x
      rippleData[index * 4 + 1] = ripple.y
      rippleData[index * 4 + 2] = age
      rippleData[index * 4 + 3] = ripple.strength
    }

    gl.uniform1f(uniforms.time, (now - start) / 1000)
    gl.uniform1f(uniforms.scroll, scrollY)
    gl.uniform4fv(uniforms.ripples, rippleData)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    canvas.dataset.active = 'true'
  }

  const onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame)
      canvas.dataset.active = 'false'
    } else {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(draw)
    }
  }

  addEventListener('pointermove', onPointerMove, { passive: true })
  addEventListener('pointerdown', onPointerDown, { passive: true })
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  resize()
  addRipple(.72, .28, .7)
  frame = requestAnimationFrame(draw)
}
