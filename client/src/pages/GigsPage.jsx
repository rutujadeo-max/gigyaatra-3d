import { useState } from 'react'
import { Link } from 'react-router-dom'

import { GigCard } from '../components/gigs/GigCard'
import { GigDetails } from '../components/gigs/GigDetails'
import { GigFilters } from '../components/gigs/GigFilters'
import { getExplorationAnalysis } from '../lib/explorationEngine'
import { getGigRecommendations } from '../lib/gigRecommendationEngine'
import { loadGigData, toggleGigRoadmapStep, toggleSavedGig } from '../lib/gigStorage'
import { loadActivityData } from '../lib/activityStorage'
import { useAuthStore } from '../store/authStore'
import '../styles/gigs.css'

export const GigsPage = () => {
  const user = useAuthStore((state) => state.user)
  const [gigData, setGigData] = useState(() => loadGigData(user))
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedGigId, setSelectedGigId] = useState(null)
  const analysis = getExplorationAnalysis(loadActivityData(user))
  const recommendations = getGigRecommendations(analysis)
  const selectedGig = recommendations.find((gig) => gig.id === selectedGigId) ?? null
  const visibleGigs = recommendations.filter((gig) => activeCategory === 'All' || gig.category === activeCategory)
  const savedGigs = recommendations.filter((gig) => gigData.savedGigIds.includes(gig.id))

  const handleSave = (gigId) => setGigData((current) => toggleSavedGig(user, current, gigId))
  const handleStep = (stepIndex) => setGigData((current) => toggleGigRoadmapStep(user, current, selectedGig.id, stepIndex))

  return (
    <main className="gigs-page">
      <div className="gigs-container">
        <header className="gigs-hero">
          <div><p className="gig-eyebrow">Your Possible Gigs</p><h1>Turn curiosity into a first step</h1><p>Discover beginner-friendly ways to build skills and experience around the interests you are exploring in GigYaatra.</p></div>
          <Link className="gigs-back" to="/exploration">Back to My Exploration</Link>
        </header>
        {analysis.explored.length === 0 ? (
          <section className="gigs-empty"><p className="gig-eyebrow">Start Exploring Your World</p><h2>0/5 regions explored</h2><p>Complete activities across different regions to discover possible gigs connected to your interests.</p><Link className="gig-primary-action" to="/world">Explore the world</Link></section>
        ) : (
          <>
            <section className="gigs-intro"><p className="gig-eyebrow">Your Top Interests</p><div>{analysis.explored.slice(0, 3).map((region) => <span key={region.slug} style={{ '--gig-accent': region.accent }}>{region.interestLabel}</span>)}</div></section>
            <section className="gigs-section"><p className="gig-eyebrow">Recommended For You</p><h2>Potential gigs to explore</h2><p>These are not live job listings or qualifications. They are practical, beginner-friendly directions connected to your activity.</p><GigFilters activeCategory={activeCategory} onChange={setActiveCategory} /><div className="gig-grid">{visibleGigs.map((gig) => <GigCard gig={gig} isSaved={gigData.savedGigIds.includes(gig.id)} key={gig.id} onExplore={setSelectedGigId} onSave={handleSave} />)}</div>{visibleGigs.length === 0 && <p className="gigs-no-results">No suggested gigs match this category yet. Explore another category or play more regions.</p>}</section>
            {savedGigs.length > 0 && <section className="gigs-section"><p className="gig-eyebrow">My Saved Gigs</p><h2>Return to ideas that interested you</h2><div className="gig-grid">{savedGigs.map((gig) => <GigCard gig={gig} isSaved key={gig.id} onExplore={setSelectedGigId} onSave={handleSave} />)}</div></section>}
            <GigDetails completedSteps={selectedGig ? gigData.progressByGig[selectedGig.id] ?? [] : []} gig={selectedGig} isSaved={selectedGig ? gigData.savedGigIds.includes(selectedGig.id) : false} onClose={() => setSelectedGigId(null)} onSave={handleSave} onToggleStep={handleStep} />
          </>
        )}
      </div>
    </main>
  )
}
