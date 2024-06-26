import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Lets Attest!',
    },
    
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/MGLImage.png`,
    //aspectRatio: '1:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
});

export const metadata: Metadata = {
  title: 'MGLDemoAttest',
  description: 'Lets get this working',
  openGraph: {
    title: 'MGLDemoAttest',
    description: 'Lets get this working',
    images: [`${NEXT_PUBLIC_URL}/MGLImage.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>MGLDemoAttest</h1>
    </>
  );
}
