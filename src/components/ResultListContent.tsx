import { useRef, useEffect, useState, type ReactNode } from "react";
import type { ScrollBoxRenderable } from "@opentui/core";
import { ResultLine } from "@components/ResultLine";
import { useApplicationState } from "@contexts/ApplicationStateContext";

// We render also non visible items to avoid flickering when they come into view
const OVERSCAN = 5;

export const ResultListContent = (): ReactNode => {
  const {
    resultState: { overallResults },
    selectionState: { selectedResultIndex, markedResultIds },
  } = useApplicationState();

  const scrollRef = useRef<ScrollBoxRenderable | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const scrollboxHeight = scrollRef.current?.height ?? 0;
  const startIndex = Math.max(0, scrollTop - OVERSCAN);
  const endIndex = Math.min(
    overallResults.length,
    scrollTop + scrollboxHeight + OVERSCAN,
  );
  const visibleItems = overallResults.slice(startIndex, endIndex);

  useEffect(() => {
    if (!scrollRef.current) return;

    const currentScrollTop = scrollRef.current.scrollTop;

    if (currentScrollTop >= overallResults.length) {
      scrollRef.current.scrollTop = 0;
      setScrollTop(0);
      return;
    }

    const bottomVisibleIndex = currentScrollTop + scrollboxHeight - 1;

    if (selectedResultIndex < currentScrollTop) {
      scrollRef.current.scrollTop = selectedResultIndex;
      setScrollTop(scrollRef.current.scrollTop);
    } else if (selectedResultIndex > bottomVisibleIndex) {
      scrollRef.current.scrollTop = selectedResultIndex - scrollboxHeight + 1;
      setScrollTop(scrollRef.current.scrollTop);
    }
  }, [selectedResultIndex, scrollboxHeight, overallResults.length]);

  return (
    <scrollbox
      ref={scrollRef}
      viewportCulling
      scrollbarOptions={{ visible: false }}
    >
      {startIndex > 0 && <box height={startIndex} />}
      {visibleItems.map((item, index) => (
        <ResultLine
          key={item.id}
          item={item}
          isSelected={startIndex + index === selectedResultIndex}
          isMarked={markedResultIds.has(item.id)}
        />
      ))}
      {endIndex < overallResults.length && (
        <box height={overallResults.length - endIndex} />
      )}
    </scrollbox>
  );
};
