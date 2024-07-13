export enum SupportedChains {
  arbitrum = 'arbitrum',
  base = 'base',
}

export type Asset = {
  key: string;
  label: string;
  address: Record<SupportedChains, string>;
  enabled: boolean;
};

export const assets: Asset[] = [
  {
    key: 'usdc',
    label: 'USDC',
    address: {
      [SupportedChains.arbitrum]: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
      [SupportedChains.base]: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    },
    enabled: true,
  },
];
