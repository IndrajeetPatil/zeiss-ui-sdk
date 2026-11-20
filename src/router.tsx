import { useSyncExternalStore } from "react";
import type { AnchorHTMLAttributes, MouseEvent } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

function navigate(to: string) {
  const url = new URL(to, window.location.href);
  if (url.pathname + url.search === window.location.pathname + window.location.search) {
    if (url.hash)
      document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  window.history.pushState(null, "", url);
  for (const listener of listeners) listener();
  window.scrollTo(0, 0);
}

function useLocation() {
  const path = useSyncExternalStore(
    subscribe,
    () => window.location.pathname + window.location.search,
  );
  const url = new URL(path, window.location.origin);
  return { pathname: url.pathname, searchParams: url.searchParams };
}

function Link({ href = "/", onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      href={href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey
        )
          return;
        if (href.startsWith("#") || /^https?:/.test(href)) return;
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}

export { Link, navigate, useLocation };
