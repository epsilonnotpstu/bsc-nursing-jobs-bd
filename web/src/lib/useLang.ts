"use client";

import { useEffect, useState } from "react";
import type { Lang } from "./i18n";

const EVENT = "langchange";

function currentLang(): Lang {
  return document.documentElement.dataset.lang === "en" ? "en" : "bn";
}

export function setLang(lang: Lang) {
  const html = document.documentElement;
  html.dataset.lang = lang;
  html.lang = lang;
  try {
    localStorage.setItem("lang", lang);
  } catch {
    // Private mode / blocked storage: the switch still works for this page view.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** For text that can't use <T> (placeholders, <option>, computed labels). Starts as "bn" to match the prerender. */
export function useLang(): Lang {
  const [lang, setState] = useState<Lang>("bn");
  useEffect(() => {
    const update = () => setState(currentLang());
    update();
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, []);
  return lang;
}
