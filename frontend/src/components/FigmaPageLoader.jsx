import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Loads a Figma-exported static HTML page from /public/static and renders it inside React.
 * - Rewrites relative asset URLs so images/CSS resolve correctly from the copied static folder.
 * - Inlines the linked CSS so styles apply without needing <head> tags.
 */
function FigmaPageLoader({ folder, file = "index.html" }) {
  const [markup, setMarkup] = useState("");
  const [styles, setStyles] = useState([]);
  const [scripts, setScripts] = useState([]);
  const pageRef = useRef(null);

  // Encode spaces and other characters so fetch() works with folder names like "Admin Login"
  const basePath = useMemo(() => encodeURI(`/static/${folder}/`), [folder]);
  const htmlPath = `${basePath}${file}`;

  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      try {
        const res = await fetch(htmlPath);
        const raw = await res.text();
        if (cancelled) return;

        const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        const bodyHtml = bodyMatch ? bodyMatch[1] : raw;

        // Find all linked stylesheets in the original HTML so we can inline them.
        const cssLinks = Array.from(
          raw.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)
        ).map(([, href]) => resolvePath(href, basePath));

        const cssText = await Promise.all(
          cssLinks.map(async (href) => {
            try {
              const cssRes = await fetch(href);
              if (!cssRes.ok) return "";
              return await cssRes.text();
            } catch {
              return "";
            }
          })
        );

        const parsedScripts = Array.from(
          bodyHtml.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)
        ).map((match) => {
          const attrs = match[1] || "";
          const srcMatch = attrs.match(/src=["']([^"']+)["']/i);
          const src = srcMatch ? resolvePath(srcMatch[1], basePath) : null;
          const inline = src ? "" : (match[2] || "").trim();
          return { src, inline };
        });

        const bodyWithoutScripts = bodyHtml.replace(/<script[\s\S]*?<\/script>/gi, "");

        setStyles(cssText.filter(Boolean));
        setScripts(parsedScripts);
        setMarkup(rewriteAssetPaths(bodyWithoutScripts, basePath));
      } catch (err) {
        if (!cancelled) {
          setMarkup('<div class="figma-error">Unable to load design.</div>');
        }
      }
    }

    loadPage();
    return () => {
      cancelled = true;
    };
  }, [htmlPath, basePath]);

  // Inject any external/inline scripts after markup renders.
  useEffect(() => {
    const container = pageRef.current;
    if (!container || scripts.length === 0) return;

    const injected = [];

    scripts.forEach((script) => {
      const node = document.createElement("script");
      if (script.src) {
        node.src = script.src;
        node.async = false;
      } else {
        node.textContent = script.inline;
      }
      container.appendChild(node);
      injected.push(node);
    });

    return () => {
      injected.forEach((node) => node.remove());
    };
  }, [scripts, markup]);

  return (
    <div className="figma-page-shell">
      {styles.map((css, idx) => (
        <style key={idx} dangerouslySetInnerHTML={{ __html: css }} />
      ))}
      <div
        ref={pageRef}
        className="figma-page"
        dangerouslySetInnerHTML={{ __html: markup || "<p>Loading design...</p>" }}
      />
    </div>
  );
}

// Prefix relative src/href paths so assets resolve from /static/<folder>/...
function rewriteAssetPaths(html, basePath) {
  return html.replace(/(src|href)=\"([^"]+)\"/gi, (match, attr, value) => {
    const trimmed = value.trim();
    const isAnchor = trimmed.startsWith("#");
    const isAbsolute =
      /^https?:\/\//i.test(trimmed) || trimmed.startsWith("data:") || trimmed.startsWith("mailto:");
    const alreadyRoot = trimmed.startsWith("/");

    if (isAnchor || isAbsolute || alreadyRoot) return match;
    return `${attr}="${basePath}${trimmed}"`;
  });
}

// Resolve CSS link hrefs relative to the base path.
function resolvePath(href, basePath) {
  const trimmed = href.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return `${basePath}${trimmed}`;
}

export default FigmaPageLoader;
