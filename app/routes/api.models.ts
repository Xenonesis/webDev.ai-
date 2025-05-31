import { json } from '@remix-run/cloudflare';
import { LLMManager } from '~/lib/modules/llm/manager';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { ProviderInfo } from '~/types/model';
import { getApiKeysFromCookie, getProviderSettingsFromCookie } from '~/lib/api/cookies';

interface ModelsResponse {
  modelList: ModelInfo[];
  providers: ProviderInfo[];
  defaultProvider: ProviderInfo;
}

let cachedProviders: ProviderInfo[] | null = null;
let cachedDefaultProvider: ProviderInfo | null = null;

function getProviderInfo(llmManager: LLMManager) {
  if (!cachedProviders) {
    cachedProviders = llmManager.getAllProviders().map((provider) => ({
      name: provider.name,
      staticModels: provider.staticModels,
      getApiKeyLink: provider.getApiKeyLink,
      labelForGetApiKey: provider.labelForGetApiKey,
      icon: provider.icon,
    }));
  }

  if (!cachedDefaultProvider) {
    const defaultProvider = llmManager.getDefaultProvider();
    cachedDefaultProvider = {
      name: defaultProvider.name,
      staticModels: defaultProvider.staticModels,
      getApiKeyLink: defaultProvider.getApiKeyLink,
      labelForGetApiKey: defaultProvider.labelForGetApiKey,
      icon: defaultProvider.icon,
    };
  }

  return { providers: cachedProviders, defaultProvider: cachedDefaultProvider };
}

export async function loader({
  request,
  params,
  context,
}: {
  request: Request;
  params: { provider?: string };
  context: {
    cloudflare?: {
      env: Record<string, string>;
    };
  };
}): Promise<Response> {
  try {
    console.log('Models API called with params:', params);

    const llmManager = LLMManager.getInstance(context.cloudflare?.env);

    // Get client side maintained API keys and provider settings from cookies
    const cookieHeader = request.headers.get('Cookie');
    const apiKeys = getApiKeysFromCookie(cookieHeader);
    const providerSettings = getProviderSettingsFromCookie(cookieHeader);

    const { providers, defaultProvider } = getProviderInfo(llmManager);

    let modelList: ModelInfo[] = [];

    if (params.provider) {
      // Only update models for the specific provider
      const provider = llmManager.getProvider(params.provider);

      if (provider) {
        modelList = await llmManager.getModelListFromProvider(provider, {
          apiKeys,
          providerSettings,
          serverEnv: context.cloudflare?.env,
        });
      }
    } else {
      // Update all models
      modelList = await llmManager.updateModelList({
        apiKeys,
        providerSettings,
        serverEnv: context.cloudflare?.env,
      });
    }

    console.log('Models API completed successfully, returning', modelList.length, 'models');

    return json<ModelsResponse>({
      modelList,
      providers,
      defaultProvider,
    });
  } catch (error) {
    console.error('Models API error:', error);
    console.error('Error details:', error instanceof Error ? error.stack : error);

    // Return a fallback response with empty models but valid providers
    try {
      const llmManager = LLMManager.getInstance(context.cloudflare?.env);
      const { providers, defaultProvider } = getProviderInfo(llmManager);

      return json<ModelsResponse>({
        modelList: [],
        providers,
        defaultProvider,
      });
    } catch (fallbackError) {
      console.error('Fallback error in models API:', fallbackError);
      return new Response(
        JSON.stringify({
          error: 'Failed to load models',
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
  }
}
