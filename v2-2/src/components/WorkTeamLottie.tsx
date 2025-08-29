"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';

/**
 * Renders the team/work related Lottie animation.
 */
export default function WorkTeamLottie({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <DotLottieReact
        src="/work team.lottie"
        autoplay
        loop
        style={{ width: "15vw", height: "15vw" }}
      />
    </div>
  );
}
