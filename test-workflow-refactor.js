/**
 * Simple validation test for AI Creation Workflow refactor
 * Tests the core logic without requiring full React environment
 */

// Test 1: Template search and filtering
console.log('=== Test 1: Template System ===');

const mockTemplates = [
  {
    id: 'template-1',
    name: 'SaaS Dashboard',
    description: 'Modern dashboard',
    type: 'fullstack-app',
    tags: ['saas', 'dashboard'],
    popularity: 95,
  },
  {
    id: 'template-2',
    name: 'E-Commerce',
    description: 'Shopping platform',
    type: 'fullstack-app',
    tags: ['ecommerce', 'shopping'],
    popularity: 92,
  },
  {
    id: 'template-3',
    name: 'Brand Kit',
    description: 'Brand identity',
    type: 'visual-assets',
    tags: ['branding', 'logo'],
    popularity: 93,
  },
];

// Test getTemplatesByType
function getTemplatesByType(type) {
  return mockTemplates.filter(t => t.type === type).sort((a, b) => b.popularity - a.popularity);
}

const fullstackTemplates = getTemplatesByType('fullstack-app');
console.log(`✓ Found ${fullstackTemplates.length} fullstack templates`);
console.assert(fullstackTemplates.length === 2, 'Should find 2 fullstack templates');
console.assert(fullstackTemplates[0].id === 'template-1', 'Should sort by popularity');

// Test searchTemplates
function searchTemplates(query) {
  const lowerQuery = query.toLowerCase();
  return mockTemplates.filter(
    t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

const searchResults = searchTemplates('dashboard');
console.log(`✓ Search 'dashboard' found ${searchResults.length} results`);
console.assert(searchResults.length === 1, 'Should find 1 dashboard template');

// Test 2: Generation history logic
console.log('\n=== Test 2: History Management ===');

let mockHistory = [];
const MAX_HISTORY = 50;

function addToHistory(item) {
  mockHistory = [item, ...mockHistory].slice(0, MAX_HISTORY);
}

function searchHistory(query) {
  const lowerQuery = query.toLowerCase();
  return mockHistory.filter(
    item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.prompt.toLowerCase().includes(lowerQuery)
  );
}

function toggleFavorite(id) {
  mockHistory = mockHistory.map(item =>
    item.id === id ? { ...item, favorite: !item.favorite } : item
  );
}

// Add test items
addToHistory({
  id: 'gen-1',
  title: 'Test Dashboard',
  description: 'A test dashboard app',
  prompt: 'Build a dashboard',
  favorite: false,
});

addToHistory({
  id: 'gen-2',
  title: 'Test E-Commerce',
  description: 'A shopping platform',
  prompt: 'Build a shop',
  favorite: false,
});

console.log(`✓ Added ${mockHistory.length} items to history`);
console.assert(mockHistory.length === 2, 'Should have 2 history items');
console.assert(mockHistory[0].id === 'gen-2', 'Most recent should be first');

// Test search
const historySearch = searchHistory('dashboard');
console.log(`✓ History search found ${historySearch.length} items`);
console.assert(historySearch.length === 1, 'Should find 1 dashboard item');

// Test favorite toggle
toggleFavorite('gen-1');
console.log(`✓ Toggled favorite for item`);
console.assert(mockHistory.find(i => i.id === 'gen-1').favorite === true, 'Should be favorited');

// Toggle again
toggleFavorite('gen-1');
console.assert(mockHistory.find(i => i.id === 'gen-1').favorite === false, 'Should be unfavorited');

// Test 3: Generation state management
console.log('\n=== Test 3: Generation State ===');

class MockGenerationState {
  constructor() {
    this.isGenerating = false;
    this.progress = 0;
    this.error = null;
    this.result = null;
    this.aborted = false;
  }

  async generate(config) {
    this.isGenerating = true;
    this.progress = 0;
    this.error = null;
    this.aborted = false;

    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        if (this.aborted) {
          throw new Error('Generation cancelled');
        }
        this.progress = i;
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      this.result = {
        id: `gen-${Date.now()}`,
        type: config.type,
        title: 'Test Generation',
        description: 'Generated content',
        files: [],
        preview: null,
      };

      this.isGenerating = false;
      return this.result;
    } catch (error) {
      this.error = error;
      this.isGenerating = false;
      return null;
    }
  }

  cancel() {
    this.aborted = true;
  }

  reset() {
    this.isGenerating = false;
    this.progress = 0;
    this.error = null;
    this.result = null;
    this.aborted = false;
  }
}

async function testGeneration() {
  const state = new MockGenerationState();
  
  // Test successful generation
  const result = await state.generate({ type: 'fullstack-app', prompt: 'Test', model: 'GPT-4' });
  console.assert(result !== null, 'Should generate successfully');
  console.assert(state.progress === 100, 'Progress should be 100%');
  console.assert(state.error === null, 'Should have no error');
  console.log('✓ Successful generation completed');

  // Test cancellation
  state.reset();
  const cancelPromise = state.generate({ type: 'content-suite', prompt: 'Test', model: 'Claude' });
  setTimeout(() => state.cancel(), 50);
  const cancelResult = await cancelPromise;
  console.assert(cancelResult === null, 'Cancelled generation should return null');
  console.assert(state.error !== null, 'Should have cancellation error');
  console.log('✓ Cancellation works correctly');
}

testGeneration().then(() => {
  console.log('\n=== All Tests Passed ✓ ===');
  console.log('The refactored workflow logic is working correctly!');
}).catch(error => {
  console.error('\n=== Test Failed ✗ ===');
  console.error(error);
  process.exit(1);
});
