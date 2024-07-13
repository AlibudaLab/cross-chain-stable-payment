import { useCallback, useEffect, useState } from 'react';
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
  Snippet,
} from '@nextui-org/react';
import { useSearchParams } from 'next/navigation';
import QRCode from 'react-qr-code';
import { parseEther, formatUnits, parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { useBuyMeACoffeeContract } from '../_contracts/useBuyMeACoffeeContract';
import useERC20Allowance from '../_hooks/useERC20Allowance';
import useERC20Balance from '../_hooks/useERC20Balance';
import useFields from '../_hooks/useFields';
import { SupportedChains } from '../constants';
import StepApprove from './StepApprove';
import TransactionSteps from './TransactionSteps';
import useSmartContractForms from './useSmartContractForms';

const BASE_URL = 'http://localhost:3000/payment';
const GAS_COST = 0;

// uint64 destinationChainSelector,
// address receiver,
// string calldata message, default empty
// address token, default USDC
// uint256 amount
const initFields = {
  sender: '',
  receiver: '',
  sourceChain: SupportedChains.base,
  destinationChain: SupportedChains.arbitrum,
  amount: 10,
};

type Fields = {
  sender: string;
  receiver: string;
  sourceChain: SupportedChains;
  destinationChain: SupportedChains;
  amount: number;
};

function FormPayment() {
  const { address } = useAccount();
  const [showQRCode, setShowQRCode] = useState(false);
  const searchParams = useSearchParams();
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const {
    isOpen: isReceiveOpen,
    onOpen: onReceiveOpen,
    onOpenChange: onReceiveOpenChange,
  } = useDisclosure();

  const contract = useBuyMeACoffeeContract();

  const { fields, setField, resetFields } = useFields<Fields>(initFields);

  const { balance } = useERC20Balance('usdc', fields.destinationChain);
  console.log('Balance:', balance);
  const { allowance, refetchAllowance } = useERC20Allowance('usdc', fields.sourceChain);
  const requireAllowance = (allowance ?? BigInt(0)) < parseUnits(fields.amount.toString(), 6);
  console.log('Allowance:', allowance);

  const approveSuccess = useCallback(async () => {
    await refetchAllowance();
  }, [refetchAllowance]);

  const chainMap: Record<string, SupportedChains> = {
    arbitrumSepolia: SupportedChains.arbitrum,
    baseSepolia: SupportedChains.base,
    // Add other mappings here if you have more chains
  };

  const mapShortcutToChainKey = (shortcut: string): SupportedChains => {
    return chainMap[shortcut] ?? SupportedChains.base; // Default to base if not found
  };

  useEffect(() => {
    if (fields.sender === '' && address !== undefined) {
      setField('sender', address as string);
    }

    if (fields.receiver === '' && address !== undefined) {
      setField('receiver', address as string);
    }
  }, [address, fields.receiver, fields.sender, setField]);


  useEffect(() => {
    const receiverAddr = searchParams.get('address');
    const amount = searchParams.get('amount');
    const destinationChainShortcut = searchParams.get('destinationChain');

    if (receiverAddr && amount && destinationChainShortcut) {
      setField('receiver', receiverAddr);
      setField('amount', Number(amount));

      const destinationChainKey = mapShortcutToChainKey(destinationChainShortcut);
      setField('destinationChain', destinationChainKey);

      setIsSendModalOpen(true);
    }
  }, [searchParams, setField]);

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

  const generatePaymentLink = () => {
    const params = new URLSearchParams();
    params.append('address', fields.receiver ?? address ?? '');
    params.append('amount', fields.amount.toString());
    params.append('destinationChain', fields.destinationChain);
    return `${BASE_URL}?${params.toString()}`;
  };

  const handleCloseModal = useCallback(() => {
    setShowQRCode(false);
    onReceiveOpenChange(); // This will toggle the modal state
  }, [onReceiveOpenChange]);

  const handleSend = useCallback(() => {
    // Implement send logic here
    console.log(
      'Sending',
      fields.amount,
      'to',
      fields.receiver,
      'from',
      fields.sourceChain,
      'to',
      fields.destinationChain,
    );
    setIsSendModalOpen(false);
  }, [fields]);

  const handleReject = useCallback(() => {
    setIsSendModalOpen(false);
  }, []);

  console.log('fields: ', fields);

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
    {
      key: SupportedChains.arbitrum,
      shortcut: 'arbitrumSepolia',
      label: 'Arbitrum Sepolia',
      ccipChainId: '3478487238524512106',
      tokenAddress: "",
      balance: 63,
    },
    {
      key: SupportedChains.base,
      shortcut: 'baseSepolia',
      label: 'Base Sepolia',
      ccipChainId: '10344971235874465080',
      tokenAddress: "",
      balance: 45,
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-6">
      <Select
        className="w-full"
        defaultSelectedKeys={[fields.destinationChain]}
        onChange={(e) => setField('destinationChain', e.target.value as SupportedChains)}
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
        <h2 className="mt-1 text-4xl font-bold">${formatUnits(balance, 6)}</h2>
      </div>

      <Button
        onPress={onReceiveOpen}
        color="primary"
        className="w-full px-12 py-3 text-lg font-semibold"
        radius="full"
      >
        Request
      </Button>
      <Modal
        isOpen={isReceiveOpen}
        onOpenChange={(open) => {
          if (!open) setShowQRCode(false);
          onReceiveOpenChange();
        }}
        placement="top-center"
      >
        <ModalContent className="text-white dark">
          {() =>
            !showQRCode ? (
              // Request form content
              <>
                <ModalHeader className="flex flex-col items-center gap-1 pb-6">
                  <div className="mb-4 rounded-full bg-gray-700 p-4">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h2 className="text-2xl font-bold">Request Money from Your Friend</h2>
                  <p className="text-sm text-gray-400">
                    We will generate the QR code and link based on the amount you request.
                  </p>
                </ModalHeader>
                <ModalBody className="pb-6">
                  <Input
                    autoFocus
                    label="Amount"
                    placeholder="Enter amount"
                    variant="bordered"
                    type="number"
                    value={fields.amount.toString()}
                    onChange={(e) => setField('amount', Number(e.target.value))}
                    className="bg-gray-800"
                  />
                </ModalBody>
                <ModalFooter className="flex w-full flex-col pb-6">
                  <Button
                    color="primary"
                    onPress={() => setShowQRCode(true)}
                    className="mb-3 h-12 w-full text-lg"
                  >
                    Request
                  </Button>
                  <Button
                    color="default"
                    variant="flat"
                    onPress={handleCloseModal}
                    className="h-12 w-full text-lg"
                  >
                    Cancel
                  </Button>
                </ModalFooter>
              </>
            ) : (
              // QR code view
              <ModalBody className="flex flex-col items-center pb-6 pt-8">
                <div className="mb-6">
                  <QRCode value={generatePaymentLink()} size={256} />
                </div>
                <div className="mb-8 text-center">
                  <h3 className="mb-2 text-xl font-semibold">Scan or Copy to Send</h3>
                  <Snippet
                    symbol=""
                    variant="bordered"
                    className="max-w-full bg-gray-800"
                    codeString={generatePaymentLink()} // Full link for copying
                  >
                    <span className="whitespace-normal break-all">{generatePaymentLink()}</span>
                  </Snippet>
                </div>
                <div className="w-full">
                  <Button
                    color="default"
                    variant="flat"
                    onPress={handleCloseModal}
                    className="h-12 w-full text-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </ModalBody>
            )
          }
        </ModalContent>
      </Modal>
      <Modal isOpen={isSendModalOpen} onOpenChange={setIsSendModalOpen} placement="top-center">
        <ModalContent className="text-black dark:text-white">
          <>
            <ModalHeader className="flex flex-col gap-1">
              {`Requesting $${fields.amount}`}
            </ModalHeader>
            <ModalBody>
              <p>Select a network and send the amount.</p>
              <Select
                label="Select a Network"
                selectedKeys={[fields.sourceChain]}
                onChange={(e) => setField('sourceChain', e.target.value as SupportedChains)}
              >
                {chains.map((chain) => (
                  <SelectItem key={chain.key} value={chain.key}>
                    {`${chain.label} (Balance: $${chain.balance})`}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              {
              requireAllowance ? (
              <StepApprove
                asset='usdc'
                amount={fields.amount}
                expectedChain={fields.sourceChain}
                onSuccess={approveSuccess}
              /> ) : (
                <>
              <Button color="primary" onPress={handleSend} className="w-full">
                Send
              </Button>
              <Button color="danger" variant="light" onPress={handleReject} className="w-full">
                Reject
              </Button> 
              </>
              )
              }
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default FormPayment;
