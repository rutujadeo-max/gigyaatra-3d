import { Link } from 'react-router-dom'

import { SuggestionPanel } from '../components/suggestions/SuggestionPanel'
import { getExplorationAnalysis } from '../lib/explorationEngine'
import { loadActivityData, saveActivityFeedback } from '../lib/activityStorage'
import { useAuthStore } from '../store/authStore'
import '../styles/exploration.css'
import { useState } from 'react'

export const ExplorationPage = () => {
  const user = useAuthStore((state) => state.user)
  const [activityData, setActivityData] = useState(() => loadActivityData(user))
  const analysis = getExplorationAnalysis(activityData)

  const handleFeedback = (regionSlug, enjoyment) => {
    setActivityData(saveActivityFeedback(user, regionSlug, enjoyment))
  }

  return (
    <main className="exploration-page">
      <div className="exploration-container">
        <header className="exploration-hero">
          <div>
            <p className="exploration-eyebrow">My Exploration</p>
            <h1>Discover patterns in what you play</h1>
            <p>Use an Ikigai-inspired lens to connect what you enjoy, what you are developing, and directions you could explore next.</p>
          </div>
          <Link className="exploration-back" to="/dashboard">Back to dashboard</Link>
        </header>
        <SuggestionPanel analysis={analysis} onFeedback={handleFeedback} />
      </div>
    </main>
  )
}
