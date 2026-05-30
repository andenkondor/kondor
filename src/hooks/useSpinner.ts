import type { SpinnerName } from "cli-spinners";
import cliSpinners from "cli-spinners";
import { useEffect, useRef, useState } from "react";

export const useSpinner = (
	isActive: boolean,
	spinnerName: SpinnerName = "dotsCircle",
): string => {
	const { interval, frames } = cliSpinners[spinnerName];
	const [frameIndex, setFrameIndex] = useState(0);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const framesLengthRef = useRef(frames.length);

	framesLengthRef.current = frames.length;

	useEffect(() => {
		if (isActive) {
			timerRef.current = setInterval(() => {
				setFrameIndex((prev) => (prev + 1) % framesLengthRef.current);
			}, interval);
		}

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [isActive, interval]);

	useEffect(() => {
		if (!isActive) {
			setFrameIndex(0);
		}
	}, [isActive]);

	return isActive ? (frames[frameIndex] ?? "") : "";
};
