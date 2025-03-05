import { Chain } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';

const coreDaoTestnet = {
  id: 1114,
  name: 'Core Blockchain Testnet2',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4584.png', // Placeholder icon URL for ETH
  nativeCurrency: {
    name: 'Core Blockchain Testnet2',
    symbol: 'tCORE2',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.test2.btcs.network'] },
  },
  blockExplorers: {
    default: {
      name: 'Core Blockchain Testnet2',
      url: 'https://scan.test2.btcs.network',
    },
  },
};

import { createConfig, http } from 'wagmi';
import {
  rainbowWallet,
  walletConnectWallet,
  okxWallet,
} from '@rainbow-me/rainbowkit/wallets';
const chains: readonly [Chain, ...Chain[]] = [mainnet, coreDaoTestnet];
const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [okxWallet, rainbowWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'Winfinity',
    projectId: '87106bd465234d097b8a51ba585bf799',
  }
);

export const config = createConfig({
  connectors,
  chains: chains,
  transports: {
    [mainnet.id]: http('https://bsc-dataseed.binance.org/'),
    [coreDaoTestnet.id]: http(),
  },
});
