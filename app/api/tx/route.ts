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
  const button = body.untrustedData.buttonIndex || '';

  let useful = true;
  if (button === 2) {
    useful = true;
    console.log('not useful', useful);
  }

  if (button === 3) {
    useful = false;
    console.log('not useful', useful);
  }

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  //having text data set up like this is only useful if you have multiple fields to attest to in the schema
  // const textData: any = {
  //   project: inputText,
  // };
  console.log(inputText);

  //simple schema that just says project
  const schemaUID = '0x0ea974daef377973de71b8a206247f436f67364853a10d460c2623d18035db12';

  //encode the schema
  const schemaEncoder = new SchemaEncoder('string Contribution, bool Useful, string Feedback');

  //TODO: works just putting the input text in, when it comes to production, will have to input fixed data based on the frame of the project they want to attest to data on
  const encodedData = schemaEncoder.encodeData([
    { name: 'Contribution', type: 'string', value: 'Venice Beach' },
    { name: 'Useful', type: 'bool', value: useful },
    { name: 'Feedback', type: 'string', value: inputText },
  ]);

  const functionData = {
    schema: schemaUID as string,
    data: {
      //recipient: '0x2A3Ce312571612d2ca3A05F4AB5f6AbEde266271',
      //TODOO: recipient is hardcoded, this will need to be variable based on the project they want to attest to
      recipient: '0x2A3Ce312571612d2ca3A05F4AB5f6AbEde266271',
      expirationTime: 0,
      revocable: true,
      //refUID: undefined,
      refUID: '0xfb28a1956ba6929428b1a63eebc4db7c58ab45430316b09fd66674a316138f97',
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
    //hardcode chain id for  op
    chainId: 'eip155:10',
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
