import { baseSepolia } from 'viem/chains';
import TokenPortABI from './TokenPortABI';
import { useTokenPortContract } from './useTokenPortContract';

describe('useTokenPortContract', () => {
  it('should return correct contract data', () => {
    const contract = useTokenPortContract();
    expect(contract).toEqual({
      abi: TokenPortABI,
      address: '0x0c7D4Ae8ad01e521cE44d3aee1ce9acd59EE73eD',
      status: 'ready',
      supportedChains: [baseSepolia],
    });
  });
});
