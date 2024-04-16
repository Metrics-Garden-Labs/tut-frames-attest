import { createPublicClient, http } from 'viem';
import { optimism } from 'viem/chains';

const publicClient = createPublicClient({
  chain: optimism,
  transport: http(),
});

const getNewAttestId = async (txnId: string): Promise<any> => {
  try {
    const hash = txnId as `0x${string}`;
    const transactionReceipt = await publicClient.waitForTransactionReceipt({ hash });

    console.log(transactionReceipt);
    console.log(transactionReceipt.logs[0].data);
    return transactionReceipt.logs[0].data;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export { getNewAttestId };
