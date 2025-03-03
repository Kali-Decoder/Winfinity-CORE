import React from 'react';
import NextImage from '@/components/NextImage';
import { addressFormatter } from '@/features/Game/lib/addressFormatter';
import { useAccount } from 'wagmi';
const Account = () => {
  const {address} = useAccount();
  return (
    <>
      <div className='mt-6 flex flex-col items-center gap-3'>
        <NextImage
           src={`https://effigy.im/a/${address}.svg`}
          alt='Image placeholder'
          className='relative h-32 w-32 rounded-full border-4 border-white'
          imgClassName='object-cover rounded-full'
          fill
        />
        <span className='block'>{addressFormatter(address as `0xstring`)}</span>
        <span className='text-gradient-primary block'>3950 XP</span>
      </div>
    </>
  );
};

export default Account;
