import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { getNewAttestId } from '../../utils/utils';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid } = await getFrameMessage(body);

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }
  let txnId = body?.untrustedData?.transactionId;
  const attestUid = await getNewAttestId(txnId!);
  console.log(attestUid);
  const transactionId = body?.untrustedData?.transactionId;

  // the button that shows the transaction does not work,
  //can go to the scanner and see the transaction that you made.
  //happy enough with that for now

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'View Attestation',
          action: 'link',
          target: `https://optimism.easscan.org/attestation/view/${attestUid}`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/MGLImage.png`,
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
