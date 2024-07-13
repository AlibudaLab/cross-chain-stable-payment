import useOnchainCoffeeMemos from '../_hooks/useOnchainCoffeeMemos';
import FormPayment from './FormPayment';
import FormBuyCoffee from './FormTokenPort';

// import FormTokenPort from './FormTokenPort';
export default function PaymentDemo() {
  const { refetchMemos } = useOnchainCoffeeMemos();
  return (
    <div className="flex items-start justify-center pt-20">
      <FormPayment />
      <FormBuyCoffee refetchMemos={refetchMemos} />
    </div>
  );
}
