import { useCallback } from 'react';
import { parseEther } from 'viem';
import Button from '@/components/Button/Button';
import { useTokenPortContract } from '../_contracts/useTokenPortContract';
import useFields from '../_hooks/useFields';
import useOnchainCoffeeMemos from '../_hooks/useOnchainCoffeeMemos'; // TODO
import ContractAlert from './ContractAlert';
import InputText from './InputText';
import Label from './Label';
import Select from './Select';
import TextArea from './TextArea';
import TransactionSteps from './TransactionSteps';
import useSmartContractForms from './useSmartContractForms';

const GAS_COST = 0.0001;

const CHAIN_SELECTORS = {
  'Ethereum Sepolia': '16015286601757825753',
  'Optimism Goerli': '2664363617261496610',
  'Arbitrum Goerli': '6101244977088475029',
  'Avalanche Fuji': '14767482510784806043',
  'Polygon Mumbai': '12532609583862916517',
  'BNB Chain Testnet': '13264668187771770619',
  'Base Goerli': '5790810961207155433',
  'Base Sepolia': '10344971235874465080',
};

const initFields = {
  destinationChainSelector: '',
  receiver: '0x0c7D4Ae8ad01e521cE44d3aee1ce9acd59EE73eD',
  message: 'lfg',
  token: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  amount: '1',
};

type Fields = {
  destinationChainSelector: string;
  receiver: string;
  message: string;
  token: string;
  amount: string;
};

type FormTokenPortProps = {
  refetchMemos: ReturnType<typeof useOnchainCoffeeMemos>['refetchMemos'];
};

function FormTokenPort({ refetchMemos }: FormTokenPortProps) {
  const contract = useTokenPortContract();

  const { fields, setField, resetFields } = useFields<Fields>(initFields);

  const reset = useCallback(async () => {
    resetFields();
    await refetchMemos();
  }, [refetchMemos, resetFields]);

  const { disabled, transactionState, resetContractForms, onSubmitTransaction } =
    useSmartContractForms({
      gasFee: parseEther(String(GAS_COST)),
      contract,
      name: 'TokenPort',
      arguments: [
        fields.destinationChainSelector,
        fields.receiver,
        fields.message,
        fields.token,
        parseEther(fields.amount),
      ],
      enableSubmit: fields.receiver.length > 0 && fields.token.length > 0 && 
        parseFloat(fields.amount) > 0 && fields.destinationChainSelector !== '',
      reset,
    });

  const handleChainSelectorChange = useCallback((evt: React.ChangeEvent<HTMLSelectElement>) => {
    setField('destinationChainSelector', evt.target.value);
  }, [setField]);

  const handleInputChange = useCallback((fieldName: keyof Fields) => (evt: { target: { value: string } }) => {
    setField(fieldName, evt.target.value);
  }, [setField]);

  if (transactionState !== null) {
    return (
      <TransactionSteps
        transactionStep={transactionState}
        resetContractForms={resetContractForms}
        gasCost={GAS_COST}
      />
    );
  }

    return (
      <>
        <h2 className="mb-5 w-full text-center text-2xl font-semibold text-white lg:text-left">
          Token Port
        </h2>
        <form onSubmit={onSubmitTransaction} className="w-full">
          <div>
            <div className="mb-5">
              <Label htmlFor="destinationChainSelector">Destination Chain</Label>
              <Select
                id="destinationChainSelector"
                value={fields.destinationChainSelector}
                onChange={handleChainSelectorChange}
                disabled={false}
                required
              >
                <option value="">Select a chain</option>
                {Object.entries(CHAIN_SELECTORS).map(([name, value]) => (
                  <option key={value} value={value}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="mb-5">
              <Label htmlFor="receiver">Receiver Address</Label>
              <InputText
                id="receiver"
                placeholder="0x..."
                value={fields.receiver}
                onChange={handleInputChange('receiver')}
                disabled={false}
                required
              />
            </div>

            <div className="mb-5">
              <Label htmlFor="message">Message</Label>
              <TextArea
                id="message"
                placeholder="Enter your message"
                value={fields.message}
                onChange={handleInputChange('message')}
                disabled={false}
                required
              />
            </div>

            <div className="mb-5">
              <Label htmlFor="token">Token Address</Label>
              <InputText
                id="token"
                placeholder="0x..."
                value={fields.token}
                onChange={handleInputChange('token')}
                disabled={false}
                required
              />
            </div>

            <div className="mb-5">
              <Label htmlFor="amount">Amount</Label>
              <InputText
                id="amount"
                type="number"
                step="0.000000000000000001"
                placeholder="0.0"
                value={fields.amount}
                onChange={handleInputChange('amount')}
                disabled={false}
                required
              />
            </div>

            <ContractAlert contract={contract} amount={GAS_COST} />

            <Button
              buttonContent="Send Token"
              type="submit"
              disabled={false}
            />
          </div>
        </form>
      </>
    );
  }

export default FormTokenPort;
