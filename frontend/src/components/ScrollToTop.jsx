import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      const mainElement = document.querySelector(".mantine-AppShell-main");
      if (mainElement) {
        mainElement.scrollTop = 0;
      }
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Triple scroll invocation required for Mantine AppShell async rendering
    // Mantine's AppShell.Main component renders asynchronously, requiring multiple
    // scroll attempts. Tested alternatives (single scroll, requestAnimationFrame,
    // useLayoutEffect) all failed. This pattern ensures scroll works reliably.
    scrollToTop();
    setTimeout(scrollToTop, 0);
    setTimeout(scrollToTop, 100);
  }, [pathname]);

  return null;
}
