import { useCallback, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
  Input,
} from '@nextui-org/react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { useBuyMeACoffeeContract } from '../_contracts/useBuyMeACoffeeContract';
import useFields from '../_hooks/useFields';
import TransactionSteps from './TransactionSteps';
import useSmartContractForms from './useSmartContractForms';

const GAS_COST = 0;

const initFields = {
  sender: '',
  receiver: '',
  sourceChain: 'baseSepolia',
  destinationChain: 'arbitrumSepolia',
  amount: 0,
};

type Fields = {
  sender: string;
  receiver: string;
  sourceChain: string;
  destinationChain: string;
  amount: number;
};

function FormPayment() {
  const { address } = useAccount();

  const {
    isOpen: isReceiveOpen,
    onOpen: onReceiveOpen,
    onOpenChange: onReceiveOpenChange,
  } = useDisclosure();
  const { isOpen: isSendOpen, onOpenChange: onSendOpenChange } = useDisclosure();

  const contract = useBuyMeACoffeeContract();

  const { fields, setField, resetFields } = useFields<Fields>(initFields);

  useEffect(() => {
    if (fields.sender === '' && address !== undefined) {
      setField('sender', address as string);
    }
  }, [address, fields.sender, setField]);

  const reset = useCallback(async () => {
    resetFields();
  }, [resetFields]);

  const { transactionState, resetContractForms /*, onSubmitTransaction, disabled*/ } =
    useSmartContractForms({
      gasFee: parseEther(String(GAS_COST * fields.amount)),
      contract,
      name: 'buyCoffee',
      arguments: [],
      enableSubmit: fields.sender !== '',
      reset,
    });

  if (transactionState !== null) {
    return (
      <TransactionSteps
        transactionStep={transactionState}
        coffeeCount={fields.amount}
        resetContractForms={resetContractForms}
        gasCost={GAS_COST}
      />
    );
  }

  const chains = [
    { key: 'arbitrumSepolia', label: 'Arbitrum Sepolia' },
    { key: 'baseSepolia', label: 'Base Sepolia' },
  ];

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6">
      <Select
        className="w-full"
        defaultSelectedKeys={[fields.sourceChain]}
        onChange={(e) => setField('sourceChain', e.target.value)}
        variant="underlined"
      >
        {chains.map((chain) => (
          <SelectItem key={chain.key}>{chain.label}</SelectItem>
        ))}
      </Select>

      <div className="w-full text-center">
        <p className="text-lg">
          {address ? address.slice(0, 6) + '...' + address.slice(-4) : 'Connect Wallet'}
        </p>
        <p className="mt-2 text-xl">Your Balance</p>
        <h2 className="mt-1 text-4xl font-bold">${45}</h2>
      </div>

      <Button
        onPress={onReceiveOpen}
        color="primary"
        className="w-full px-12 py-3 text-lg font-semibold"
        radius="full"
      >
        Request
      </Button>
      <Modal isOpen={isReceiveOpen} onOpenChange={onReceiveOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Request USDC</ModalHeader>
              <ModalBody>
                <Input autoFocus label="Email" placeholder="Enter your email" variant="bordered" />
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Send Request
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isSendOpen} onOpenChange={onSendOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Send USDC</ModalHeader>
              <ModalBody>
                <Input autoFocus label="Email" placeholder="Enter your email" variant="bordered" />
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Finish Request
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default FormPayment;
