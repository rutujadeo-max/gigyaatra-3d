import { useEffect, useRef, useState } from 'react'

import { GameShell } from './GameShell'

const TRACK_WIDTH = 680
const PLAYER_X = 72
const PLAYER_WIDTH = 42
const BASE_SPEED = 320
const GRAVITY = 1700
const JUMP_VELOCITY = 760

const createObstacle = (id) => ({
  id,
  x: TRACK_WIDTH,
  width: 18 + Math.random() * 10,
  height: 24 + Math.random() * 26,
  scored: false,
})

const createSpawnDelay = () => 1 + Math.random() * 0.7

const applyJumpIfReady = (frame) => {
  if (frame.playerY > 8) {
    return false
  }

  frame.velocity = JUMP_VELOCITY

  return true
}

const createInitialFrame = () => ({
  playerY: 0,
  velocity: 0,
  obstacles: [],
  score: 0,
  distance: 0,
  spawnTimer: 1,
  nextObstacleId: 1,
  previousTime: 0,
})

export const HurdleRunner = ({ game, onActivityComplete, onActivityStart, region }) => {
  const [phase, setPhase] = useState('idle')
  const [snapshot, setSnapshot] = useState({
    playerY: 0,
    obstacles: [],
    score: 0,
    distance: 0,
    speed: BASE_SPEED,
  })
  const animationFrameRef = useRef(null)
  const frameDataRef = useRef(createInitialFrame())

  const stopLoop = () => {
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  const stepFrame = (timestamp) => {
    const frame = frameDataRef.current

    if (!frame.previousTime) {
      frame.previousTime = timestamp
      animationFrameRef.current = window.requestAnimationFrame(stepFrame)
      return
    }

    const delta = Math.min(0.03, (timestamp - frame.previousTime) / 1000)
    frame.previousTime = timestamp
    frame.distance += delta * 14
    frame.spawnTimer -= delta

    if (frame.spawnTimer <= 0) {
      frame.obstacles.push(createObstacle(frame.nextObstacleId))
      frame.nextObstacleId += 1
      frame.spawnTimer = createSpawnDelay()
    }

    frame.velocity -= GRAVITY * delta
    frame.playerY = Math.max(0, frame.playerY + frame.velocity * delta)

    if (frame.playerY === 0 && frame.velocity < 0) {
      frame.velocity = 0
    }

    const speed = BASE_SPEED + Math.min(150, frame.distance * 4)

    frame.obstacles = frame.obstacles
      .map((obstacle) => {
        const nextX = obstacle.x - speed * delta
        const hasCleared = !obstacle.scored && nextX + obstacle.width < PLAYER_X

        if (hasCleared) {
          frame.score += 1
        }

        return {
          ...obstacle,
          x: nextX,
          scored: obstacle.scored || hasCleared,
        }
      })
      .filter((obstacle) => obstacle.x + obstacle.width > -40)

    const collided = frame.obstacles.some((obstacle) => {
      const overlapX = PLAYER_X + PLAYER_WIDTH > obstacle.x && PLAYER_X < obstacle.x + obstacle.width
      const needsMoreHeight = frame.playerY < obstacle.height - 2

      return overlapX && needsMoreHeight
    })

    const nextSnapshot = {
      playerY: frame.playerY,
      obstacles: frame.obstacles,
      score: frame.score,
      distance: Math.floor(frame.distance),
      speed: Math.round(speed),
    }

    setSnapshot(nextSnapshot)

    if (collided) {
      stopLoop()
      setPhase('complete')
      return
    }

    animationFrameRef.current = window.requestAnimationFrame(stepFrame)
  }

  const startGame = () => {
    stopLoop()
    frameDataRef.current = createInitialFrame()
    setSnapshot({
      playerY: 0,
      obstacles: [],
      score: 0,
      distance: 0,
      speed: BASE_SPEED,
    })
    setPhase('playing')
    animationFrameRef.current = window.requestAnimationFrame(stepFrame)
  }

  const handleJump = () => {
    if (phase !== 'playing') {
      return
    }

    const frame = frameDataRef.current

    applyJumpIfReady(frame)
  }

  useEffect(() => () => stopLoop(), [])

  useEffect(() => {
    if (phase !== 'playing') {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.code !== 'Space') {
        return
      }

      event.preventDefault()
      applyJumpIfReady(frameDataRef.current)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase])

  const isComplete = phase === 'complete'

  return (
    <GameShell
      completionContent={
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Final Run
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{snapshot.score} hurdles</p>
            <p className="mt-2 text-sm text-slate-300">
              Distance covered: {snapshot.distance}m before the collision ended the run.
            </p>
          </div>
        </div>
      }
      activityResult={{ score: snapshot.score, scoreCap: 10 }}
      completionMessage="Each hurdle cleared counted toward your run score."
      completionTitle="Run complete"
      description={game.summary}
      instructions={game.instructions}
      isComplete={isComplete}
      isStarted={phase !== 'idle'}
      onRestart={startGame}
      onStart={startGame}
      onActivityComplete={onActivityComplete}
      onActivityStart={onActivityStart}
      region={region}
      startLabel="Start Hurdle Runner"
      stats={[
        { label: 'Hurdles Cleared', value: `${snapshot.score}` },
        { label: 'Distance', value: `${snapshot.distance}m` },
        { label: 'Pace', value: `${snapshot.speed}` },
      ]}
      statusMessage={
        isComplete
          ? 'The run is over. Restart to line up another clean set of jumps.'
          : 'Press space on desktop or tap the track on mobile to jump the next hurdle.'
      }
      title={game.title}
    >
      <div className="space-y-5">
        <div
          className="runner-track"
          onClick={handleJump}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              handleJump()
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="runner-skyline" />
          <div className="runner-ground-line" />

          <div
            className="runner-character"
            style={{
              left: `${PLAYER_X}px`,
              transform: `translateY(${-snapshot.playerY}px)`,
            }}
          >
            <div className="runner-character__head" />
            <div className="runner-character__body" />
          </div>

          {snapshot.obstacles.map((obstacle) => (
            <div
              className="runner-obstacle"
              key={obstacle.id}
              style={{
                left: `${obstacle.x}px`,
                width: `${obstacle.width}px`,
                height: `${obstacle.height}px`,
              }}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-full bg-[var(--game-accent)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={phase !== 'playing'}
            onClick={handleJump}
            type="button"
          >
            Jump
          </button>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            Automatic run active. Clear the hurdles before they reach you.
          </div>
        </div>
      </div>
    </GameShell>
  )
}
