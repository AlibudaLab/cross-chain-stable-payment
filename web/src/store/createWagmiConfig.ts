import { createConfig, http } from 'wagmi';
import { base, baseSepolia, arbitrumSepolia } from 'wagmi/chains';
import { /*coinbaseWallet,*/ injected } from 'wagmi/connectors';

export function createWagmiConfig(rpcUrl: string, projectId?: string) {
  // Keep this till we fully deprecated RK inside the template
  if (projectId) {
    console.log('projectId:', projectId);
  }

  return createConfig({
    chains: [baseSepolia, arbitrumSepolia],
    //connectors: [
      //injected(),
      // coinbaseWallet({
      //   appName: 'buildonchainapps',
      //   preference: 'smartWalletOnly',
      // }),
    //],
    multiInjectedProviderDiscovery: false,
    ssr: true,
    transports: {
      [baseSepolia.id]: http(),
      [arbitrumSepolia.id]: http(),
    },
  });
}
