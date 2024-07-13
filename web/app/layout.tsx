import './global.css';

import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import OnchainProviders from '@/OnchainProviders';
import { initAnalytics } from '@/utils/analytics';
import { inter } from './fonts';
import { Providers } from './providers';
import type { Metadata } from 'next';
import { DynamicWagmiConnector, EthereumWalletConnectors,DynamicContextProvider } from "@/lib/dynamic";



export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  manifest: '/manifest.json',
  other: {
    boat: '0.17.0',
  },
};

// Stat analytics before the App renders,
// so we can track page views and early events
initAnalytics();

/** Root layout to define the structure of every page
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} dark`}>
      <body className="flex flex-1 flex-col">
        <Providers>
          <DynamicContextProvider
            settings={{
            environmentId: 'e0aef638-4468-4586-86a9-dc829834f50b',
            walletConnectors: [EthereumWalletConnectors],  
          }}
        >
            <OnchainProviders>
              <DynamicWagmiConnector>
                {children}
              </DynamicWagmiConnector>
            </OnchainProviders>
          </DynamicContextProvider>
        </Providers>
      </body>
      <GoogleAnalytics />
    </html>
  );
}
