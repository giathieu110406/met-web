'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Fireworks from './fireworks';
import PetalRain from './petal-rain';

export default function EndingCutscene() {
  const [position, setPosition] = useState(0);

  // Exact upward scroll mechanism from original repository (commit 4624329):
  // Starts at position = 0 (translateY 220px), moves up 5px every 100ms until position = -200 (translateY 20px)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPosition((p) => {
        if (p <= -200) {
          clearInterval(intervalId);
          return -200;
        }
        return p - 5;
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Fireworks active={true} />
      <PetalRain active={true} />

      {/* Message "I LIKE U" — identical rendering and movement to original repo */}
      <Image
        src="/assets/others/message.png"
        height={400}
        width={600}
        alt="Message"
        className="absolute z-50"
        style={{ transform: `translateY(${position + 220}px)` }}
      />
    </>
  );
}
