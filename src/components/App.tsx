import { Box, useWindowSize } from "ink";
import type { FC } from "react";
import { Rg } from "@components/Rg";
import { Fzf } from "@components/Fzf";
import { useRg } from "@hooks/useRg";
import { useFzf } from "@hooks/useFzf";
import { ResultList } from "@components/ResultList";

export const App: FC = () => {
  const { searchResult, setSearchTerm, searchTerm } = useRg();
  const { fzfFilter, setFzfFilter, output } = useFzf(searchResult);
  const { rows } = useWindowSize();

  return (
    <Box flexDirection="column" height={rows}>
      <Box flexGrow={0} flexShrink={0} flexBasis={3}>
        <Rg searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
      </Box>
      <Box flexGrow={0} flexShrink={0} flexBasis={3}>
        <Fzf filterTerm={fzfFilter} onFilterTermChange={setFzfFilter} />
      </Box>
      <Box flexGrow={1}>
        <ResultList resultItems={output} />
      </Box>
    </Box>
  );
};
