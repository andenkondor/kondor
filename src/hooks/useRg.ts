import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { useDebounce } from "@hooks/useDebounce";
import { Rg } from "@tools/Rg";
import { useEffect, useRef } from "react";

export function useRg() {
	const {
		setRgState,
		setResultState,
		rgState: { searchTerm, rgOptions, refreshTrigger },
	} = useApplicationState();

	const { inputDebounceDelayMs } = useConfig();
	const rgProcRef = useRef<Bun.Subprocess | undefined>(undefined);
	const activeSearchRef = useRef(0);
	const debouncedSearchTerm = useDebounce(searchTerm, inputDebounceDelayMs);

	useEffect(() => {
		void refreshTrigger;
		const searchId = ++activeSearchRef.current;

		const search = async () => {
			if (rgProcRef.current) {
				rgProcRef.current.kill();
				rgProcRef.current = undefined;
			}

			if (!debouncedSearchTerm) {
				if (searchId === activeSearchRef.current) {
					setResultState((prev) => ({ ...prev, error: undefined }));
					setRgState((prev) => ({ ...prev, searchResults: [] }));
				}
				return;
			}

			try {
				setResultState((prev) => ({ ...prev, error: undefined }));
				setRgState((prev) => ({
					...prev,
					isLoading: true,
					searchResults: [],
				}));

				const { proc: newRgProc, getResult } = Rg.execute(
					debouncedSearchTerm,
					rgOptions,
				);
				rgProcRef.current = newRgProc;

				if (searchId !== activeSearchRef.current) {
					return;
				}

				const { results, stderr } = await getResult();

				if (searchId === activeSearchRef.current) {
					setResultState((prev) => ({ ...prev, error: stderr || undefined }));
					setRgState((prev) => ({
						...prev,
						searchResults: results,
					}));
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
	}, [
		debouncedSearchTerm,
		rgOptions,
		refreshTrigger,
		setRgState,
		setResultState,
	]);
}
