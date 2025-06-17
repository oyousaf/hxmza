export type Theme = "light" | "dark" | "system";

const THEME_KEY = "theme";

export function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem(THEME_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");

  if (theme === "system") {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.classList.add(systemPrefersDark ? "dark" : "light");
  } else {
    root.classList.add(theme);
  }
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function toggleTheme(): Theme {
  const current = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
  const next: Theme = current === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}
