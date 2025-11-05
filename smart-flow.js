import { initToolbarInteractions } from './chrome.js';
import { applyCodexIcons } from './icons.js';

// DOM Elements
const smartOnboarding = document.getElementById('smartOnboarding');
const smartForm = document.getElementById('smartForm');
const articleTitle = document.getElementById('articleTitle');
const articleLanguage = document.getElementById('articleLanguage');
const additionalContext = document.getElementById('additionalContext');
const generateBtn = document.getElementById('generateBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const editorInterface = document.getElementById('editorInterface');
const canvas = document.getElementById('canvas');
const articleHeading = document.getElementById('articleHeading');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  applyCodexIcons();
  initToolbarInteractions();

  // Focus on title input
  setTimeout(() => {
    articleTitle.focus();
  }, 300);
});

// Form submission
smartForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = articleTitle.value.trim();
  const language = articleLanguage.value;
  const context = additionalContext.value.trim();

  if (!title) {
    showError('Please enter an article title');
    return;
  }

  hideError();
  await generateArticleOutline(title, language, context);
});

// Generate article outline using AI
async function generateArticleOutline(title, language, context) {
  // Show loading state
  generateBtn.classList.add('loading');
  generateBtn.disabled = true;
  loadingOverlay.classList.add('active');

  try {
    // Call AI service to generate outline
    const outline = await callAIService(title, language, context);

    // Hide onboarding, show editor
    setTimeout(() => {
      loadingOverlay.classList.remove('active');
      smartOnboarding.classList.add('hidden');
      editorInterface.style.display = 'block';

      // Set article heading
      articleHeading.textContent = title;

      // Populate canvas with generated outline
      populateCanvas(outline);

      // Focus on canvas
      setTimeout(() => {
        canvas.focus();
      }, 300);
    }, 1500); // Simulate AI processing time

  } catch (error) {
    console.error('Error generating outline:', error);
    loadingOverlay.classList.remove('active');
    generateBtn.classList.remove('loading');
    generateBtn.disabled = false;
    showError('Failed to generate outline. Please try again.');
  }
}

// AI Service Call (This would be a backend API in production)
async function callAIService(title, language, context) {
  // In production, this would call your backend API which would use Claude API
  // For now, we'll use intelligent template generation based on the input

  return new Promise((resolve) => {
    setTimeout(() => {
      const outline = generateIntelligentOutline(title, language, context);
      resolve(outline);
    }, 2000);
  });
}

// Intelligent outline generation based on article title and context
function generateIntelligentOutline(title, language, context) {
  const lowerTitle = title.toLowerCase();
  const lowerContext = context.toLowerCase();
  const combined = lowerTitle + ' ' + lowerContext;

  // Detect article category using keywords
  let category = detectCategory(combined);
  let sections = [];
  let introduction = '';

  // Generate category-specific sections
  if (category === 'person') {
    introduction = generatePersonIntroduction(title, context);
    sections = [
      { title: 'Early life', guidance: 'Describe their childhood, family background, and education. Include birth date and location if known.' },
      { title: 'Career', guidance: 'Detail their professional journey, major achievements, and contributions to their field.' },
      { title: 'Personal life', guidance: 'Include family, relationships, and interests outside their professional life (if publicly known).' },
      { title: 'Legacy and impact', guidance: 'Discuss their influence and how they are remembered or regarded in their field.' },
      { title: 'Awards and recognition', guidance: 'List major awards, honors, and accolades they have received.' }
    ];
  } else if (category === 'place') {
    introduction = generatePlaceIntroduction(title, context);
    sections = [
      { title: 'History', guidance: 'Describe the historical development and significant events related to this location.' },
      { title: 'Geography', guidance: 'Detail the physical characteristics, climate, and geographic features.' },
      { title: 'Demographics', guidance: 'Include population statistics and demographic information if applicable.' },
      { title: 'Culture and attractions', guidance: 'Describe cultural significance, notable landmarks, and tourist attractions.' },
      { title: 'Economy', guidance: 'Discuss the economic activities, major industries, and economic significance.' }
    ];
  } else if (category === 'technology') {
    introduction = generateTechnologyIntroduction(title, context);
    sections = [
      { title: 'History and development', guidance: 'Explain the origins and evolution of this technology.' },
      { title: 'Technical description', guidance: 'Provide technical details about how it works and its key features.' },
      { title: 'Applications', guidance: 'Describe the practical uses and applications of this technology.' },
      { title: 'Impact and significance', guidance: 'Discuss the broader impact on society, industry, or science.' },
      { title: 'Future developments', guidance: 'Mention ongoing research or potential future applications.' }
    ];
  } else if (category === 'event') {
    introduction = generateEventIntroduction(title, context);
    sections = [
      { title: 'Background', guidance: 'Provide context and circumstances leading up to the event.' },
      { title: 'Event details', guidance: 'Describe what happened, when, where, and who was involved.' },
      { title: 'Impact', guidance: 'Discuss the immediate and long-term consequences of the event.' },
      { title: 'Media coverage', guidance: 'Describe how the event was reported and perceived.' },
      { title: 'Legacy', guidance: 'Explain the lasting significance and historical importance.' }
    ];
  } else if (category === 'organization') {
    introduction = generateOrganizationIntroduction(title, context);
    sections = [
      { title: 'History', guidance: 'Describe the founding, development, and evolution of the organization.' },
      { title: 'Structure and governance', guidance: 'Explain the organizational structure, leadership, and governance.' },
      { title: 'Activities and operations', guidance: 'Detail the main activities, services, or products.' },
      { title: 'Impact and influence', guidance: 'Discuss the organization\'s significance and contributions.' },
      { title: 'Controversies and criticism', guidance: 'Include any notable controversies or criticisms (if applicable).' }
    ];
  } else if (category === 'concept') {
    introduction = generateConceptIntroduction(title, context);
    sections = [
      { title: 'Definition and overview', guidance: 'Provide a clear definition and general overview of the concept.' },
      { title: 'History and origins', guidance: 'Trace the historical development and origins of this concept.' },
      { title: 'Key principles', guidance: 'Explain the fundamental ideas and principles.' },
      { title: 'Applications', guidance: 'Describe how this concept is applied in practice.' },
      { title: 'Related concepts', guidance: 'Discuss related ideas and how they connect.' }
    ];
  } else if (category === 'sports') {
    introduction = generateSportsIntroduction(title, context);
    sections = [
      { title: 'Early career', guidance: 'Describe the beginning of their sports career and early achievements.' },
      { title: 'Professional career', guidance: 'Detail their career highlights, teams, and significant performances.' },
      { title: 'Playing style', guidance: 'Describe their distinctive techniques, strengths, and approach.' },
      { title: 'Records and statistics', guidance: 'Include notable records, statistics, and achievements.' },
      { title: 'Personal life', guidance: 'Include family, interests, and life outside of sports (if publicly known).' }
    ];
  } else {
    // Default/General article
    introduction = generateGeneralIntroduction(title, context);
    sections = [
      { title: 'Overview', guidance: 'Provide a comprehensive overview of the topic.' },
      { title: 'History', guidance: 'Describe the historical background and development.' },
      { title: 'Description', guidance: 'Provide detailed information about the subject.' },
      { title: 'Significance', guidance: 'Explain why this topic is notable or important.' },
      { title: 'See also', guidance: 'List related topics and further reading.' }
    ];
  }

  return {
    category,
    introduction,
    sections,
    language
  };
}

// Category detection based on keywords
function detectCategory(text) {
  const keywords = {
    person: ['player', 'athlete', 'actor', 'actress', 'singer', 'musician', 'scientist', 'politician', 'author', 'writer', 'artist', 'cricketer', 'footballer', 'tennis', 'born', 'died'],
    sports: ['cricket', 'football', 'soccer', 'tennis', 'basketball', 'baseball', 'hockey', 'olympic', 'championship', 'tournament', 'match', 'game'],
    place: ['city', 'country', 'town', 'village', 'mountain', 'river', 'lake', 'island', 'landmark', 'building', 'tower', 'bridge', 'monument'],
    technology: ['software', 'programming', 'computer', 'technology', 'algorithm', 'language', 'framework', 'platform', 'app', 'application', 'system', 'code'],
    event: ['war', 'battle', 'revolution', 'conference', 'summit', 'festival', 'concert', 'ceremony', 'incident', 'disaster', 'accident'],
    organization: ['company', 'corporation', 'organization', 'foundation', 'institute', 'university', 'college', 'agency', 'association', 'society'],
    concept: ['theory', 'concept', 'principle', 'philosophy', 'ideology', 'methodology', 'approach', 'model', 'framework']
  };

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => text.includes(word))) {
      return category;
    }
  }

  return 'general';
}

// Introduction generators
function generatePersonIntroduction(title, context) {
  return `<b>${title}</b> is ${context || 'a notable individual'}. This article will provide information about their life, career, and contributions.

<i>Note: Add birth date, place of birth, and current status. Include their most notable achievement or claim to fame in the first sentence.</i>`;
}

function generatePlaceIntroduction(title, context) {
  return `<b>${title}</b> is ${context || 'a significant location'}. It is known for its historical, cultural, or geographical importance.

<i>Note: Add specific location details (country, region, coordinates). Include population or size if applicable. Mention what it's best known for.</i>`;
}

function generateTechnologyIntroduction(title, context) {
  return `<b>${title}</b> is ${context || 'a technology or software'}. It is used for various applications and has made significant contributions to its field.

<i>Note: Add the type of technology, when it was created/released, and its primary purpose or use case.</i>`;
}

function generateEventIntroduction(title, context) {
  return `<b>${title}</b> was ${context || 'a significant event'}. It took place [when] and had important implications.

<i>Note: Add the specific date, location, and key participants. Explain the event's significance in the opening paragraph.</i>`;
}

function generateOrganizationIntroduction(title, context) {
  return `<b>${title}</b> is ${context || 'an organization'}. It was founded [when] and operates in [field/industry].

<i>Note: Add founding date, headquarters location, and the organization's primary mission or purpose.</i>`;
}

function generateConceptIntroduction(title, context) {
  return `<b>${title}</b> is ${context || 'a concept'} in [field]. It refers to [brief definition].

<i>Note: Provide a clear, concise definition. Explain which field or discipline this concept belongs to.</i>`;
}

function generateSportsIntroduction(title, context) {
  return `<b>${title}</b> is ${context || 'a professional athlete'}. They are known for their achievements in [sport].

<i>Note: Add birth date, current age, nationality, and the sport they play. Include their most notable achievement.</i>`;
}

function generateGeneralIntroduction(title, context) {
  return `<b>${title}</b> is ${context || 'a notable topic'}. This article provides comprehensive information about ${title}.

<i>Note: Customize this introduction based on the specific nature of your topic. Include key identifying information in the first paragraph.</i>`;
}

// Populate canvas with generated outline
function populateCanvas(outline) {
  canvas.innerHTML = '';

  // Insert introduction section
  const introSection = createSection(
    'Introduction',
    outline.introduction,
    'Write a compelling introduction that summarizes the most important aspects. Follow Wikipedia\'s Manual of Style.',
    true
  );
  canvas.appendChild(introSection);

  // Insert other sections
  outline.sections.forEach((section, index) => {
    const sectionElement = createSection(
      section.title,
      '',
      section.guidance,
      false
    );
    canvas.appendChild(sectionElement);
  });

  // Add AI badge
  const aiBadge = document.createElement('div');
  aiBadge.style.cssText = `
    margin: 2rem 0;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    font-size: 0.9375rem;
    line-height: 1.6;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  `;
  aiBadge.innerHTML = `
    <strong style="display: block; margin-bottom: 0.5rem;">✨ AI-Generated Outline</strong>
    This article structure was created by AI based on your topic. Feel free to modify, add, or remove sections as needed.
    Each section includes guidance to help you write high-quality Wikipedia content.
  `;
  canvas.appendChild(aiBadge);
}

// Create section element
function createSection(title, content, guidance, isIntro = false) {
  const section = document.createElement('div');
  section.className = 'article-section';
  section.style.cssText = `
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: white;
    border: 2px solid #eaecf0;
    border-radius: 8px;
    transition: border-color 0.2s ease;
  `;

  // Section header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #eaecf0;
  `;

  const heading = document.createElement('h2');
  heading.style.cssText = `
    font-size: 1.5rem;
    font-weight: 600;
    color: #202122;
    margin: 0;
  `;
  heading.textContent = title;
  header.appendChild(heading);

  section.appendChild(header);

  // Guidance box
  if (guidance) {
    const guidanceBox = document.createElement('div');
    guidanceBox.style.cssText = `
      background: #f8f9fa;
      border-left: 4px solid #36c;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 4px;
      font-size: 0.9375rem;
      color: #54595d;
      line-height: 1.6;
    `;
    guidanceBox.innerHTML = `
      <div style="display: flex; gap: 0.5rem; align-items: start;">
        <span style="font-size: 1.25rem;">💡</span>
        <div>
          <strong style="display: block; color: #202122; margin-bottom: 0.25rem;">Writing Guide:</strong>
          ${guidance}
        </div>
      </div>
    `;
    section.appendChild(guidanceBox);
  }

  // Content area
  const contentArea = document.createElement('div');
  contentArea.contentEditable = true;
  contentArea.style.cssText = `
    min-height: 100px;
    padding: 1rem;
    border: 1px solid #c8ccd1;
    border-radius: 4px;
    line-height: 1.6;
    font-size: 1rem;
    color: #202122;
    background: white;
  `;
  contentArea.innerHTML = content || '<p style="color: #72777d; font-style: italic;">Start writing...</p>';

  // Clear placeholder on focus
  contentArea.addEventListener('focus', function() {
    if (this.innerHTML === '<p style="color: #72777d; font-style: italic;">Start writing...</p>') {
      this.innerHTML = '';
    }
  });

  section.appendChild(contentArea);

  // Add citation button
  const citationBtn = document.createElement('button');
  citationBtn.style.cssText = `
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: white;
    color: #36c;
    border: 1px solid #36c;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  `;
  citationBtn.textContent = '+ Add Citation';
  citationBtn.addEventListener('mouseenter', function() {
    this.style.background = '#36c';
    this.style.color = 'white';
  });
  citationBtn.addEventListener('mouseleave', function() {
    this.style.background = 'white';
    this.style.color = '#36c';
  });
  citationBtn.addEventListener('click', () => {
    alert('Citation feature coming soon! For now, add [citation needed] tags where sources are required.');
  });

  section.appendChild(citationBtn);

  return section;
}

// Error handling
function showError(message) {
  errorText.textContent = message;
  errorMessage.classList.add('active');
}

function hideError() {
  errorMessage.classList.remove('active');
}

// Handle close button
document.getElementById('close')?.addEventListener('click', () => {
  if (confirm('Are you sure you want to close? Your changes will be lost.')) {
    window.location.href = 'index.html';
  }
});

// Handle submit buttons
document.getElementById('submit')?.addEventListener('click', () => {
  alert('Publish flow (prototype) - In production, this would submit your article for review.');
});

document.getElementById('submit-desktop')?.addEventListener('click', () => {
  alert('Publish flow (prototype) - In production, this would submit your article for review.');
});
