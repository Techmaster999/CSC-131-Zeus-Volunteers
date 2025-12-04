import { useEffect } from "react";

/**
 * Injects Figma-exported CSS files into the document head.
 * Keeps things scoped by tracking links with a data attribute and cleans them up on unmount.
 */
function useFigmaStyles(hrefs) {
  useEffect(() => {
    const head = document.head;
    const created = [];

    hrefs.forEach((href) => {
      if (!href) return;

      const existing = head.querySelector(`link[data-figma-style="${href}"]`);
      if (existing) {
        created.push(null);
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.figmaStyle = href;
      head.appendChild(link);
      created.push(link);
    });

    return () => {
      created.forEach((link) => {
        if (link && head.contains(link)) {
          head.removeChild(link);
        }
      });
    };
  }, [hrefs]);
}

export default useFigmaStyles;
