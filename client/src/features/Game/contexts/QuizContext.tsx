import React, { ReactNode, useContext, useEffect, useState } from 'react';
import {
  NFTInfo,
  PreQuestions,
  Question,
  Quiz,
} from '@/features/Game/types/Types';
import { config } from '@/helper';
import { toast } from 'react-toastify';
import { parseEther } from 'ethers';
import { PostQuestions } from '../types/Types';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import {
  mainContractABI,
  mainContractAddress,
  tokenAbi,
  stakingTokenAddress,
  rewardTokenAddress
} from '@/contract-constant';
import { readContract } from '@wagmi/core';
import { api, postWithHeaders, getWithHeaders } from '@/config';
type QuizContext = {
  activeQuiz: boolean;
  setActiveQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  activeStep: 'pre-questions' | 'questions' | 'post-questions';
  setActiveStep: React.Dispatch<
    React.SetStateAction<'pre-questions' | 'questions' | 'post-questions'>
  >;
  preQuestions: PreQuestions;
  setPreQuestions: React.Dispatch<React.SetStateAction<PreQuestions>>;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  postQuestions: PostQuestions;
  setPostQuestions: React.Dispatch<React.SetStateAction<PostQuestions>>;
  NFTInfo: NFTInfo;
  setNFTInfo: React.Dispatch<React.SetStateAction<NFTInfo>>;
  deposit: number;
  setDeposit: React.Dispatch<React.SetStateAction<number>>;
  stake: number;
  setStake: React.Dispatch<React.SetStateAction<number>>;
  stakeYourAmount: (amount: string) => Promise<void>;
  yieldAmount: number;
  unstakeYourAmount: (amount: string) => Promise<void>;
  claimYourAmount: () => Promise<void>;
  currentRewardPerToken: number;
  tokenBalance : number;
};

export const QuizContext = React.createContext<QuizContext>({} as QuizContext);

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuizContext must be used within a QuizContextProvider');
  }
  return context;
};

const QuizContextProvider = ({ children }: { children: ReactNode }) => {
  const { address, chain } = useAccount();
  const { data: hash, writeContractAsync, status } = useWriteContract();
  const [yieldAmount, setYieldAmount] = useState<number>(0);
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [currentRewardPerToken, setCurrentRewardPerToken] = useState<number>(0);
  const [activeStep, setActiveStep] =
    useState<Quiz['activeStep']>('pre-questions');
  const [preQuestions, setPreQuestions] = useState<PreQuestions>({
    NFTFlowId: '',
    players: [{ profileImage: '', handle: '', points: 0, countryImage: '' }],
    categoryImage: <></>,
    requiredBet: '',
  });
  const [questions, setQuestions] = useState<Question[]>({} as Question[]);
  const [postQuestions, setPostQuestions] = useState<PostQuestions>(
    {} as PostQuestions
  );
  const [NFTInfo, setNFTInfo] = useState<NFTInfo>({
    NFTId: '',
    NFTName: '',
    NFTDescription: '',
    NFTTotalPrice: '',
    NFTVideoSrc: '',
    maxBet: '',
    version: '',
  });

  const [deposit, setDeposit] = useState<number>(0);
  const [stake, setStake] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('deposit', JSON.stringify(deposit));
    }
  }, [deposit]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('stake', JSON.stringify(stake));
    }
  }, [stake]);

  async function stakeYourAmount(amount: string) {
    try {
      const amountEther = parseEther(amount); // Parse the amount to Ether

      // Check allowance
      const allowance = await readContract(config, {
        address: stakingTokenAddress,
        abi: tokenAbi,
        functionName: 'allowance',
        args: [address, mainContractAddress],
      });

      // If allowance is insufficient, approve it
      if (Number(allowance) < Number(amountEther.toString())) {
        await toast.promise(
          writeContractAsync({
            address: stakingTokenAddress,
            abi: tokenAbi,
            functionName: 'approve',
            args: [mainContractAddress, amountEther],
          }),
          {
            pending: 'Approval in progress...',
            success: 'Approval successful 👌',
            error: 'Approval failed 🤯',
          }
        );
      }

      let data = await postWithHeaders(
        '/winfinity/users/deposit',
        {
          amount,
        },
        {
          'x-user-address': address,
        }
      );

      console.log(data);
      // Perform staking
      await toast.promise(
        writeContractAsync({
          address: mainContractAddress,
          abi: mainContractABI,
          functionName: 'stake',
          args: [amountEther],
        }),
        {
          pending: 'Staking in progress...',
          success: 'Staking successful 👌',
          error: 'Staking failed 🤯',
        }
      );
      await getUserInfo();
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  }

  async function getYieldAmount() {
    try {
      const yieldAmount = await readContract(config, {
        address: mainContractAddress,
        abi: mainContractABI,
        functionName: 'currentUserRewards',
        args: [address],
      });

      setYieldAmount(Number(Number(yieldAmount).toString()) / 10 ** 18);
    } catch (error) {
      console.log('error', error);
    }
  }

  async function getTokenBalance() {
    try {
      const tokenBalance = await readContract(config, {
        address: stakingTokenAddress,
        abi: tokenAbi,
        functionName: 'balanceOf',
        args: [address],
      });

      setTokenBalance(Number(Number(tokenBalance).toString()) / 10 ** 18);
    } catch (error) {
      console.log('error', error);
    }
  }


  async function getCurrentRewardsPerToken() {
    try {
      const rewardPerToken = await readContract(config, {
        address: mainContractAddress,
        abi: mainContractABI,
        functionName: 'currentRewardsPerToken',
        args: [],
      });
      setCurrentRewardPerToken(
        Number(Number(rewardPerToken).toString()) / 10 ** 18
      );
      console.log('rewardPerToken', rewardPerToken);
    } catch (error) {
      console.log('error', error);
    }
  }

  async function getAccumulatedRewards() {
    try {
      const accumulatedRewards = await readContract(config, {
        address: mainContractAddress,
        abi: mainContractABI,
        functionName: 'accumulatedRewards',
        args: [address],
      });
      console.log('accumulatedRewards', accumulatedRewards);
    } catch (error) {
      console.log('error', error);
    }
  }

  async function getUserInfo(){
    try {
      let data = await getWithHeaders("/winfinity/user",{
        "x-user-address":address
      });
      setDeposit(data?.data?.total_deposit)
      setStake(data?.data?.total_staked)
      await getYieldAmount();
      await  getCurrentRewardsPerToken();
      await getTokenBalance();
    } catch (error) {
      console.log("Error in gettinguser info !!!")
    }
  }

  async function unstakeYourAmount(amount: string) {
    try {
      const amountEther = parseEther(amount);

      // Perform unstaking with toast.promise
      await toast.promise(
        writeContractAsync({
          address: mainContractAddress,
          abi: mainContractABI,
          functionName: 'unstake',
          args: [amountEther],
        }),
        {
          pending: 'Unstaking in progress...',
          success: 'Unstaking successful 👌',
          error: 'Unstaking failed 🤯',
        }
      );

      // Fetch updated stake info after unstaking
      await getUserInfo();
    } catch (error) {
      console.error('Error during unstaking:', error);
      toast.error('An error occurred while unstaking. Please try again.');
    }
  }

  async function claimYourAmount() {
    try {
      // Perform claim operation with toast.promise
      await toast.promise(
        writeContractAsync({
          address: mainContractAddress,
          abi: mainContractABI,
          functionName: 'claim',
          args: [],
        }),
        {
          pending: 'Claiming in progress...',
          success: 'Claim successful 👌',
          error: 'Claim failed 🤯',
        }
      );

      // Fetch updated stake info after claiming
      await getUserInfo();
    } catch (error) {
      console.error('Error during claim:', error);
      toast.error('An error occurred while claiming. Please try again.');
    }
  }

  useEffect(() => {
    getUserInfo();
    // getAccumulatedRewards();
  }, [address]);

  return (
    <QuizContext.Provider
      value={{
        activeQuiz,
        setActiveQuiz,
        activeStep,
        setActiveStep,
        preQuestions,
        setPreQuestions,
        questions,
        setQuestions,
        postQuestions,
        setPostQuestions,
        NFTInfo,
        setNFTInfo,
        deposit,
        stake,
        setDeposit,
        setStake,
        stakeYourAmount,
        yieldAmount,
        unstakeYourAmount,
        claimYourAmount,
        currentRewardPerToken,
        tokenBalance
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizContextProvider;
