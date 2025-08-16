import { BaseProvider, getOpenAILikeModel } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';

export default class ChutesProvider extends BaseProvider {
  name = 'WebDev (Free)';
  getApiKeyLink = undefined; // No API key needed since it's free

  config = {
    baseUrl: 'https://llm.chutes.ai/v1',
    // No API key configuration needed
  };

  staticModels: ModelInfo[] = [
    {
      name: 'zai-org/GLM-4.5-Air',
      label: 'Claude 4 (Free)',
      provider: this.name,
      maxTokenAllowed: 8000,
    },
  ];

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model } = options;

    // Use hardcoded values for free service
    const baseUrl = 'https://llm.chutes.ai/v1';
    const apiKey = 'cpk_5872af9cbffc432f96e821da9a402c4c.b387316ab5425cf69f617e4328a3c322.CqR5sx6EoO3i3NLdzTjtLrJgxddXVWTx';

    return getOpenAILikeModel(baseUrl, apiKey, model);
  }
}