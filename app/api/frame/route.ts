import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

//todo for this frame
//link to our database
//get the information from the users
//change the page to be bricis related
//people leave their feedback for event they did with her
//i think i can actually build this frame into our app. so it has everything already connected
//see if i can get that in the frame validator

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
  if (message?.button === 3) {
    return NextResponse.redirect('https://www.optimism.io/', { status: 302 });
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: 'Back',
          target: `${NEXT_PUBLIC_URL}/`,
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
          label: 'Optimism Ecosystem',
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/MGLImage.png`,
      },
      input: {
        text: 'Enter project name',
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
