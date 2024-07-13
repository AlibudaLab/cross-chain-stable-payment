import { baseSepolia } from 'viem/chains';
import { generateContractHook } from '@/hooks/contracts';
import TokenPortABI from './TokenPortABI';

/**
 * Returns contract data for the BuyMeACoffee contract.
 */
export const useTokenPortContract = generateContractHook({
  abi: TokenPortABI,
  [baseSepolia.id]: {
    chain: baseSepolia,
    address: '0x0c7D4Ae8ad01e521cE44d3aee1ce9acd59EE73eD',
  },

  // ... more chains for this contract go here
});
