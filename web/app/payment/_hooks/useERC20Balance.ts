import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useReadErc20BalanceOf } from '@/hooks/useERC20';
import { sourceChainToViemChain } from '@/utils/network';
import { getAssetAddress } from '../_components/utils/mapping';
import { SupportedChains } from '../constants';

/**
 * Hooks is abstracting away the logic of calling a read-only function on a contract.
 * offers a refetch function to refetch the data.
 * @returns The memos and a function to refetch them.
 */
function useERC20Balance(asset: string, expectedChain: SupportedChains) {
  const { address } = useAccount();

  const contractReadResult = useReadErc20BalanceOf({
    address: getAssetAddress(asset, expectedChain) as `0x${string}`,
    args: [address as `0x${string}`],
    chainId: sourceChainToViemChain(expectedChain).id,
  });

  return useMemo(
    () => ({
      balance: contractReadResult.status === 'success' ? contractReadResult.data : BigInt(0),
      refetchBalance: contractReadResult.refetch,
    }),
    [contractReadResult],
  );
}

export default useERC20Balance;
