import { useSyncExternalStore } from "react";

type CartLine = { slug: string; quantity: number };

const KEY = "zeiss-shop-cart";
const listeners = new Set<() => void>();
let lines: CartLine[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");

function emit(next: CartLine[]) {
  lines = next.filter((line) => line.quantity > 0);
  localStorage.setItem(KEY, JSON.stringify(lines));
  for (const listener of listeners) listener();
}

function addToCart(slug: string, quantity: number) {
  const existing = lines.find((line) => line.slug === slug);
  emit(
    existing
      ? lines.map((line) =>
          line.slug === slug
            ? { ...line, quantity: Math.min(100, line.quantity + quantity) }
            : line,
        )
      : [...lines, { slug, quantity }],
  );
}

function setQuantity(slug: string, quantity: number) {
  emit(lines.map((line) => (line.slug === slug ? { ...line, quantity } : line)));
}

function removeFromCart(slug: string) {
  emit(lines.filter((line) => line.slug !== slug));
}

function useCart() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => lines,
  );
}

export { addToCart, removeFromCart, setQuantity, useCart };
export type { CartLine };
