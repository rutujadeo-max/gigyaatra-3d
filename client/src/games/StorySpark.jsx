import { useMemo, useState } from 'react'

import { GameShell } from './GameShell'

const calculateCreativityScore = (selections, totalBlanks) => {
  const selectedWords = Object.values(selections)
  const completionScore = Math.round((selectedWords.length / totalBlanks) * 70)
  const varietyScore = Math.min(30, new Set(selectedWords.map((item) => item.flair)).size * 10)

  return completionScore + varietyScore
}

export const StorySpark = ({ game, onActivityComplete, onActivityStart, region }) => {
  const [phase, setPhase] = useState('idle')
  const [selections, setSelections] = useState({})
  const [score, setScore] = useState(0)

  const totalBlanks = game.wordBanks.length
  const filledCount = Object.keys(selections).length
  const varietyCount = useMemo(
    () => new Set(Object.values(selections).map((item) => item.flair)).size,
    [selections],
  )

  const startGame = () => {
    setPhase('playing')
    setSelections({})
    setScore(0)
  }

  const chooseWord = (categoryKey, option) => {
    if (phase !== 'playing') {
      return
    }

    setSelections((currentSelections) => ({
      ...currentSelections,
      [categoryKey]: option,
    }))
  }

  const revealStory = () => {
    if (filledCount !== totalBlanks) {
      return
    }

    setScore(calculateCreativityScore(selections, totalBlanks))
    setPhase('complete')
  }

  const isComplete = phase === 'complete'

  return (
    <GameShell
      completionContent={
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Creativity Score
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{score} / 100</p>
            <p className="mt-2 text-sm text-slate-300">
              Completion delivered 70 points, and mixing {varietyCount} distinct word styles added
              the rest.
            </p>
          </div>
        </div>
      }
      activityResult={{ score, scoreCap: 100 }}
      completionMessage="Completion and variety were combined into one simple creativity score."
      completionTitle="Story revealed"
      description={game.summary}
      instructions={game.instructions}
      isComplete={isComplete}
      isStarted={phase !== 'idle'}
      onRestart={startGame}
      onStart={startGame}
      onActivityComplete={onActivityComplete}
      onActivityStart={onActivityStart}
      region={region}
      startLabel="Start Story Spark"
      stats={[
        { label: 'Creativity Score', value: isComplete ? `${score}` : '--' },
        { label: 'Blanks Filled', value: `${filledCount} / ${totalBlanks}` },
        { label: 'Styles Mixed', value: `${varietyCount}` },
      ]}
      statusMessage={
        isComplete
          ? 'Your completed story is locked in. Restart anytime to try a new combination.'
          : 'Fill every blank, then reveal the finished story to see your creativity score.'
      }
      title={game.title}
    >
      <div className="space-y-6">
        <section className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Story Template
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-lg leading-9 text-slate-100">
            {game.template.map((part) =>
              part.type === 'text' ? (
                <span key={part.value}>{part.value}</span>
              ) : (
                <span className="story-blank" key={part.key}>
                  {selections[part.key]?.value ?? part.label}
                </span>
              ),
            )}
          </div>
        </section>

        {isComplete ? (
          <section className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Final Story
            </p>
            <p className="mt-3 text-base leading-8 text-slate-100">
              At sunrise, a {selections.adjective?.value} {selections.character?.value} stepped
              into the {selections.place?.value} carrying a {selections.object?.value}. By sunset,
              the whole crowd was talking about the {selections.outcome?.value} they had made
              together.
            </p>
          </section>
        ) : (
          <>
            <div className="grid gap-4">
              {game.wordBanks.map((bank) => (
                <section
                  className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5"
                  key={bank.key}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                        {bank.label}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        Choose the word tile that best fits this blank.
                      </p>
                    </div>
                    {selections[bank.key] && (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                        Selected: {selections[bank.key].value}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {bank.options.map((option) => {
                      const isSelected = selections[bank.key]?.id === option.id

                      return (
                        <button
                          className="story-tile rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-white/25 hover:bg-white/10"
                          key={option.id}
                          onClick={() => chooseWord(bank.key, option)}
                          style={{
                            borderColor: isSelected ? 'var(--game-accent)' : undefined,
                            backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.12)' : undefined,
                          }}
                          type="button"
                        >
                          {option.value}
                        </button>
                      )
                    })}
                  </div>
                </section>
              ))}
            </div>

            <button
              className="rounded-full bg-[var(--game-accent)] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={filledCount !== totalBlanks}
              onClick={revealStory}
              type="button"
            >
              Reveal Completed Story
            </button>
          </>
        )}
      </div>
    </GameShell>
  )
}
