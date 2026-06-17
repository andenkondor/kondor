import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";
import { useDebounce } from "@hooks/useDebounce";
import { Fzf } from "@tools/Fzf";
import { useEffect, useRef } from "react";

export function useFzf() {
	const {
		setFzfState,
		setResultState,
		rgState: { searchResults },
		fzfState: { filterTerm, fzfOptions },
	} = useApplicationState();

	const { inputDebounceDelayMs } = useConfig();
	const fzfProcRef = useRef<Bun.Subprocess | undefined>(undefined);
	const activeFilterRef = useRef(0);
	const debouncedFzfFilter = useDebounce(filterTerm, inputDebounceDelayMs);

	useEffect(() => {
		const filterId = ++activeFilterRef.current;

		const search = async () => {
			if (fzfProcRef.current) {
				fzfProcRef.current.kill();
				fzfProcRef.current = undefined;
			}

			if (!searchResults.length) {
				if (filterId === activeFilterRef.current) {
					setFzfState((prev) => ({ ...prev, filterResults: [] }));
				}

				return;
			}

			if (!debouncedFzfFilter) {
				if (filterId === activeFilterRef.current) {
					setFzfState((prev) => ({ ...prev, filterResults: searchResults }));
				}

				return;
			}

			try {
				setFzfState((prev) => ({
					...prev,
					isLoading: true,
					filterResults: [],
				}));

				const { proc, getResult } = Fzf.execute(
					searchResults,
					debouncedFzfFilter,
					fzfOptions,
				);
				fzfProcRef.current = proc;

				const { results, stderr } = await getResult();

				if (filterId === activeFilterRef.current) {
					if (stderr) {
						setResultState((prev) => ({ ...prev, error: stderr }));
					}
					setFzfState((prev) => ({
						...prev,
						filterResults: results,
					}));
				}
			} finally {
				if (filterId === activeFilterRef.current) {
					setFzfState((prev) => ({
						...prev,
						isLoading: false,
					}));
				}
			}
		};

		search();

		return () => {
			activeFilterRef.current++;
			if (fzfProcRef.current) {
				fzfProcRef.current.kill();
				fzfProcRef.current = undefined;
			}
		};
	}, [
		searchResults,
		debouncedFzfFilter,
		fzfOptions,
		setFzfState,
		setResultState,
	]);
}
