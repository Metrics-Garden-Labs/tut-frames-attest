//api/contribution/route.ts

import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

//todo

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }
  let inputText: string = body.untrustedData.inputText;

  const text = message.input || '';
  let state = {
    page: 0,
  };

  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    console.error(e);
  }

  /**
   * Use this code to redirect to a different page
   */
  //if the button press in the previous page was 2
  //display https://utfs.io/f/a4f28a75-5047-41bc-8f8a-7f461db6ffda-4w0oep.png
  //if the button press in the previous page was 3
  //display https://utfs.io/f/3539faae-d07b-40cd-b0c1-3c5404b86994-a1v7m8.png
  // Retrieving from localStorage and comparing
  const useful = false;

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Back',
          target: `${NEXT_PUBLIC_URL}/api/frame`,
          //maybe get rid of this if it keeps failing
        },
        {
          action: 'tx',
          label: 'Attest to Project',
          target: `${NEXT_PUBLIC_URL}/api/tx`,
          postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
        },
        {
          action: 'post_redirect',
          label: 'Metrics Garden',
        },
      ],
      image: {
        src: 'https://utfs.io/f/3539faae-d07b-40cd-b0c1-3c5404b86994-a1v7m8.png',
      },
      input: {
        text: 'Leave your feedback',
      },
      ogTitle: 'Project Attestation!',
      postUrl: `${NEXT_PUBLIC_URL}`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
