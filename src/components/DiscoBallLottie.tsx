"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';

/**
 * Renders the gold disco ball Lottie animation.
 * The .lottie bundle is served from /public so we can point to it directly via relative path.
 * Wrapped as a client component because the player depends on the browser.
 */
export default function DiscoBallLottie({ className }: { className?: string }) {
	return (
		<div className={className} aria-hidden="true">
			<DotLottieReact
				src="/Discoball(gold).lottie"
				autoplay
				loop
				style={{ width: "15vw", height: "15vw" }}
			/>
		</div>
	);
}
