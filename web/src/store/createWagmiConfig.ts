import { SupportedChains } from 'app/payment/constants';
import { createConfig, http } from 'wagmi';
import { arbitrumSepolia, baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { sourceChainToRPC } from '@/utils/network';

export function createWagmiConfig(rpcUrl: string, projectId?: string) {
  // Keep this till we fully deprecated RK inside the template
  if (projectId) {
    console.log('projectId:', projectId);
  }

  return createConfig({
    chains: [baseSepolia, arbitrumSepolia],
    connectors: [injected()],
    ssr: true,
    transports: {
      [baseSepolia.id]: http(sourceChainToRPC(SupportedChains.base)),
      [arbitrumSepolia.id]: http(sourceChainToRPC(SupportedChains.arbitrum)),
    },
  });
}
