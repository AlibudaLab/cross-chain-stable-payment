import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useReadErc20Allowance } from '@/hooks/useERC20';
import { sourceChainToViemChain } from '@/utils/network';
import { getAssetAddress } from '../_components/utils/mapping';
import { useTokenPortContract } from '../_contracts/useTokenPortContract';
import { SupportedChains } from '../constants';

/**
 * Hooks is abstracting away the logic of calling a read-only function on a contract.
 * offers a refetch function to refetch the data.
 * @returns The memos and a function to refetch them.
 */
function useERC20Allowance(asset: string, expectedChain: SupportedChains) {
  const { address } = useAccount();
  const contract = useTokenPortContract();

  const contractReadResult = useReadErc20Allowance({
    address: getAssetAddress(asset, expectedChain) as `0x${string}`,
    args: [
      address as `0x${string}`,
      (contract.status === 'ready' ? contract.address : undefined) as `0x${string}`,
    ],
    chainId: sourceChainToViemChain(expectedChain).id,
  });

  return useMemo(
    () => ({
      allowance: contractReadResult.status === 'success' ? contractReadResult.data : BigInt(0),
      refetchAllowance: contractReadResult.refetch,
    }),
    [contractReadResult],
  );
}

export default useERC20Allowance;
