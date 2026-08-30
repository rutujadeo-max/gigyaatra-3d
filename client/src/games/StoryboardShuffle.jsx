import { useEffect, useMemo, useState } from 'react'

import { GameShell } from './GameShell'

const shuffleArray = (items) => {
  const nextItems = [...items]

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]]
  }

  return nextItems
}

const buildShuffledScenes = (scenes) => {
  const orderedIds = scenes.map((scene) => scene.id).join('|')
  let candidate = shuffleArray(scenes)

  while (candidate.map((scene) => scene.id).join('|') === orderedIds) {
    candidate = shuffleArray(scenes)
  }

  return candidate
}

export const StoryboardShuffle = ({ game, onActivityComplete, onActivityStart, region }) => {
  const [phase, setPhase] = useState('idle')
  const [cards, setCards] = useState([])
  const [draggedId, setDraggedId] = useState(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [result, setResult] = useState(null)

  const liveMatches = useMemo(
    () =>
      cards.reduce(
        (count, card, index) => count + Number(card.id === game.scenes[index]?.id),
        0,
      ),
    [cards, game.scenes],
  )

  const startGame = () => {
    setCards(buildShuffledScenes(game.scenes))
    setDraggedId(null)
    setElapsedSeconds(0)
    setResult(null)
    setPhase('playing')
  }

  const reorderCards = (sourceId, targetId) => {
    if (!sourceId || sourceId === targetId) {
      return
    }

    setCards((currentCards) => {
      const sourceIndex = currentCards.findIndex((card) => card.id === sourceId)
      const targetIndex = currentCards.findIndex((card) => card.id === targetId)

      if (sourceIndex === -1 || targetIndex === -1) {
        return currentCards
      }

      const nextCards = [...currentCards]
      const [movedCard] = nextCards.splice(sourceIndex, 1)
      nextCards.splice(targetIndex, 0, movedCard)

      return nextCards
    })
  }

  const moveCard = (cardId, direction) => {
    setCards((currentCards) => {
      const currentIndex = currentCards.findIndex((card) => card.id === cardId)

      if (currentIndex === -1) {
        return currentCards
      }

      const nextIndex = direction === 'earlier' ? currentIndex - 1 : currentIndex + 1

      if (nextIndex < 0 || nextIndex >= currentCards.length) {
        return currentCards
      }

      const nextCards = [...currentCards]
      ;[nextCards[currentIndex], nextCards[nextIndex]] = [
        nextCards[nextIndex],
        nextCards[currentIndex],
      ]

      return nextCards
    })
  }

  const submitOrder = () => {
    const correctPositions = cards.reduce(
      (count, card, index) => count + Number(card.id === game.scenes[index]?.id),
      0,
    )
    const accuracyScore = Math.round((correctPositions / game.scenes.length) * 80)
    const speedBonus = Math.max(0, 20 - Math.min(20, Math.floor(elapsedSeconds / 3)))
    const totalScore = accuracyScore + speedBonus

    setResult({
      correctPositions,
      accuracyScore,
      speedBonus,
      totalScore,
    })
    setPhase('complete')
  }

  useEffect(() => {
    if (phase !== 'playing') {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((currentSeconds) => currentSeconds + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [phase])

  const isComplete = phase === 'complete'

  return (
    <GameShell
      completionContent={
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Score Breakdown
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{result?.totalScore ?? 0}</p>
            <p className="mt-2 text-sm text-slate-300">
              Accuracy: {result?.accuracyScore ?? 0}. Speed bonus: {result?.speedBonus ?? 0}.
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Correct Story Order
            </p>
            <div className="mt-3 space-y-3">
              {game.scenes.map((scene, index) => (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3" key={scene.id}>
                  <p className="text-sm font-semibold text-white">
                    {index + 1}. {scene.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{scene.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      activityResult={{ score: result?.totalScore ?? 0, scoreCap: 100 }}
      completionMessage="Accuracy carried most of the score, with a smaller bonus for speed."
      completionTitle="Storyboard checked"
      description={game.summary}
      instructions={game.instructions}
      isComplete={isComplete}
      isStarted={phase !== 'idle'}
      onRestart={startGame}
      onStart={startGame}
      onActivityComplete={onActivityComplete}
      onActivityStart={onActivityStart}
      region={region}
      startLabel="Start Storyboard Shuffle"
      stats={[
        { label: 'Score', value: isComplete ? `${result?.totalScore ?? 0}` : '--' },
        { label: 'Timer', value: `${elapsedSeconds}s` },
        {
          label: 'Correct Spots',
          value: `${isComplete ? result?.correctPositions ?? 0 : liveMatches} / ${game.scenes.length}`,
        },
      ]}
      statusMessage={
        isComplete
          ? 'The board has been scored. Restart to reshuffle and try a faster, cleaner sequence.'
          : 'Drag the scenes into order or use the move buttons, then submit the timeline.'
      }
      title={game.title}
    >
      <div className="space-y-5">
        <div className="space-y-4">
          {cards.map((card, index) => (
            <section
              className={`storyboard-card ${draggedId === card.id ? 'storyboard-card--dragging' : ''}`}
              draggable={!isComplete}
              key={card.id}
              onDragOver={(event) => event.preventDefault()}
              onDragStart={() => setDraggedId(card.id)}
              onDrop={() => {
                reorderCards(draggedId, card.id)
                setDraggedId(null)
              }}
              onDragEnd={() => setDraggedId(null)}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Position {index + 1}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-white">{card.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{card.summary}</p>
                </div>

                {!isComplete && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-100 transition hover:border-white/25"
                      onClick={() => moveCard(card.id, 'earlier')}
                      type="button"
                    >
                      Move Earlier
                    </button>
                    <button
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-100 transition hover:border-white/25"
                      onClick={() => moveCard(card.id, 'later')}
                      type="button"
                    >
                      Move Later
                    </button>
                  </div>
                )}
              </div>
            </section>
          ))}
        </div>

        {!isComplete && (
          <button
            className="rounded-full bg-[var(--game-accent)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            onClick={submitOrder}
            type="button"
          >
            Submit Storyboard
          </button>
        )}
      </div>
    </GameShell>
  )
}
