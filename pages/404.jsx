import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import NavBar from '../components/NavBar/NavBar'
import Footer from '../components/Footer/Footer'

// Simple, fun Snake game for the 404 page with a purple theme
export default function Custom404() {
  const canvasRef = useRef(null)
  const loopRef = useRef(null)
  const gridSize = 20
  const cols = 20
  const rows = 20
  const width = cols * gridSize
  const height = rows * gridSize

  const snakeRef = useRef([{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }])
  const dirRef = useRef({ x: 1, y: 0 })
  const foodRef = useRef({ x: 5, y: 5 })
  const foodTypeRef = useRef('jalebi')
  const runningRef = useRef(true)
  const controlsActiveRef = useRef(false)
  const SWEETS = ['🍩','🍬','🧁','🍪']
  
  const [score, setScore] = useState(0)

  function randFood() {
    let p
    const snake = snakeRef.current
    do {
      p = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) }
    } while (snake.some(s => s.x === p.x && s.y === p.y))
    foodRef.current = p
    // Randomize between jalebi and puri
    foodTypeRef.current = Math.random() < 0.5 ? 'jalebi' : 'puri'
  }

  // Helpers to draw assets on grid
  function drawRoundedRect(ctx, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + rr, y)
    ctx.arcTo(x + w, y, x + w, y + h, rr)
    ctx.arcTo(x + w, y + h, x, y + h, rr)
    ctx.arcTo(x, y + h, x, y, rr)
    ctx.arcTo(x, y, x + w, y, rr)
    ctx.closePath()
  }

  function drawSnakeHead(ctx, gx, gy) {
    const x = gx * gridSize
    const y = gy * gridSize
    const r = Math.floor(gridSize * 0.25)
    // Head base
    const grad = ctx.createLinearGradient(x, y, x + gridSize, y + gridSize)
    grad.addColorStop(0, '#4ade80') // green-400
    grad.addColorStop(1, '#16a34a') // green-600
    ctx.fillStyle = grad
    drawRoundedRect(ctx, x + 1, y + 1, gridSize - 2, gridSize - 2, r)
    ctx.fill()
    ctx.strokeStyle = 'rgba(22, 163, 74, 0.5)'
    ctx.lineWidth = 1
    ctx.stroke()
    // Eyes
    const eyeR = Math.max(1, Math.floor(gridSize * 0.12))
    const leftEye = { cx: x + gridSize * 0.32, cy: y + gridSize * 0.35 }
    const rightEye = { cx: x + gridSize * 0.68, cy: y + gridSize * 0.35 }
    ctx.fillStyle = '#fff'
    ctx.beginPath(); ctx.arc(leftEye.cx, leftEye.cy, eyeR, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(rightEye.cx, rightEye.cy, eyeR, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#1f2937' // slate-800 pupils
    const pupilR = Math.max(1, Math.floor(gridSize * 0.07))
    ctx.beginPath(); ctx.arc(leftEye.cx, leftEye.cy, pupilR, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(rightEye.cx, rightEye.cy, pupilR, 0, Math.PI * 2); ctx.fill()
    // Tongue (directional)
    const d = dirRef.current
    ctx.strokeStyle = '#ef4444' // red-500
    ctx.lineWidth = Math.max(1, Math.floor(gridSize * 0.08))
    ctx.beginPath()
    const cx = x + gridSize / 2
    const cy = y + gridSize / 2
    const len = gridSize * 0.4
    if (d.x === 1) { ctx.moveTo(cx + gridSize * 0.25, cy); ctx.lineTo(cx + gridSize * 0.25 + len, cy) }
    else if (d.x === -1) { ctx.moveTo(cx - gridSize * 0.25, cy); ctx.lineTo(cx - gridSize * 0.25 - len, cy) }
    else if (d.y === 1) { ctx.moveTo(cx, cy + gridSize * 0.25); ctx.lineTo(cx, cy + gridSize * 0.25 + len) }
    else { ctx.moveTo(cx, cy - gridSize * 0.25); ctx.lineTo(cx, cy - gridSize * 0.25 - len) }
    ctx.stroke()
    // Tongue fork
    ctx.beginPath()
    ctx.lineWidth = Math.max(1, Math.floor(gridSize * 0.05))
    if (d.x === 1) { ctx.moveTo(cx + gridSize * 0.25 + len, cy); ctx.lineTo(cx + gridSize * 0.25 + len + gridSize * 0.12, cy - gridSize * 0.08); ctx.moveTo(cx + gridSize * 0.25 + len, cy); ctx.lineTo(cx + gridSize * 0.25 + len + gridSize * 0.12, cy + gridSize * 0.08) }
    else if (d.x === -1) { ctx.moveTo(cx - gridSize * 0.25 - len, cy); ctx.lineTo(cx - gridSize * 0.25 - len - gridSize * 0.12, cy - gridSize * 0.08); ctx.moveTo(cx - gridSize * 0.25 - len, cy); ctx.lineTo(cx - gridSize * 0.25 - len - gridSize * 0.12, cy + gridSize * 0.08) }
    else if (d.y === 1) { ctx.moveTo(cx, cy + gridSize * 0.25 + len); ctx.lineTo(cx - gridSize * 0.08, cy + gridSize * 0.25 + len + gridSize * 0.12); ctx.moveTo(cx, cy + gridSize * 0.25 + len); ctx.lineTo(cx + gridSize * 0.08, cy + gridSize * 0.25 + len + gridSize * 0.12) }
    else { ctx.moveTo(cx, cy - gridSize * 0.25 - len); ctx.lineTo(cx - gridSize * 0.08, cy - gridSize * 0.25 - len - gridSize * 0.12); ctx.moveTo(cx, cy - gridSize * 0.25 - len); ctx.lineTo(cx + gridSize * 0.08, cy - gridSize * 0.25 - len - gridSize * 0.12) }
    ctx.stroke()
  }

  function drawJalebi(ctx, gx, gy) {
    const cx = gx * gridSize + gridSize / 2
    const cy = gy * gridSize + gridSize / 2
    ctx.save()
    ctx.strokeStyle = '#f97316' // orange-500
    ctx.lineWidth = Math.max(2, gridSize * 0.18)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    // Spiral from center outwards
    const turns = 2.5
    const maxR = gridSize * 0.42
    const steps = 60
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * (Math.PI * 2 * turns)
      const r = (i / steps) * maxR
      const x = cx + r * Math.cos(t)
      const y = cy + r * Math.sin(t)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()
    // glaze highlight
    ctx.strokeStyle = 'rgba(253, 186, 116, 0.7)' // orange-300
    ctx.lineWidth = Math.max(1, gridSize * 0.07)
    ctx.beginPath()
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * (Math.PI * 2 * turns)
      const r = (i / steps) * (maxR * 0.85)
      const x = cx + r * Math.cos(t)
      const y = cy + r * Math.sin(t)
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.restore()
  }

  function drawPuri(ctx, gx, gy) {
    const x = gx * gridSize
    const y = gy * gridSize
    const cx = x + gridSize / 2
    const cy = y + gridSize / 2
    const r = gridSize * 0.42
    // base circle with radial gradient
    const grad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.2, cx, cy, r)
    grad.addColorStop(0, '#fde68a') // amber-200
    grad.addColorStop(1, '#f59e0b') // amber-500
    ctx.fillStyle = grad
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)'
    ctx.lineWidth = 1
    ctx.stroke()
    // soft bubbles
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    const b = Math.max(1, Math.floor(gridSize * 0.06))
    ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.2, b, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(cx + r * 0.15, cy - r * 0.28, b * 0.8, 0, Math.PI * 2); ctx.fill()
  }

  function drawFood(ctx, gx, gy) {
    if (foodTypeRef.current === 'jalebi') drawJalebi(ctx, gx, gy)
    else drawPuri(ctx, gx, gy)
  }

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Background
    const grad = ctx.createLinearGradient(0, 0, width, height)
    grad.addColorStop(0, '#faf5ff') // purple-50
    grad.addColorStop(1, '#f5f3ff') // violet-50
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    // Grid (subtle)
    ctx.strokeStyle = 'rgba(124,58,237,0.08)'
    ctx.lineWidth = 1
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x + 0.5, 0)
      ctx.lineTo(x + 0.5, height)
      ctx.stroke()
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y + 0.5)
      ctx.lineTo(width, y + 0.5)
      ctx.stroke()
    }

    // Food (jalebi or puri) with subtle shadow
    const food = foodRef.current
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.08)'
    ctx.shadowBlur = 6
    ctx.shadowOffsetY = 2
    drawFood(ctx, food.x, food.y)
    ctx.restore()

    // Snake body first
    const snake = snakeRef.current
    for (let i = 1; i < snake.length; i++) {
      const seg = snake[i]
      const base = 124 // purple-600
      const alpha = 0.6 + (i / Math.max(1, snake.length)) * 0.4
      ctx.fillStyle = `rgba(${base}, ${58}, ${237}, ${alpha})`
      ctx.fillRect(seg.x * gridSize, seg.y * gridSize, gridSize, gridSize)
      ctx.strokeStyle = 'rgba(109, 40, 217, 0.4)' // purple-700
      ctx.strokeRect(seg.x * gridSize + 0.5, seg.y * gridSize + 0.5, gridSize - 1, gridSize - 1)
    }
    // Then the head on top
    const head = snake[0]
    drawSnakeHead(ctx, head.x, head.y)
  }

  function step() {
    if (!runningRef.current) return
    const snake = [...snakeRef.current]
    const dir = dirRef.current
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }

    // collisions (walls)
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      reset()
      return
    }
    // collisions (self)
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      reset()
      return
    }

    snake.unshift(head)
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(s => s + 1)
      randFood()
    } else {
      snake.pop()
    }
    snakeRef.current = snake
    draw()
  }

  function reset() {
    // simple reset to center
    snakeRef.current = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }]
    dirRef.current = { x: 1, y: 0 }
    randFood()
    setScore(0)
  }

  useEffect(() => {
    randFood()
    draw()
    // Autofocus the canvas so arrow keys control the game, not the page
    if (canvasRef.current) {
      try { canvasRef.current.focus() } catch {}
      controlsActiveRef.current = true
    }
    // Loop with fixed interval
    const tick = () => { step() }
    loopRef.current = setInterval(tick, 120)
    return () => clearInterval(loopRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keyboard controls (prevent page scroll when active)
  useEffect(() => {
    function onKey(e) {
      const k = e.key
      const isArrow = k === 'ArrowUp' || k === 'ArrowDown' || k === 'ArrowLeft' || k === 'ArrowRight'
      if (!isArrow) return
      const active = controlsActiveRef.current || document.activeElement === canvasRef.current
      if (!active) return
      // prevent page from scrolling
      e.preventDefault()
      const { x, y } = dirRef.current
      if (k === 'ArrowUp' && y !== 1) dirRef.current = { x: 0, y: -1 }
      else if (k === 'ArrowDown' && y !== -1) dirRef.current = { x: 0, y: 1 }
      else if (k === 'ArrowLeft' && x !== 1) dirRef.current = { x: -1, y: 0 }
      else if (k === 'ArrowRight' && x !== -1) dirRef.current = { x: 1, y: 0 }
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [])

  // Touch controls (swipe)
  useEffect(() => {
    let startX = 0, startY = 0
    function onStart(e) {
      const t = e.touches[0]
      startX = t.clientX
      startY = t.clientY
    }
    function onMove(e) {
      if (!startX && !startY) return
      const t = e.touches[0]
      const dx = t.clientX - startX
      const dy = t.clientY - startY
      if (Math.abs(dx) + Math.abs(dy) < 24) return
      const { x, y } = dirRef.current
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && x !== -1) dirRef.current = { x: 1, y: 0 }
        else if (dx < 0 && x !== 1) dirRef.current = { x: -1, y: 0 }
      } else {
        if (dy > 0 && y !== -1) dirRef.current = { x: 0, y: 1 }
        else if (dy < 0 && y !== 1) dirRef.current = { x: 0, y: -1 }
      }
      startX = 0; startY = 0
    }
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
    }
  }, [])

  return (
    <>
      <Head>
        <title>404 — Lost in Kashi | Kashi Taxi</title>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <NavBar />
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-100 via-rose-50 to-orange-50">
        {/* Floating colorful blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl" />

        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-10 md:py-16">
          <h1 className="bg-gradient-to-r from-purple-700 via-fuchsia-600 to-pink-600 bg-clip-text text-center text-5xl font-extrabold text-transparent md:text-6xl">
            404 — Page Not Found
          </h1>
          <p className="mt-3 max-w-2xl text-center text-slate-600 md:text-lg">
            Looks like this ghat is hidden in the morning mist. While you’re here, play a quick purple Snake and then head back.
          </p>

          {/* Game + Panel */}
          <div className="mt-8 grid w-full items-start gap-6 md:grid-cols-[auto,1fr]">
            <div className="mx-auto rounded-2xl border border-purple-200 bg-white p-3 shadow-sm">
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                aria-label="Snake game canvas"
                tabIndex={0}
                role="application"
                onFocus={() => { controlsActiveRef.current = true }}
                onBlur={() => { controlsActiveRef.current = false }}
                onMouseEnter={() => { if (canvasRef.current) canvasRef.current.focus() }}
                onTouchStart={() => { if (canvasRef.current) canvasRef.current.focus() }}
                className="h-[320px] w-[320px] md:h-[400px] md:w-[400px]"
              />
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-slate-600">Score: <span className="font-semibold text-purple-700">{score}</span></span>
                <button
                  onClick={() => { runningRef.current = true; reset() }}
                  className="rounded-full bg-purple-600 px-3 py-1 font-medium text-white shadow hover:bg-purple-700"
                  aria-label="Restart game"
                >
                  Restart
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-500">Controls: Arrow keys (desktop) or swipe (mobile).</p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Quick links</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  <li><Link className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700" href="/">Go to Homepage</Link></li>
                  <li><Link className="inline-flex w-full items-center justify-center rounded-full bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700" href="/pink-taxi-varanasi">Pink Taxi</Link></li>
                  <li><Link className="inline-flex w-full items-center justify-center rounded-full bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700" href="/bike-rentals-varanasi">Bike Rentals</Link></li>
                  <li><Link className="inline-flex w-full items-center justify-center rounded-full bg-orange-600 px-4 py-2 font-medium text-white hover:bg-orange-700" href="/rates/outstation-taxi-varanasi">Outstation Rates</Link></li>
                </ul>
              </div>

              <div className="rounded-2xl border border-purple-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold">Need a cab right now?</h2>
                <p className="mt-1 text-sm text-slate-600">WhatsApp 99354 74730 or call 94503 01573. Clean AC cars, polite drivers, on-time pickups.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href="https://wa.me/919935474730" target="_blank" rel="noopener noreferrer" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">WhatsApp Us</a>
                  <a href="tel:+919450301573" className="rounded-full bg-orange-50 px-4 py-2 text-sm font-medium text-orange-900 ring-1 ring-orange-200 hover:bg-orange-100">Call Now</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
