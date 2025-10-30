import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const initializeMock = vi.fn();
const getApiKeyMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock('@/services/APIKeyService', () => ({
  APIKeyService: {
    initialize: initializeMock,
    getApiKey: getApiKeyMock,
  },
}));

vi.mock('sonner@2.0.3', () => ({
  toast: {
    error: toastErrorMock,
    success: vi.fn(),
  },
}));

describe('AIService', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    localStorage.clear();
    initializeMock.mockResolvedValue(undefined);
    getApiKeyMock.mockImplementation(async (provider: string) => {
      if (provider === 'openai') return 'test-openai-key';
      if (provider === 'anthropic') return 'test-anthropic-key';
      return null;
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('returns only models with configured providers', async () => {
    const { AIService } = await import('@/services/AIService');

    const models = await AIService.getAvailableModels();
    const providers = new Set(models.map(model => model.provider));

    expect(models.length).toBeGreaterThan(0);
    providers.forEach(provider => {
      expect(['openai', 'anthropic']).toContain(provider);
    });
  });

  it('persists selected model information when API keys are present', async () => {
    const { AIService } = await import('@/services/AIService');

    await AIService.setModel('gpt-4-turbo');

    expect(localStorage.getItem('ff_selected_ai_model')).toBe('gpt-4-turbo');
    expect(localStorage.getItem('ff_selected_ai_provider')).toBe('openai');
  });

  it('throws if a model is chosen without a configured provider', async () => {
    const { AIService } = await import('@/services/AIService');

    await expect(AIService.setModel('gemini-1.5-pro')).rejects.toThrow(
      /API key not configured for google/
    );
  });

  it('generates code using the configured provider and strips code fences', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        choices: [
          {
            message: {
              content: '```tsx\nconst ExampleComponent = () => <div>Hello</div>\n```',
            },
          },
        ],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }),
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const { AIService } = await import('@/services/AIService');

    AIService.setApiKey('openai', 'test-openai-key');
    await AIService.setModel('gpt-4-turbo');

    const code = await AIService.generateCode({
      type: 'component',
      framework: 'React',
      requirements: 'Render a friendly greeting',
    });

    expect(code).toContain('const ExampleComponent');
    expect(code).not.toMatch(/```/);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({ method: 'POST' })
    );
    expect(toastErrorMock).not.toHaveBeenCalled();
  });
});
