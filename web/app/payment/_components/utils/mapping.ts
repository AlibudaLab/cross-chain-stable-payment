import { assets } from '../../constants';
import { SupportedChains } from '../../constants';

export const getAssetAddress = (assetKey: string, chain: SupportedChains): string => {
  const asset = assets.find((_asset) => _asset.key === assetKey);
  return asset?.address[chain] ?? '';
};
