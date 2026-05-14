import { memo, useRef, type FC } from "react";
import { Box, Text, useBoxMetrics } from "ink";
import { usePreview } from "@hooks/usePreview";
import { useApplicationState } from "@contexts/ApplicationStateContext";
import { useConfig } from "@contexts/ConfigContext";

export const Preview: FC = () => {
  const {
    layout: { borderType },
  } = useConfig();
  const boxRef = useRef(null);
  const { height } = useBoxMetrics(boxRef);
  const previewContent = usePreview(height - 2);

  const {
    layoutState: { isPreview },
  } = useApplicationState();

  if (!isPreview) {
    return null;
  }
  return (
    <Box borderStyle={borderType} width="100%" ref={boxRef} overflow="hidden">
      <CachedPreviewContent content={previewContent} />
    </Box>
  );
};

const PreviewContent: FC<{ content: string }> = ({ content }) => {
  return <Text>{content}</Text>;
};

const CachedPreviewContent = memo(PreviewContent);
