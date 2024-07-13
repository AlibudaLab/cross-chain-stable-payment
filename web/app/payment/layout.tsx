import { generateMetadata } from '@/utils/generateMetadata';

export const metadata = generateMetadata({
  title: 'Abstracted USDC Payments',
  description: 'Abstracted USDC Payments',
  images: 'themes.png',
  pathname: 'payment',
});

export default async function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
