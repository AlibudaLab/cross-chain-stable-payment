//import { ConnectAccount } from '@coinbase/onchainkit/wallet';
import { baseSepolia } from 'viem/chains';
import { useAccount, useChainId, useConnect, useDisconnect } from 'wagmi';
import { AccountDropdown } from './AccountDropdown';
import { AccountInfoPanel } from './AccountInfoPanel';
import { useDynamicContext } from '@/lib/dynamic';
import {DynamicWidget} from '@/lib/dynamic';

/**
 * AccountConnect
 *  - Connects to the wallet
 *  - Disconnects from the wallet
 *  - Displays the wallet network
 */
function AccountConnect() {
  const account = useAccount();
  const { status } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

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
        return (<DynamicWidget
        innerButtonComponent={<button>Connect Wallet</button>}
      >
        {/* ... rest of your app ... */}
      </DynamicWidget>);/*(
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
