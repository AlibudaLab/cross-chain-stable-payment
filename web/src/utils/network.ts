import { arbitrumSepolia, baseSepolia } from 'viem/chains';
import { SupportedChains } from '../../app/payment/constants';

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

// todo: add mainnet rpcs
export const sourceChainToRPC = (chain: SupportedChains) => {
  switch (chain) {
    case SupportedChains.arbitrum:
      return `https://arb-sepolia.g.alchemy.com/v2/${alchemyApiKey}`;
    case SupportedChains.base:
      return `https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`;
    default:
      throw new Error(`Unsupported chain: ${chain}`);
  }
};

export const sourceChainToViemChain = (chain: SupportedChains) => {
  switch (chain) {
    case SupportedChains.arbitrum:
      return arbitrumSepolia;
    case SupportedChains.base:
      return baseSepolia;
    default:
      throw new Error(`Unsupported chain: ${chain}`);
  }
};
