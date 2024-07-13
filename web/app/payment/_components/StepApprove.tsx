import { useCallback, useEffect } from 'react';
import { Button } from '@nextui-org/button';
import toast from 'react-hot-toast';
import { parseUnits } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract, useAccount } from 'wagmi';
import { useSimulateErc20Approve } from '@/hooks/useERC20';
import { sourceChainToViemChain } from '@/utils/network';
import { useTokenPortContract } from '../_contracts/useTokenPortContract';
import { SupportedChains } from '../constants';
import { getAssetAddress } from './utils/mapping';

type AsyncFunction<Args extends unknown[], ReturnType> = (...args: Args) => Promise<ReturnType>;

type StartApproveProps = {
  asset: string;
  amount: number;
  expectedChain: SupportedChains;
  onSuccess: AsyncFunction<unknown[], unknown>;
};

export default function StepApprove({
  asset,
  amount,
  onSuccess,
  expectedChain,
}: StartApproveProps) {
  const { chain } = useAccount();
  const contract = useTokenPortContract();

  const onCorrectNetwork = chain?.id === sourceChainToViemChain(expectedChain).id;
  console.log('onCorrectNetwork', onCorrectNetwork);
  console.log('contract', contract);
  console.log('AssetAddress: ', getAssetAddress(asset, expectedChain));
  console.log('Amount: ', parseUnits(amount.toString(), 6));

  const { data: approveData } = useSimulateErc20Approve({
    address: getAssetAddress(asset, expectedChain) as `0x${string}`,
    args: [
      (contract.status === 'ready' ? contract.address : undefined) as `0x${string}`,
      parseUnits(amount.toString(), 6),
    ],
    query: {
      enabled: onCorrectNetwork,
    },
  });

  const {
    writeContract: performApprove,
    data: dataApprove,
    error: errorApprove,
    isPending: isPendingApprove,
  } = useWriteContract();

  const { status: transactionStatus, isLoading: isWaitForApprove } = useWaitForTransactionReceipt({
    hash: dataApprove,
    query: {
      enabled: !!dataApprove,
    },
  });

  useEffect(() => {
    const onTransactionReceiptStatus = async () => {
      if (transactionStatus === 'success') {
        toast.success('Approved!', {
          id: 'approve',
        });
        await onSuccess();
      }

      if (errorApprove) {
        console.error('Approve error', errorApprove);
        toast.error('Error approving', {
          id: 'approve',
        });
      }
    };

    onTransactionReceiptStatus().catch(console.error);
  }, [transactionStatus, errorApprove, onSuccess]);

  const handleApprove = useCallback(() => {
    if (approveData?.request) {
      performApprove?.(approveData?.request);
      toast.loading('Approving...', { id: 'approve' });
    }
  }, [approveData, performApprove]);

  return (
    <Button
      className="flex w-full items-center justify-center py-6"
      radius="full"
      onClick={handleApprove}
      isLoading={isPendingApprove || isWaitForApprove}
      isDisabled={isPendingApprove || isWaitForApprove}
    >
      Approve {amount} USDC
    </Button>
  );
}
