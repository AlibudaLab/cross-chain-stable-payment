import { SymbolIcon } from '@radix-ui/react-icons';
import Button from '@/components/Button/Button';
import TransactionStep from './TransactionStep';
import { TransactionStates } from './useSmartContractForms';

type TransactionStepsProps = {
  transactionStep: TransactionStates | null;
  gasCost: number;
  resetContractForms: () => void;
};

export default function TransactionSteps({
  transactionStep,
  resetContractForms: resetContractForms,
  gasCost,
}: TransactionStepsProps) {
  if (transactionStep === TransactionStates.START) {
    return (
      <TransactionStep
        status="Request Sending..."
        icon="🕊️"
        helpText="Please confirm transaction in your wallet"
      >
        <Button
          buttonContent={<span>Transaction pending</span>}
          icon={<SymbolIcon width={15} height={15} />}
          variant="secondary"
        />
      </TransactionStep>
    );
  }

  if (transactionStep === TransactionStates.COMPLETE) {
    return (
      <TransactionStep
        status="You sent the request for payment!"
        icon="🎁"
        helpText="Thank you!"
      >
        <Button buttonContent="Send request" onClick={resetContractForms} />
      </TransactionStep>
    );
  }

  if (transactionStep === TransactionStates.OUT_OF_GAS) {
    return (
      <TransactionStep
        status="You are out of gas"
        icon="⛽"
        helpText={`Please fund your wallet with at least ${String(
          gasCost,
        )} ETH and try sending a request again.`}
      >
        <Button buttonContent="Got it" onClick={resetContractForms} />
      </TransactionStep>
    );
  }

  if (transactionStep === null) {
    return null;
  }

  throw Error('Missing TransactionStates handler');
}
