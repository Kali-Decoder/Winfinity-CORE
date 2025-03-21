'use client';
import React, { use } from 'react';
import { createPortal } from 'react-dom';
import Menu from '@/components/menu/Menu';

import { useTabsContext } from '@/features/Game/contexts/TabsContext'; // Import useTabsContext

import TabGroup from '@/components/tabs/TabGroup';
import Payment from '@/features/Game/components/payment/Payment';
import MemoryGame from '@/components/game/MemoryGame';
import LeaderBoard from '@/features/Game/components/leader-board/LeaderBoard';


const Page = () => {
  const [isClient, setIsClient] = React.useState(false);
  const { selectedTab, setSelectedTab } = useTabsContext();
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  console.log(selectedTab);

  const renderContent = () => {
    if (selectedTab === 'memory') {
      return <MemoryGame />;
    }
    if (selectedTab === 'home') {
      return <LeaderBoard/>;
    }
    if (selectedTab === 'payment') {
      return <Payment/>;
    }
    return null;
  };

  return (
    
      <div
        className='mt-10 flex min-h-screen flex-col overflow-hidden text-white'
        style={{ backgroundColor: 'transparent' }}
      >
          <TabGroup>{renderContent()}</TabGroup>
        {isClient ? createPortal(<Menu />, document.body) : null}
      </div>
   
  );
};

export default Page;
