import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { optimism } from 'viem/chains';
import abi from '../../_contracts/OPEASABI';
import { OP_EAS_ADDRESS } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { insertAttestation } from '../../../src/lib/db';
import { NewContributionAttestation } from '../../../src/types';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  const { isValid } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });
  const inputText = body.untrustedData.inputText || '';
  const button = body.untrustedData.buttonIndex || '';
  let fid = body.untrustedData.fid || '';

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
  const attestationSchema = "0x5f5afd9626d9d0cd46c7de120032c2470da00c4be9bcef1dd75fa8c074f17e70";
  const schemaEncoder = new SchemaEncoder('string Farcaster, string Contribution, uint8 Rating, string HowItHelped, bool IsDelegate, string Feedback');
  const encodedData = schemaEncoder.encodeData([
      { name: 'Farcaster', type: 'string', value: fid },
      { name: 'Contribution', type: 'string', value: 'Venice'},
      { name: 'Rating', type: 'uint8', value: 5 },
      { name: 'HowItHelped', type: 'string', value: 'It was a great project'},
      { name: 'IsDelegate', type: 'bool', value: true},
      { name: 'Feedback', type: 'string', value: 'It was a great project'},
  ]);


  const functionData = {
    schema: attestationSchema as string,
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

  const transactionId = body?.untrustedData?.transactionId;


  const newAttestation = {
  userFid: String(fid),
  projectName: 'Beach',
  contribution: 'Venice Beach',
  ecosystem: 'Optimism',
  attestationUID: transactionId ? String(transactionId) : "",
  attesterAddy: "",
  feedback: inputText,
  isdelegate: true,
  rating: String(5),
  improvementareas: "we shall see",
  extrafeedback: "review", 
  } as NewContributionAttestation;

  const insertedAttestation = await insertAttestation(newAttestation);
  console.log('Inserted Attestation', insertedAttestation);
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
