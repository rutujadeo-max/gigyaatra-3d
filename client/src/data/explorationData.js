export const explorationRegions = {
  'tech-city': {
    label: 'Tech City',
    accent: '#60a5fa',
    skills: ['Programming', 'Problem solving', 'Artificial Intelligence', 'Cybersecurity', 'Logical thinking'],
    interestLabel: 'Technology & problem solving',
    scoreCap: 5,
  },
  'creativity-forest': {
    label: 'Creativity Forest',
    accent: '#34d399',
    skills: ['Writing', 'Design', 'Photography', 'Creativity', 'Storytelling'],
    interestLabel: 'Creative expression & storytelling',
    scoreCap: 100,
  },
  'music-island': {
    label: 'Music Island',
    accent: '#c084fc',
    skills: ['Singing', 'Music', 'Rhythm', 'Instruments', 'Music Production'],
    interestLabel: 'Music & performance',
    scoreCap: 10,
  },
  'sports-valley': {
    label: 'Sports Valley',
    accent: '#fb923c',
    skills: ['Fitness', 'Running', 'Sports', 'Yoga', 'Physical coordination'],
    interestLabel: 'Movement & fitness',
    scoreCap: 10,
  },
  'media-town': {
    label: 'Media Town',
    accent: '#f472b6',
    skills: ['Animation', 'Video Editing', 'Content Creation', 'Storytelling', 'Visual Production'],
    interestLabel: 'Media & content creation',
    scoreCap: 100,
  },
}

export const enjoymentOptions = [
  { value: 'loved', label: 'Loved it' },
  { value: 'enjoyed', label: 'Enjoyed it' },
  { value: 'okay', label: 'It was okay' },
  { value: 'not-for-me', label: 'Not for me' },
]

export const explorationPaths = {
  software: {
    title: 'Software Development',
    relatedRegions: ['tech-city'],
    description: 'Build practical digital tools through programming and problem solving.',
    steps: ['Try small programming exercises', 'Learn one language deeply', 'Build a simple web project', 'Join coding challenges or hackathons', 'Share projects in a portfolio'],
  },
  ux: {
    title: 'UI/UX & Creative Technology',
    relatedRegions: ['tech-city', 'creativity-forest'],
    description: 'Bring technology and visual storytelling together to create useful experiences.',
    steps: ['Notice how everyday apps solve problems', 'Learn basic design and prototyping tools', 'Redesign one small screen or flow', 'Ask for feedback from real users', 'Collect your best work in a portfolio'],
  },
  game: {
    title: 'Game & Interactive Development',
    relatedRegions: ['tech-city', 'media-town'],
    description: 'Combine code, visual timing, and storytelling in interactive projects.',
    steps: ['Play games with a designer\'s eye', 'Learn a beginner game engine or web tools', 'Build one tiny playable idea', 'Join a game jam or creative coding challenge', 'Document what you make'],
  },
  writing: {
    title: 'Writing & Visual Storytelling',
    relatedRegions: ['creativity-forest'],
    description: 'Develop ideas into stories, images, and thoughtful creative work.',
    steps: ['Write short stories or observations', 'Study visual storytelling you enjoy', 'Practice photography or design basics', 'Join a creative challenge', 'Build a small portfolio'],
  },
  music: {
    title: 'Music & Performance',
    relatedRegions: ['music-island'],
    description: 'Explore rhythm, performance, instruments, or music production at your own pace.',
    steps: ['Listen across different genres', 'Try regular rhythm or vocal exercises', 'Learn an instrument or beginner production tool', 'Record your progress', 'Join a music group or local event'],
  },
  fitness: {
    title: 'Fitness & Coaching',
    relatedRegions: ['sports-valley'],
    description: 'Build movement confidence through consistent practice and learning.',
    steps: ['Try a few sports or movement styles', 'Create a realistic weekly routine', 'Learn recovery and fitness fundamentals', 'Join a club or class', 'Track progress and share what helps you learn'],
  },
  media: {
    title: 'Video & Content Creation',
    relatedRegions: ['media-town'],
    description: 'Shape stories for an audience through editing, animation, and visual production.',
    steps: ['Study how a favorite video is structured', 'Learn a free editing tool', 'Edit a short practice video', 'Ask for feedback and iterate', 'Build a small content portfolio'],
  },
  filmmaker: {
    title: 'Filmmaking & Creative Direction',
    relatedRegions: ['creativity-forest', 'media-town'],
    description: 'Connect imagination, story structure, and visual production.',
    steps: ['Watch scenes with the sound off and study the story', 'Learn storyboarding basics', 'Make a one-minute video with friends', 'Practice simple editing and sound choices', 'Share selected work in a portfolio'],
  },
  dance: {
    title: 'Dance & Performance',
    relatedRegions: ['music-island', 'sports-valley'],
    description: 'Explore rhythm, movement, and physical expression together.',
    steps: ['Try a few beginner dance styles', 'Practice for 20 to 30 minutes a few days each week', 'Learn from tutorials or a local class', 'Join a college club or workshop', 'Record progress and participate when ready'],
  },
  fitnessMedia: {
    title: 'Fitness Content Creation',
    relatedRegions: ['sports-valley', 'media-town'],
    description: 'Pair movement knowledge with clear, encouraging visual communication.',
    steps: ['Learn safe fitness fundamentals', 'Practice explaining one simple movement', 'Make a short practice video', 'Ask for feedback on clarity', 'Build a helpful series or portfolio'],
  },
  musicMedia: {
    title: 'Music Content Creation',
    relatedRegions: ['music-island', 'media-town'],
    description: 'Use music, performance, and visual production to share creative work.',
    steps: ['Explore performers and music videos you admire', 'Practice a short performance or remix', 'Learn simple recording and editing', 'Share a small project with trusted people', 'Build a collection of your best work'],
  },
}

export const regionCombinations = [
  { regions: ['tech-city', 'creativity-forest'], pathIds: ['ux'] },
  { regions: ['tech-city', 'media-town'], pathIds: ['game'] },
  { regions: ['music-island', 'media-town'], pathIds: ['musicMedia'] },
  { regions: ['sports-valley', 'media-town'], pathIds: ['fitnessMedia'] },
  { regions: ['creativity-forest', 'media-town'], pathIds: ['filmmaker'] },
  { regions: ['music-island', 'sports-valley'], pathIds: ['dance'] },
]

export const resourceActions = ['Watch beginner tutorials', 'Take a course', 'Join a community', 'Attend a class', 'Participate in events', 'Build projects', 'Create a portfolio']
