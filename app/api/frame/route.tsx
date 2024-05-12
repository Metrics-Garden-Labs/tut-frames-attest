//api/frame/route.ts

//api/contribution/route.ts

import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";

// make sure to set your NEYNAR_API_KEY .env
// don't have an API key yet? get one at neynar.com

//todo

async function getResponse(req: NextRequest): Promise<NextResponse> {

  const body: FrameRequest = await req.json();
  const NEYNAR_KEY = process.env.NEYNAR_API_KEY || '';
  const client = new NeynarAPIClient(NEYNAR_KEY);
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
  const useful = true;
  if (message?.button === 4) {
    return NextResponse.redirect('https://www.metricsgarden.xyz', { status: 302 });
  }

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
          label: 'Useful',
          target: `${NEXT_PUBLIC_URL}/api/tx`,
          postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
        },
        {
          action: 'tx',
          label: 'Not Useful',
          target: `${NEXT_PUBLIC_URL}/api/tx`,
          postUrl: `${NEXT_PUBLIC_URL}/api/tx-success`,
        },
        {
          action: 'post_redirect',
          label: 'Metrics Garden',
        },
      ],
      image: {
        src: 'https://utfs.io/f/04d3d588-a049-4359-8433-f3af13b56e8b-qglbm5.png',
        // <div>
        //   <h1>hello</h1>
        // </div>
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
