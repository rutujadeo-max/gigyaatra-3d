const debugSprintChallenges = [
  {
    id: 'loop-boundary',
    title: 'Loop boundary bug',
    issue: 'The loop runs one step too far and tries to read past the last item.',
    snippet: `const labels = ['AI', 'Web', 'Cloud']\n\nfor (let index = 0; index <= labels.length; index += 1) {\n  console.log(labels[index])\n}`,
    options: [
      {
        id: 'loop-a',
        label: 'Change `<=` to `<` in the loop condition.',
        isCorrect: true,
      },
      {
        id: 'loop-b',
        label: 'Start `index` at `1` instead of `0`.',
        isCorrect: false,
      },
      {
        id: 'loop-c',
        label: 'Rename `labels` to `items`.',
        isCorrect: false,
      },
      {
        id: 'loop-d',
        label: 'Replace `console.log` with `alert`.',
        isCorrect: false,
      },
    ],
    explanation: 'Array indexes stop at `length - 1`, so the loop should use `<`.',
  },
  {
    id: 'auth-check',
    title: 'Access check bug',
    issue: 'The condition assigns a value instead of comparing it.',
    snippet: `const userRole = 'guest'\n\nif (userRole = 'admin') {\n  grantAccess()\n}`,
    options: [
      {
        id: 'auth-a',
        label: 'Replace `=` with `===` inside the `if` condition.',
        isCorrect: true,
      },
      {
        id: 'auth-b',
        label: 'Move `grantAccess()` above the `if` statement.',
        isCorrect: false,
      },
      {
        id: 'auth-c',
        label: 'Wrap `userRole` in curly braces.',
        isCorrect: false,
      },
      {
        id: 'auth-d',
        label: 'Change `admin` to `administrator`.',
        isCorrect: false,
      },
    ],
    explanation: 'Use `===` for comparison so the role is checked instead of overwritten.',
  },
  {
    id: 'map-return',
    title: 'Missing return value',
    issue: 'The callback uses braces, so it needs an explicit return.',
    snippet: `const scores = [2, 4, 6]\n\nconst doubled = scores.map((score) => {\n  score * 2\n})`,
    options: [
      {
        id: 'map-a',
        label: 'Add `return score * 2` inside the callback.',
        isCorrect: true,
      },
      {
        id: 'map-b',
        label: 'Change `map` to `forEach` and keep everything else.',
        isCorrect: false,
      },
      {
        id: 'map-c',
        label: 'Rename `doubled` to `scores`.',
        isCorrect: false,
      },
      {
        id: 'map-d',
        label: 'Remove the array brackets around `scores`.',
        isCorrect: false,
      },
    ],
    explanation: 'Callbacks with braces must return the new value explicitly.',
  },
  {
    id: 'password-rule',
    title: 'Validation logic bug',
    issue: 'The condition can never be true because one value cannot be both too short and too long.',
    snippet: `const isInvalidPassword = (password) => {\n  return password.length < 8 && password.length > 20\n}`,
    options: [
      {
        id: 'password-a',
        label: 'Use `||` so either invalid case triggers the rule.',
        isCorrect: true,
      },
      {
        id: 'password-b',
        label: 'Swap `8` and `20`.',
        isCorrect: false,
      },
      {
        id: 'password-c',
        label: 'Remove `return` from the function.',
        isCorrect: false,
      },
      {
        id: 'password-d',
        label: 'Wrap the whole line in a template string.',
        isCorrect: false,
      },
    ],
    explanation: 'A password is invalid when it is shorter than 8 or longer than 20.',
  },
  {
    id: 'string-method',
    title: 'Method name typo',
    issue: 'The string method name uses the wrong capitalization.',
    snippet: `const displayName = profile.username.toUppercase()`,
    options: [
      {
        id: 'string-a',
        label: 'Change `toUppercase()` to `toUpperCase()`.',
        isCorrect: true,
      },
      {
        id: 'string-b',
        label: 'Wrap `profile` in square brackets.',
        isCorrect: false,
      },
      {
        id: 'string-c',
        label: 'Call `parseInt()` before the method.',
        isCorrect: false,
      },
      {
        id: 'string-d',
        label: 'Replace the dot with a comma.',
        isCorrect: false,
      },
    ],
    explanation: 'JavaScript string methods are case-sensitive, so `toUpperCase()` is required.',
  },
]

const storyTemplate = [
  { type: 'text', value: 'At sunrise, a ' },
  { type: 'blank', key: 'adjective', label: 'adjective' },
  { type: 'text', value: ' ' },
  { type: 'blank', key: 'character', label: 'character' },
  { type: 'text', value: ' stepped into the ' },
  { type: 'blank', key: 'place', label: 'place' },
  { type: 'text', value: ' carrying a ' },
  { type: 'blank', key: 'object', label: 'object' },
  { type: 'text', value: '. By sunset, the whole crowd was talking about the ' },
  { type: 'blank', key: 'outcome', label: 'final creation' },
  { type: 'text', value: ' they had made together.' },
]

const storyWordBanks = [
  {
    key: 'adjective',
    label: 'Adjective',
    options: [
      { id: 'adjective-luminous', value: 'luminous', flair: 'vivid' },
      { id: 'adjective-playful', value: 'playful', flair: 'playful' },
      { id: 'adjective-daring', value: 'daring', flair: 'bold' },
      { id: 'adjective-gentle', value: 'gentle', flair: 'calm' },
    ],
  },
  {
    key: 'character',
    label: 'Character',
    options: [
      { id: 'character-coder', value: 'young coder', flair: 'bold' },
      { id: 'character-filmmaker', value: 'street filmmaker', flair: 'vivid' },
      { id: 'character-photographer', value: 'quiet photographer', flair: 'calm' },
      { id: 'character-designer', value: 'curious designer', flair: 'playful' },
    ],
  },
  {
    key: 'place',
    label: 'Place',
    options: [
      { id: 'place-rooftop', value: 'rooftop studio', flair: 'vivid' },
      { id: 'place-forest', value: 'forest path', flair: 'calm' },
      { id: 'place-market', value: 'neon market', flair: 'bold' },
      { id: 'place-stage', value: 'harbor stage', flair: 'playful' },
    ],
  },
  {
    key: 'object',
    label: 'Object',
    options: [
      { id: 'object-sketchbook', value: 'sketchbook', flair: 'calm' },
      { id: 'object-camera', value: 'drone camera', flair: 'bold' },
      { id: 'object-lantern', value: 'paper lantern', flair: 'vivid' },
      { id: 'object-sampler', value: 'keyboard sampler', flair: 'playful' },
    ],
  },
  {
    key: 'outcome',
    label: 'Final Creation',
    options: [
      { id: 'outcome-mural', value: 'mural', flair: 'vivid' },
      { id: 'outcome-soundtrack', value: 'soundtrack', flair: 'playful' },
      { id: 'outcome-prototype', value: 'prototype', flair: 'bold' },
      { id: 'outcome-spark', value: 'spark of hope', flair: 'calm' },
    ],
  },
]

const melodyPads = [
  { id: 'beat', label: 'Beat', color: '#8b5cf6' },
  { id: 'vocal', label: 'Vocal', color: '#a855f7' },
  { id: 'bass', label: 'Bass', color: '#7c3aed' },
  { id: 'synth', label: 'Synth', color: '#c084fc' },
]

const storyboardScenes = [
  {
    id: 'scene-hook',
    title: 'Scene 1',
    summary: 'A creator notices an empty stage and starts imagining a story.',
  },
  {
    id: 'scene-plan',
    title: 'Scene 2',
    summary: 'The first storyboard panels are sketched to shape the idea.',
  },
  {
    id: 'scene-setup',
    title: 'Scene 3',
    summary: 'Lights, camera angles, and props are arranged for the shoot.',
  },
  {
    id: 'scene-shoot',
    title: 'Scene 4',
    summary: 'The performance is recorded with several takes and close-ups.',
  },
  {
    id: 'scene-edit',
    title: 'Scene 5',
    summary: 'Clips are trimmed and layered into a polished final sequence.',
  },
  {
    id: 'scene-publish',
    title: 'Scene 6',
    summary: 'The finished video is shared and the audience starts reacting.',
  },
]

export const regionGames = {
  'tech-city': {
    title: 'Debug Sprint',
    summary: 'Read the bug, inspect the snippet, and choose the fix across five quick rounds.',
    instructions: [
      'Read the code clue and inspect the snippet.',
      'Choose the best fix before the round timer reaches zero.',
      'Finish all five rounds to lock in your final score.',
    ],
    completionTitle: 'Sprint complete',
    completionMessage: 'Every correct fix adds one point to your debugging score.',
    challenges: debugSprintChallenges,
  },
  'creativity-forest': {
    title: 'Story Spark',
    summary: 'Fill a guided story template with themed word tiles and reveal the finished scene.',
    instructions: [
      'Pick one tile for each blank category.',
      'Mix different styles to boost the creativity score.',
      'Reveal the story once every blank is filled.',
    ],
    completionTitle: 'Story revealed',
    completionMessage: 'Completion and word variety combine into a simple creativity score.',
    template: storyTemplate,
    wordBanks: storyWordBanks,
  },
  'music-island': {
    title: 'Melody Memory',
    summary: 'Watch the glowing pad sequence, then repeat it one step at a time.',
    instructions: [
      'Memorize the flashing pads during playback.',
      'Repeat the pattern with clicks, taps, or a mouse.',
      'Each successful round adds one more step to the sequence.',
    ],
    completionTitle: 'Performance complete',
    completionMessage: 'Your score is the longest sequence you repeated correctly.',
    pads: melodyPads,
  },
  'sports-valley': {
    title: 'Hurdle Runner',
    summary: 'Time your jumps, clear the obstacles, and stay moving as the valley speeds up.',
    instructions: [
      'Press the spacebar on desktop to jump.',
      'Tap the track or jump button on touch devices.',
      'Each cleared hurdle adds to your score until a collision ends the run.',
    ],
    completionTitle: 'Run complete',
    completionMessage: 'Each hurdle you clear adds one point to the final run score.',
  },
  'media-town': {
    title: 'Storyboard Shuffle',
    summary: 'Reorder a shuffled set of scene cards into the right production timeline.',
    instructions: [
      'Drag cards into a new order or use the move buttons.',
      'Submit the sequence when the story feels right.',
      'Accuracy and speed combine into the final score.',
    ],
    completionTitle: 'Storyboard checked',
    completionMessage: 'Correct positions carry most of the score, with a smaller speed bonus.',
    scenes: storyboardScenes,
  },
}

export const getGameConfigByRegionSlug = (regionSlug) => regionGames[regionSlug] ?? null
