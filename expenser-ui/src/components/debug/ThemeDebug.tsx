import React from "react";

export function ThemeDebug() {
  const [htmlClass, setHtmlClass] = React.useState("");
  const [sidebarVar, setSidebarVar] = React.useState("");
  const [sidebarFgVar, setSidebarFgVar] = React.useState("");
  const [sidebarBgVar, setSidebarBgVar] = React.useState("");

  React.useEffect(() => {
    const update = () => {
      const root = document.documentElement;
      setHtmlClass(root.className);
      setSidebarVar(
        getComputedStyle(root).getPropertyValue("--sidebar").trim()
      );
      setSidebarFgVar(
        getComputedStyle(root).getPropertyValue("--sidebar-foreground").trim()
      );
      setSidebarBgVar(
        getComputedStyle(root).getPropertyValue("--color-sidebar-background").trim()
      );
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("storage", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        right: 8,
        background: "#222",
        color: "#fff",
        padding: "0.75rem 1.25rem",
        borderRadius: 8,
        fontSize: 14,
        zIndex: 9999,
        opacity: 0.95,
        fontFamily: "monospace",
        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
        pointerEvents: "auto",
      }}
    >
      <div>
        <strong>html.class:</strong> <span>{htmlClass || "(none)"}</span>
      </div>
      <div>
        <strong>--sidebar:</strong> <span>{sidebarVar || "(unset)"}</span>
      </div>
      <div>
        <strong>--sidebar-foreground:</strong> <span>{sidebarFgVar || "(unset)"}</span>
      </div>
      <div>
        <strong>--color-sidebar-background:</strong> <span>{sidebarBgVar || "(unset)"}</span>
      </div>
    </div>
  );
}
