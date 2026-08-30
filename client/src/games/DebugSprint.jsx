import { useEffect, useEffectEvent, useRef, useState } from 'react'

import { GameShell } from './GameShell'

const ROUND_DURATION = 18

export const DebugSprint = ({ game, onActivityComplete, onActivityStart, region }) => {
  const [phase, setPhase] = useState('idle')
  const [roundIndex, setRoundIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION)
  const [selectedOptionId, setSelectedOptionId] = useState(null)
  const [feedback, setFeedback] = useState('Pick the best fix before the timer reaches zero.')
  const transitionTimeoutRef = useRef(null)

  const totalRounds = game.challenges.length
  const currentChallenge = game.challenges[roundIndex]

  const clearTransitionTimeout = () => {
    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current)
      transitionTimeoutRef.current = null
    }
  }

  const scheduleNextRound = (nextRound) => {
    transitionTimeoutRef.current = window.setTimeout(() => {
      if (nextRound >= totalRounds) {
        setPhase('complete')
        return
      }

      setRoundIndex(nextRound)
      setTimeLeft(ROUND_DURATION)
      setSelectedOptionId(null)
      setFeedback(`Round ${nextRound + 1} is ready. Stay sharp and keep shipping fixes.`)
    }, 950)
  }

  const startGame = () => {
    clearTransitionTimeout()
    setPhase('playing')
    setRoundIndex(0)
    setScore(0)
    setTimeLeft(ROUND_DURATION)
    setSelectedOptionId(null)
    setFeedback('Round 1 is live. Read the clue, inspect the snippet, and choose the fix.')
  }

  const resolveRound = (optionId) => {
    if (phase !== 'playing' || selectedOptionId) {
      return
    }

    clearTransitionTimeout()

    const correctOption = currentChallenge.options.find((option) => option.isCorrect)
    const selectedOption = currentChallenge.options.find((option) => option.id === optionId)
    const isCorrect = Boolean(selectedOption?.isCorrect)

    setSelectedOptionId(optionId ?? 'timeout')
    setScore((currentScore) => currentScore + (isCorrect ? 1 : 0))
    setFeedback(
      isCorrect
        ? `Correct. ${currentChallenge.explanation}`
        : optionId
          ? `Not quite. ${correctOption.label} ${currentChallenge.explanation}`
          : `Time ran out. ${correctOption.label} ${currentChallenge.explanation}`,
    )
    scheduleNextRound(roundIndex + 1)
  }

  const handleTimeExpiry = useEffectEvent(() => {
    if (phase !== 'playing' || selectedOptionId) {
      return
    }

    clearTransitionTimeout()

    const correctOption = currentChallenge.options.find((option) => option.isCorrect)

    setSelectedOptionId('timeout')
    setFeedback(`Time ran out. ${correctOption.label} ${currentChallenge.explanation}`)
    scheduleNextRound(roundIndex + 1)
  })

  useEffect(() => () => clearTransitionTimeout(), [])

  useEffect(() => {
    if (phase !== 'playing' || selectedOptionId) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      if (timeLeft <= 1) {
        handleTimeExpiry()
        return
      }

      setTimeLeft((currentTime) => Math.max(currentTime - 1, 0))
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [phase, selectedOptionId, timeLeft])

  const timerWidth = `${(timeLeft / ROUND_DURATION) * 100}%`
  const isComplete = phase === 'complete'
  const accuracy = totalRounds > 0 ? Math.round((score / totalRounds) * 100) : 0

  return (
    <GameShell
      completionContent={
        <div className="space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Final Score
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{score} / 5</p>
            <p className="mt-2 text-sm text-slate-300">{accuracy}% debugging accuracy</p>
          </div>
          <p className="text-sm leading-7 text-slate-300">
            Each round used static local challenge data so the sprint stays fast and reliable.
          </p>
        </div>
      }
      activityResult={{ score, scoreCap: totalRounds }}
      completionMessage="Every correct fix counted toward your final debugging score."
      completionTitle="Sprint complete"
      description={game.summary}
      instructions={game.instructions}
      isComplete={isComplete}
      isStarted={phase !== 'idle'}
      onRestart={startGame}
      onStart={startGame}
      onActivityComplete={onActivityComplete}
      onActivityStart={onActivityStart}
      region={region}
      startLabel="Start Debug Sprint"
      stats={[
        { label: 'Score', value: `${score}` },
        { label: 'Round', value: `${Math.min(roundIndex + 1, totalRounds)} / ${totalRounds}` },
        { label: 'Timer', value: `${timeLeft}s` },
      ]}
      statusMessage={feedback}
      title={game.title}
    >
      {isComplete ? (
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm leading-7 text-slate-300">
              Debug Sprint recap: five local bug-fix rounds covering loops, conditions, array
              callbacks, validation logic, and method names.
            </p>
          </div>

          <div className="grid gap-4">
            {game.challenges.map((challenge, index) => {
              const correctOption = challenge.options.find((option) => option.isCorrect)

              return (
                <div
                  className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5"
                  key={challenge.id}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Round {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{challenge.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{challenge.issue}</p>
                  <p className="mt-3 text-sm font-medium text-[var(--game-accent)]">
                    Best fix: {correctOption.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Round {roundIndex + 1} of {totalRounds}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{currentChallenge.title}</h2>
              </div>
              <p className="text-sm font-semibold text-[var(--game-accent)]">{timeLeft}s left</p>
            </div>

            <div className="game-progress-track mt-4">
              <div className="game-progress-fill" style={{ width: timerWidth }} />
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">{currentChallenge.issue}</p>
          </div>

          <pre className="game-code-block rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5 text-sm leading-7 text-slate-100">
            <code>{currentChallenge.snippet}</code>
          </pre>

          <div className="grid gap-3">
            {currentChallenge.options.map((option) => {
              const isSelected = selectedOptionId === option.id
              const showCorrect = selectedOptionId && option.isCorrect
              const shouldDim = selectedOptionId && !isSelected && !option.isCorrect

              return (
                <button
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 text-left text-sm leading-6 text-slate-100 transition hover:border-white/25 hover:bg-white/10 disabled:cursor-default"
                  disabled={Boolean(selectedOptionId)}
                  key={option.id}
                  onClick={() => resolveRound(option.id)}
                  style={{
                    borderColor: showCorrect
                      ? 'var(--game-accent)'
                      : isSelected && !option.isCorrect
                        ? '#fb7185'
                        : undefined,
                    backgroundColor: showCorrect
                      ? 'rgba(96, 165, 250, 0.14)'
                      : isSelected && !option.isCorrect
                        ? 'rgba(251, 113, 133, 0.16)'
                        : undefined,
                    opacity: shouldDim ? 0.72 : 1,
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </GameShell>
  )
}
