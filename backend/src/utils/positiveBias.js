function makeDecisionWithBias(options, positiveScore) {
  if (!options || options.length === 0) {
    throw new Error('No options provided');
  }

  const weights = options.map(option => {
    let weight = 1;
    const positiveKeywords = ['learn', 'health', 'creative', 'help', 'friend', 'family', 'nature', 'art', 'music', 'sports', 'travel', 'grow', 'improve', 'practice', 'study', 'read', 'write', 'cook', 'exercise', 'meditate', 'career', 'skill', 'fitness', 'hobby', 'code', 'build', 'design'];
    for (const keyword of positiveKeywords) {
      const regex = new RegExp('\\b' + keyword + '\\b', 'i');
      if (regex.test(option)) weight += 0.5;
    }
    if (option.length > 25) weight += 0.2;
    if (option.length > 50) weight += 0.1;
    return weight;
  });

  const biasBonus = Math.min(positiveScore / 100, 0.5);
  const adjustedWeights = weights.map(w => w * (1 + biasBonus));
  const totalWeight = adjustedWeights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  let selectedIndex = 0;
  let accumulatedWeight = 0;

  for (let i = 0; i < adjustedWeights.length; i++) {
    accumulatedWeight += adjustedWeights[i];
    if (random <= accumulatedWeight) {
      selectedIndex = i;
      break;
    }
  }

  return options[selectedIndex];
}

function generateReason(selectedOption, mode) {
  const openers = [
    '✨', '🎯', '💡', '🌟', '🌈', '🎨', '🌻', '⭐', '🔥', '💎'
  ];
  const opener = openers[Math.floor(Math.random() * openers.length)];

  if (mode === 'yes_no') {
    if (selectedOption === 'Yes') {
      const reasons = [
        'Absolutely yes! This decision opens wonderful opportunities.',
        'Yes! Your heart is guiding you in the right direction.',
        'The answer is YES — embrace this positive path!',
        'Definitely YES! Great things await with this choice.',
        'Yes! Trust your instincts on this one.'
      ];
      return reasons[Math.floor(Math.random() * reasons.length)];
    } else {
      const reasons = [
        'Not now — and that is perfectly okay. Trust the timing.',
        'No — sometimes the best decision is to wait.',
        'The answer is no for now. Something better may come.',
        'Not this time. Redirect your energy elsewhere.',
        'No — and that is a positive choice too.'
      ];
      return reasons[Math.floor(Math.random() * reasons.length)];
    }
  }

  const reasonTemplates = [
    opener + ' {option} aligns perfectly with your goals and energy.',
    opener + ' The clearest path forward is {option}.',
    opener + ' {option} brings the most joy and growth into your life.',
    opener + ' Go with {option} — your intuition knows best.',
    opener + ' {option} opens wonderful new doors for you.',
    opener + ' All signs point to {option}. Great choice!',
    opener + ' {option} stands out as the most aligned option.',
    opener + ' Trust this — {option} is meant for you.',
    opener + ' The positive energy around {option} is undeniable.',
    opener + ' {option} leads to the most fulfilling outcome.'
  ];

  const template = reasonTemplates[Math.floor(Math.random() * reasonTemplates.length)];
  return template.replace('{option}', selectedOption);
}

module.exports = { makeDecisionWithBias, generateReason };
