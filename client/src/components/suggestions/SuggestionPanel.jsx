import { useState } from 'react'
import { Link } from 'react-router-dom'

import { ActivityComparison } from './ActivityComparison'
import { ActivityFeedback } from './ActivityFeedback'
import { ActionRoadmap } from './ActionRoadmap'
import { ExplorationProfile } from './ExplorationProfile'
import { SuggestionCard } from './SuggestionCard'

export const SuggestionPanel = ({ analysis, onFeedback }) => {
  const [selectedPathId, setSelectedPathId] = useState(null)
  const selectedPath = analysis.paths.find((path) => path.id === selectedPathId) ?? analysis.paths[0]

  if (analysis.explored.length === 0) {
    return (
      <section className="exploration-empty">
        <p className="exploration-eyebrow">Start Your Exploration Journey</p>
        <h1>0/5 regions explored</h1>
        <p>Play activities across different regions to discover the interests and combinations you may enjoy exploring.</p>
      </section>
    )
  }

  return (
    <div className="exploration-panel">
      <ExplorationProfile explored={analysis.explored} />
      <ActivityComparison regions={analysis.regions} />
      <section className="exploration-card">
        <p className="exploration-eyebrow">What You May Enjoy</p>
        <h2 className="exploration-heading">Possible directions to try</h2>
        <p className="exploration-copy">These ideas are based on your in-app activity. They are invitations to explore, not career decisions.</p>
        <div className="suggestion-grid">
          {analysis.paths.map((path) => <SuggestionCard isSelected={selectedPath?.id === path.id} key={path.id} onSelect={setSelectedPathId} path={path} />)}
        </div>
      </section>
      <ActionRoadmap path={selectedPath} />
      <section className="exploration-card">
        <p className="exploration-eyebrow">Next Step</p>
        <h2 className="exploration-heading">Explore possible gigs</h2>
        <p className="exploration-copy">See beginner-friendly ways to build experience around the paths and activities you are exploring.</p>
        <Link className="exploration-action inline-block" to="/gigs">Explore possible gigs</Link>
      </section>
      <ActivityFeedback onFeedback={onFeedback} regions={analysis.regions} />
    </div>
  )
}
