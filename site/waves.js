const canvas = document.querySelector('#water-background')
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')

if (canvas && !reducedMotion.matches) {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: 'low-power',
  })

  if (gl) {
    startWaterBackground(gl)
  } else {
    const context = canvas.getContext('2d')
    if (context) startCanvasWaterBackground(context)
  }
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
      float flow = p.y
        + sin(p.x * 2.35 + t * .85) * .055
        + sin(p.x * 7.2 - t * 1.15) * .012
        + displacement * .58;
      float filaments = pow(max(0., cos(flow * 47.)), 18.);
      float fineFilaments = pow(max(0., cos((flow + p.x * .035) * 83.)), 26.);

      vec3 color = vec3(.024, .055, .105);
      color += vec3(.025, .08, .18) * (1. - length(p) * .42);
      color += vec3(.10, .30, .72) * bandA * .31;
      color += vec3(.10, .53, .61) * bandB * .22;
      color += vec3(.18, .30, .72) * bandC * .16;
      color += vec3(.20, .47, .92) * edgeA * .38;
      color += vec3(.24, .78, .76) * edgeB * .28;
      color += vec3(.16, .48, .88) * filaments * .10;
      color += vec3(.20, .76, .78) * fineFilaments * .055;
      color += vec3(.24, .68, .95) * min(rippleLight, 1.) * .30;

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

function startCanvasWaterBackground(context) {
  canvas.dataset.renderer = '2d'
  const mobile = matchMedia('(max-width: 660px)').matches
  const ripples = []
  const started = performance.now()
  let frame = 0
  let width = 0
  let height = 0
  let pixelRatio = 1
  let lastDraw = 0
  let lastPointer = { x: .72, y: .28, at: 0 }
  let lastScroll = scrollY

  const resize = () => {
    pixelRatio = Math.min(devicePixelRatio || 1, mobile ? 1 : 1.5)
    width = innerWidth
    height = innerHeight
    canvas.width = Math.max(1, Math.round(width * pixelRatio))
    canvas.height = Math.max(1, Math.round(height * pixelRatio))
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  }

  const addRipple = (x, y, strength = 1) => {
    ripples.push({ x: x * width, y: y * height, born: performance.now(), strength })
    if (ripples.length > 6) ripples.shift()
  }

  const onPointerMove = event => {
    if (event.pointerType === 'touch') return
    const now = performance.now()
    const x = event.clientX / innerWidth
    const y = event.clientY / innerHeight
    if (now - lastPointer.at > 85 && Math.hypot(x - lastPointer.x, y - lastPointer.y) > .018) {
      addRipple(x, y, .7)
      lastPointer = { x, y, at: now }
    }
  }

  const draw = now => {
    frame = requestAnimationFrame(draw)
    if (mobile && now - lastDraw < 32) return
    lastDraw = now
    const elapsed = (now - started) / 1000
    const background = context.createLinearGradient(0, 0, width, height)
    background.addColorStop(0, '#07111f')
    background.addColorStop(.55, '#0a1a31')
    background.addColorStop(1, '#07111f')
    context.fillStyle = background
    context.fillRect(0, 0, width, height)

    context.lineWidth = 1
    for (let line = 0; line < 11; line += 1) {
      context.beginPath()
      const baseY = height * (.12 + line * .079)
      for (let x = -10; x <= width + 10; x += 10) {
        const y = baseY
          + Math.sin(x / 155 + elapsed * .32 + line * .42) * (14 + line * .7)
          + Math.sin(x / 57 - elapsed * .24) * 3.5
          + scrollY * (line % 2 ? .0008 : -.0006)
        if (x < 0) context.moveTo(x, y)
        else context.lineTo(x, y)
      }
      context.strokeStyle = line % 3 === 0 ? 'rgba(98,217,200,.16)' : 'rgba(120,168,255,.13)'
      context.stroke()
    }

    for (let index = ripples.length - 1; index >= 0; index -= 1) {
      const ripple = ripples[index]
      const age = (now - ripple.born) / 1000
      if (age > 2.8) {
        ripples.splice(index, 1)
        continue
      }
      context.beginPath()
      context.arc(ripple.x, ripple.y, age * 82, 0, Math.PI * 2)
      context.strokeStyle = `rgba(116, 211, 238, ${(1 - age / 2.8) * .38 * ripple.strength})`
      context.lineWidth = 1.4
      context.stroke()
    }
    canvas.dataset.active = 'true'
  }

  addEventListener('pointermove', onPointerMove, { passive: true })
  addEventListener('pointerdown', event => addRipple(event.clientX / innerWidth, event.clientY / innerHeight, 1.15), { passive: true })
  addEventListener('scroll', () => {
    const delta = Math.abs(scrollY - lastScroll)
    if (delta > 22) {
      addRipple(lastPointer.x, lastPointer.y, Math.min(1, .4 + delta / 500))
      lastScroll = scrollY
    }
  }, { passive: true })
  addEventListener('resize', resize, { passive: true })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame)
      canvas.dataset.active = 'false'
    } else {
      frame = requestAnimationFrame(draw)
    }
  })
  resize()
  addRipple(.72, .28, .8)
  frame = requestAnimationFrame(draw)
}
