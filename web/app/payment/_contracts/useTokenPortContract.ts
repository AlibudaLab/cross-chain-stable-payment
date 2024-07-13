import { baseSepolia, arbitrumSepolia } from 'viem/chains';
import { generateContractHook } from '@/hooks/contracts';
import TokenPortABI from './TokenPortABI';

/**
 * Returns contract data for the BuyMeACoffee contract.
 */
export const useTokenPortContract = generateContractHook({
  abi: TokenPortABI,
  [baseSepolia.id]: {
    chain: baseSepolia,
    address: '0xfa4b5afe76F6ff8a90FB983e94303C976a21FB9D',
  },
  [arbitrumSepolia.id]: {
    chain: arbitrumSepolia,
    address: '0x7ABc649AFBA6ffc0fa867D0d32e8E655d3987187',
  },

  // ... more chains for this contract go here
});
