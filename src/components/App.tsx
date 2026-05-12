import { Box, useWindowSize } from "ink";
import type { FC } from "react";
import { RgControl } from "@components/rg/RgControl";
import { Fzf } from "@components/Fzf";
import { ResultList } from "@components/ResultList";
import { useInput } from "@hooks/useInput";
import { Preview } from "@components/Preview";

export const App: FC = () => {
  useInput();
  const { rows } = useWindowSize();

  return (
    <Box flexDirection="column" height={rows}>
      <Box flexGrow={0} flexShrink={0} flexBasis={3}>
        <RgControl />
      </Box>
      <Box flexGrow={0} flexShrink={0} flexBasis={3}>
        <Fzf />
      </Box>
      <Box flexGrow={1}>
        <Box flexDirection="row">
          <Box>
            <ResultList />
          </Box>
          <Box>
            <Preview />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
