import { useCallback } from 'react';
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
import { useBuyMeACoffeeContract } from '../_contracts/useBuyMeACoffeeContract';
import useFields from '../_hooks/useFields';
import TransactionSteps from './TransactionSteps';
import useSmartContractForms from './useSmartContractForms';

const GAS_COST = 0;

const initFields = {
  name: '',
  twitterHandle: '',
  message: '',
  coffeeCount: 1,
};

type Fields = {
  name: string;
  twitterHandle: string;
  coffeeCount: number;
  message: string;
};

function FormPayment() {
  const {
    isOpen: isReceiveOpen,
    onOpen: onReceiveOpen,
    onOpenChange: onReceiveOpenChange,
  } = useDisclosure();

  const contract = useBuyMeACoffeeContract();

  const { fields, /*setField,*/ resetFields } = useFields<Fields>(initFields);

  const reset = useCallback(async () => {
    resetFields();
  }, [resetFields]);

  const { transactionState, resetContractForms/*, onSubmitTransaction, disabled*/ } =
    useSmartContractForms({
      gasFee: parseEther(String(GAS_COST * fields.coffeeCount)),
      contract,
      name: 'buyCoffee',
      arguments: [fields.coffeeCount, fields.name, fields.twitterHandle, fields.message],
      enableSubmit: fields.name !== '' && fields.message !== '',
      reset,
    });

  if (transactionState !== null) {
    return (
      <TransactionSteps
        transactionStep={transactionState}
        coffeeCount={fields.coffeeCount}
        resetContractForms={resetContractForms}
        gasCost={GAS_COST}
      />
    );
  }

  const chains = [
    {key: "arbitrumSepolia", label: "Arbitrum Sepolia"},
    {key: "baseSepolia", label: "Base Sepoloa"},
  ];

  return (
    <>
      <Button 
        onPress={onReceiveOpen} 
        color="primary"
        className="px-8 py-3 text-lg font-semibold"
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
              <Select 
                label="Select an animal" 
                className="max-w-xs" 
              >
                {chains.map((chain) => (
                  <SelectItem key={chain.key}>
                    {chain.label}
                  </SelectItem>
                ))}
              </Select>
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
      <Button 
        onPress={onReceiveOpen} 
        color="primary"
        className="px-8 py-3 text-lg font-semibold"
        radius="full"
      >
        Send
      </Button>
      <Modal isOpen={isReceiveOpen} onOpenChange={onReceiveOpenChange} placement="top-center">
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
    </>
  );
}

export default FormPayment;