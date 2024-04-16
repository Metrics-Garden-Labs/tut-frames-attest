import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { optimism } from 'viem/chains';
import abi from '../../_contracts/OPEASABI';
import { OP_EAS_ADDRESS } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  const { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
  const inputText = body.untrustedData.inputText || '';

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const textData: any = {
    project: inputText,
  };

  //simple schema that just says project
  const schemaUID = '0x36921ad1b16b4e049df813054f13c03e8417e222512d9a6f9a050b56106b6c1c';

  //encode the schema
  const schemaEncoder = new SchemaEncoder('string project');
  const encodedData = schemaEncoder.encodeData([
    { name: 'project', value: JSON.stringify(textData), type: 'string' },
  ]);

  const functionData = {
    schema: schemaUID,
    data: {
      recipient: '0x2A3Ce312571612d2ca3A05F4AB5f6AbEde266271',
      expirationTime: undefined,
      revocable: true,
      refUID: undefined,
      data: encodedData,
      value: 0,
    },
  };

  const transactionData = encodeFunctionData({
    abi: abi,
    functionName: 'attest',
    args: [functionData],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${optimism.id}`,
    method: 'eth_sendTransaction',
    params: {
      abi: [],
      data: transactionData,
      to: OP_EAS_ADDRESS,
      value: parseEther('0').toString(),
    },
  };
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
