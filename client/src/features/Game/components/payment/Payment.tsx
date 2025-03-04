import { Capacitor } from '@capacitor/core';
import React from 'react';
import { createPortal } from 'react-dom';
// import { AiOutlineSetting } from 'react-icons/ai';

import Menu from '@/components/menu/Menu';

import Tab from '@/components/tabs/Tab';
import TabGroup from '@/components/tabs/TabGroup';
import TabPanel from '@/components/tabs/TabPanel';
import TabPanels from '@/components/tabs/TabPanels';
import Tabs from '@/components/tabs/Tabs';

import InputSvg from '@/features/Game/components/payment/InputSVG';
import OutputSVG from '@/features/Game/components/payment/OutputSVG';
import PaymentTypes from '@/features/Game/components/payment/PaymentTypes';
import { useQuizContext } from '@/features/Game/contexts/QuizContext';
import NextImage from '@/components/NextImage';
import TransactionBoardTable from '../Quiz/leader-board-table/TransactionBoardTable';
import { addressFormatter } from '../../lib/addressFormatter';
import { useAccount } from 'wagmi';
const Payment = () => {
  const { deposit } = useQuizContext();
  const {address} = useAccount();
  return (
    <div>

      {createPortal(<Menu />, document.body)}

      <TabGroup>
        <Tabs className='m-10 mx-auto w-full'>
          <Tab>
            <div className='flex items-center justify-center gap-2'>
              <span className='text-xl'>
                <InputSvg />
              </span>
              <span className='font-bold'>Profile</span>
            </div>
          </Tab>
          <Tab>
            <div className='flex items-center justify-center gap-2'>
              <span className='text-3xl'>
                <OutputSVG />
              </span>
              <span className='font-bold'>History</span>
            </div>
          </Tab>
        </Tabs>

        <TabPanels>
          <TabPanel>
            <div className='flex flex-grow flex-col items-center gap-3 overflow-y-auto px-4'>
              <NextImage
                src={`https://effigy.im/a/${address}.svg`}
                alt='Image placeholder'
                className='relative h-32 w-32 rounded-full border-4 border-white'
                imgClassName='object-cover rounded-full'
                fill
              />
              <span className='mt-4 block text-3xl'>{addressFormatter(address as `0xstring`)}</span>
            </div>

            <div className='text-gradient-primary mt-10 flex items-center justify-center gap-2'>
              <h2 className='text-8xl'>{deposit}</h2>
              <span className='text-4xl'>USDC</span>
            </div>
            <PaymentTypes />
          </TabPanel>
          <TabPanel>
            <div className='flex flex-grow flex-col items-center gap-3 overflow-y-auto px-4'>
              <TransactionBoardTable
                className='mt-8'
                figureClassName='border'
              />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default Payment;
