import { useConnect} from 'wagmi';
import { DynamicWidget } from '@/lib/dynamic';

/**
 * AccountConnect
 *  - Connects to the wallet
 *  - Disconnects from the wallet
 *  - Displays the wallet network
 */
function AccountConnect() {
  const { status } = useConnect();

  return (
    <div
      className="flex flex-grow"
      {...(status === 'pending' && {
        'aria-hidden': true,
        style: {
          opacity: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        },
      })}
    >
      {(() => {
        return (
          <DynamicWidget innerButtonComponent={<button>Connect Wallet</button>}>
            {/* ... rest of your app ... */}
          </DynamicWidget>
        ); /*(
          <>
            <div className="flex flex-grow flex-col md:hidden">
              <AccountInfoPanel />
            </div>
            <div className="flex hidden md:block">
              <AccountDropdown />
            </div>
          </>
        )*/
      })()}
    </div>
  );
}

export default AccountConnect;
