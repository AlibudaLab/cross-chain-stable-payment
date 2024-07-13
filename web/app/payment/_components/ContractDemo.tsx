import FormPayment from './FormPayment';

export default function PaymentDemo() {
  return (
    <div className="space-y-6">      
      {/* Container for the FormPayment component */}
      <div className="rounded-lg border border-solid border-gray-700 bg-gray-900 p-6">
        <div className="flex justify-center items-center h-48">
          <FormPayment />
        </div>
      </div>
    </div>
  );
}