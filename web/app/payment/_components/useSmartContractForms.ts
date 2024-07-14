import { useCallback, useEffect, useMemo, useState } from 'react';
import { Abi, TransactionExecutionError } from 'viem';
import { useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { UseContractReturn } from '@/hooks/contracts';

export enum TransactionStates {
  START,
  COMPLETE,
  OUT_OF_GAS,
}

type AsyncFunction<Args extends unknown[], ReturnType> = (...args: Args) => Promise<ReturnType>;

export default function useSmartContractForms({
  contract,
  name: functionName,
  arguments: args,
  enableSubmit: isValid,
//  reset,
}: {
  contract: UseContractReturn<Abi>;
  name: string;
  arguments: (number | string)[];
  enableSubmit: boolean;
//  reset: AsyncFunction<unknown[], unknown>;
}) {
  const [transactionState, setTransactionState] = useState<TransactionStates | null>(null);

  console.log({contract, functionName, args, isValid});

  const { data: contractRequest, error , failureReason} = useSimulateContract({
    address: contract.status === 'ready' ? contract.address : undefined,
    abi: contract.abi,
    functionName: functionName,
    args: args,
    query: {
      enabled: isValid && contract.status === 'ready',
    },
  });

  console.log({contractRequest, error, failureReason});

  const {
    writeContract,
    data: dataHash,
    status: writeContractStatus,
    error: writeContractError,
  } = useWriteContract();

  const { status: transactionReceiptStatus } = useWaitForTransactionReceipt({
    hash: dataHash,
    query: {
      enabled: !!dataHash,
    },
  });

  const disabled = contract.status !== 'ready' || writeContractStatus === 'pending';

  const onSubmitTransaction = useCallback(
    (event: { preventDefault: () => void }) => {
      //event.preventDefault();

      const request = contractRequest?.request;
      console.log('request', request);

      if (request) {
        console.log(63, "writeContract", contractRequest?.request);
        writeContract(contractRequest?.request);
        console.log(65, "setTransactionState", TransactionStates.START);
        setTransactionState(TransactionStates.START);
      } else {
        setTransactionState(null);
      }
    },
    [contractRequest, writeContract],
  );

  const resetContractForms = useCallback(() => {
    setTransactionState(null);
  }, []);

  useEffect(() => {
    async function onTransactionReceiptStatus() {
      if ((dataHash as string) === '') return;

      if (transactionReceiptStatus === 'error') {
        if (
          writeContractError instanceof TransactionExecutionError &&
          writeContractError.message.toLowerCase().includes('out of gas')
        ) {
          setTransactionState(TransactionStates.OUT_OF_GAS);
        } else {
          setTransactionState(null);
        }
      }

      if (transactionReceiptStatus === 'success') {
        setTransactionState(TransactionStates.COMPLETE);
      }

//      await reset();
    }

    void onTransactionReceiptStatus();
  }, [dataHash, /*reset,*/ setTransactionState, transactionReceiptStatus, writeContractError]);

  return useMemo(
    () => ({
      disabled,
      transactionState,
      resetContractForms,
      onSubmitTransaction,
    }),
    [onSubmitTransaction, transactionState, disabled, resetContractForms],
  );
}
