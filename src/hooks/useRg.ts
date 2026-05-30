import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { useDebounce } from "@hooks/useDebounce";
import { Rg } from "@tools/Rg";
import { useEffect, useRef } from "react";

export function useRg() {
	const {
		setRgState,
		rgState: { searchTerm, rgOptions },
	} = useApplicationState();

	const { inputDebounceDelayMs } = useConfig();
	const rgProcRef = useRef<Bun.Subprocess | undefined>(undefined);
	const activeSearchRef = useRef(0);
	const debouncedSearchTerm = useDebounce(searchTerm, inputDebounceDelayMs);

	useEffect(() => {
		const searchId = ++activeSearchRef.current;

		const search = async () => {
			if (rgProcRef.current) {
				rgProcRef.current.kill();
				rgProcRef.current = undefined;
			}

			if (!debouncedSearchTerm) {
				if (searchId === activeSearchRef.current) {
					setRgState((prev) => ({ ...prev, searchResults: [] }));
				}
				return;
			}

			try {
				setRgState((prev) => ({ ...prev, isLoading: true, searchResults: [] }));

				const { proc: newRgProc, getResult } = Rg.execute(
					debouncedSearchTerm,
					rgOptions,
				);
				rgProcRef.current = newRgProc;

				if (searchId !== activeSearchRef.current) {
					return;
				}
				const searchResults = await getResult();

				if (searchId === activeSearchRef.current) {
					setRgState((prev) => ({ ...prev, searchResults }));
				}
			} finally {
				if (searchId === activeSearchRef.current) {
					setRgState((prev) => ({
						...prev,
						isLoading: false,
					}));
				}
			}
		};

		search();

		return () => {
			if (rgProcRef.current) {
				rgProcRef.current.kill();
				rgProcRef.current = undefined;
			}
		};
	}, [debouncedSearchTerm, rgOptions, setRgState]);
}
