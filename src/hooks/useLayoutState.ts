import { useMemo, useState } from "react";

export type LayoutState = {
  isPreview: boolean;
  resultLineMaxLength: number;
};

const BORDER_THICKNESS = 1;

export const useLayoutState = (width: number) => {
  const [isPreview, setIsPreview] = useState(false);

  const resultLineMaxLength = useMemo(
    () =>
      isPreview
        ? Math.floor(width / 2) - 4 * BORDER_THICKNESS
        : width - 2 * BORDER_THICKNESS,
    [isPreview],
  );

  const setLayoutState = (updater: (prev: LayoutState) => LayoutState) => {
    const prev: LayoutState = { isPreview, resultLineMaxLength };
    const next = updater(prev);
    setIsPreview(next.isPreview);
  };

  return {
    layoutState: { isPreview, resultLineMaxLength },
    setLayoutState,
  };
};
