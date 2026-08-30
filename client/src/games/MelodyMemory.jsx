import { useEffect, useRef, useState } from 'react'

import { GameShell } from './GameShell'

const getRandomPadIndex = (padCount) => Math.floor(Math.random() * padCount)

export const MelodyMemory = ({ game, onActivityComplete, onActivityStart, region }) => {
  const [phase, setPhase] = useState('idle')
  const [sequence, setSequence] = useState([])
  const [inputIndex, setInputIndex] = useState(0)
  const [activePadIndex, setActivePadIndex] = useState(null)
  const [canInput, setCanInput] = useState(false)
  const [score, setScore] = useState(0)
  const [statusMessage, setStatusMessage] = useState(
    'Start the challenge and watch the glowing pads carefully.',
  )
  const timerIdsRef = useRef([])

  const clearTimers = () => {
    timerIdsRef.current.forEach((timerId) => window.clearTimeout(timerId))
    timerIdsRef.current = []
  }

  const queueTimer = (callback, delay) => {
    const timerId = window.setTimeout(callback, delay)
    timerIdsRef.current.push(timerId)
  }

  const flashPad = (padIndex, duration = 220) => {
    setActivePadIndex(padIndex)
    queueTimer(() => setActivePadIndex(null), duration)
  }

  const playSequence = (nextSequence) => {
    clearTimers()
    setCanInput(false)
    setInputIndex(0)
    setStatusMessage('Watch the pattern, then repeat it one pad at a time.')

    nextSequence.forEach((padIndex, index) => {
      queueTimer(() => setActivePadIndex(padIndex), index * 700 + 220)
      queueTimer(() => setActivePadIndex(null), index * 700 + 560)
    })

    queueTimer(() => {
      setCanInput(true)
      setStatusMessage('Your turn. Repeat the melody with clicks or taps.')
    }, nextSequence.length * 700 + 260)
  }

  const extendSequence = (baseSequence) => {
    const nextPadIndex = getRandomPadIndex(game.pads.length)
    const nextSequence = [...baseSequence, nextPadIndex]

    setSequence(nextSequence)
    playSequence(nextSequence)
  }

  const startGame = () => {
    clearTimers()
    setPhase('playing')
    setSequence([])
    setInputIndex(0)
    setActivePadIndex(null)
    setCanInput(false)
    setScore(0)
    setStatusMessage('Opening note incoming. Get ready.')
    extendSequence([])
  }

  const finishGame = (message) => {
    clearTimers()
    setCanInput(false)
    setStatusMessage(message)
    setPhase('complete')
  }

  const handlePadPress = (padIndex) => {
    if (phase !== 'playing' || !canInput) {
      return
    }

    flashPad(padIndex)

    if (sequence[inputIndex] !== padIndex) {
      finishGame('The pattern slipped away. Restart and try for a longer sequence.')
      return
    }

    const nextInputIndex = inputIndex + 1

    if (nextInputIndex === sequence.length) {
      setScore(sequence.length)
      setCanInput(false)
      setStatusMessage('Sequence cleared. One more note is joining the pattern.')
      queueTimer(() => extendSequence(sequence), 850)
      return
    }

    setInputIndex(nextInputIndex)
    setStatusMessage(`Keep going: step ${nextInputIndex + 1} of ${sequence.length}.`)
  }

  useEffect(() => () => clearTimers(), [])

  const isComplete = phase === 'complete'

  return (
    <GameShell
      completionContent={
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Longest Sequence
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{score}</p>
            <p className="mt-2 text-sm text-slate-300">
              Each successful round added one more step to the melody chain.
            </p>
          </div>
        </div>
      }
      activityResult={{ score, scoreCap: 10 }}
      completionMessage="Your score is the longest sequence you repeated correctly."
      completionTitle="Performance complete"
      description={game.summary}
      instructions={game.instructions}
      isComplete={isComplete}
      isStarted={phase !== 'idle'}
      onRestart={startGame}
      onStart={startGame}
      onActivityComplete={onActivityComplete}
      onActivityStart={onActivityStart}
      region={region}
      startLabel="Start Melody Memory"
      stats={[
        { label: 'Longest Sequence', value: `${score}` },
        { label: 'Current Round', value: `${Math.max(sequence.length, 1)}` },
        {
          label: 'Input',
          value: canInput ? `${inputIndex} / ${sequence.length}` : 'Watch',
        },
      ]}
      statusMessage={statusMessage}
      title={game.title}
    >
      <div className="space-y-6">
        <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Sequence Flow
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: Math.max(sequence.length, 1) }).map((_, index) => (
              <span
                className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs text-slate-200"
                key={`step-${index + 1}`}
              >
                Step {index + 1}
              </span>
            ))}
          </div>
        </section>

        <div className="memory-grid">
          {game.pads.map((pad, index) => {
            const isActive = activePadIndex === index

            return (
              <button
                className={`memory-pad ${isActive ? 'memory-pad--active' : ''}`}
                key={pad.id}
                onClick={() => handlePadPress(index)}
                style={{
                  '--pad-color': pad.color,
                }}
                type="button"
              >
                <span className="memory-pad__label">{pad.label}</span>
              </button>
            )
          })}
        </div>

        <p aria-live="polite" className="text-sm leading-7 text-slate-300">
          {canInput
            ? 'Input is live. Follow the same order you just watched.'
            : 'Playback is in control until the glowing pattern finishes.'}
        </p>
      </div>
    </GameShell>
  )
}
