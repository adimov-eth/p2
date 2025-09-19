import { writable } from 'svelte/store';

interface JurisdictionConfig {
  name: string;
  chainId: number;
  rpc: string;
  contracts: {
    entityProvider: string;
    depository: string;
  };
  explorer: string;
  currency: string;
  status: string;
}

interface JurisdictionsData {
  version: string;
  lastUpdated: string;
  jurisdictions: Record<string, JurisdictionConfig>;
  defaults: {
    timeout: number;
    retryAttempts: number;
    gasLimit: number;
  };
}

// Single source of truth for jurisdictions - loaded once from server
export const jurisdictions = writable<JurisdictionsData | null>(null);
export const jurisdictionsLoaded = writable(false);

let loadPromise: Promise<JurisdictionsData> | null = null;

// Load jurisdictions ONCE from server.ts (single source)
export async function loadJurisdictions(): Promise<JurisdictionsData> {
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      console.log('🔍 JURISDICTIONS: Loading ONCE from server (single source)');

      // Use server.js getAvailableJurisdictions instead of multiple fetches
      const { getXLN } = await import('../stores/xlnStore');
      const xln = await getXLN();
      const jurisdictionsList = await xln.getAvailableJurisdictions();

      // Convert to format expected by components
      const data: JurisdictionsData = {
        version: "1.0.0",
        lastUpdated: new Date().toISOString(),
        jurisdictions: {},
        defaults: {
          timeout: 30000,
          retryAttempts: 3,
          gasLimit: 1000000
        }
      };

      // Convert jurisdiction array to object format
      jurisdictionsList.forEach((j: any) => {
        const port = j.address.split(':').pop();
        data.jurisdictions[j.name.toLowerCase()] = {
          name: j.name,
          chainId: j.chainId,
          rpc: j.address,
          contracts: j.contracts,
          explorer: j.address,
          currency: j.name === 'Ethereum' ? 'ETH' : 'TOKEN',
          status: 'active'
        };
      });

      console.log('🔍 SINGLE LOAD: Loaded contracts from server:', data.jurisdictions?.ethereum?.contracts);

      jurisdictions.set(data);
      jurisdictionsLoaded.set(true);
      return data;
    } catch (error) {
      console.error('❌ Failed to load jurisdictions from server:', error);
      throw error;
    }
  })();

  return loadPromise;
}