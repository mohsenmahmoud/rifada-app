import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { dict } from './dict';

export type Lang = 'ar' | 'en';

/**
 * Bilingual support, ported from `Rifada App Bilingual.dc.html`.
 *
 * Two deliberate choices:
 *
 * 1. The lookup is keyed on the Arabic string itself, not on invented message
 *    ids. A screen still literally reads `{t('الرئيسية')}`, and — more
 *    usefully — the data modules never had to change: a label arriving from
 *    `data/services.ts` resolves through the same table as one written inline,
 *    because both are the same Arabic text. A string with no entry falls
 *    through to the Arabic rather than vanishing or showing a key.
 *
 * 2. `t` is a plain function over a module-level language, not a hook. The
 *    alternative would put a `const t = useT()` line inside all ~90 component
 *    functions. Instead `LangProvider` keys its subtree on the language, so
 *    switching remounts the tree and every `t` call re-evaluates. That mirrors
 *    the prototype, which swaps between two separate phone components rather
 *    than re-rendering one in place.
 */

let currentLang: Lang = 'ar';

/** Translate one Arabic string. Returns it unchanged when the language is Arabic. */
export function t(ar: string): string {
  return currentLang === 'ar' ? ar : (dict[ar] ?? ar);
}

/** Read the language outside React (data builders, sort comparators). */
export function getLang(): Lang {
  return currentLang;
}

type Ctx = {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  isAr: boolean;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({
  children,
  initial = 'ar',
}: {
  children: ReactNode;
  initial?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initial);

  // Set before the subtree renders, so the first paint after a switch already
  // resolves through the new language.
  currentLang = lang;

  // `index.html` ships `dir="rtl"`, which would otherwise keep the document
  // right-to-left in English. Keep the root element in step so scrollbars,
  // text selection and native controls follow the language too.
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    el.setAttribute('lang', lang);
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      isAr: lang === 'ar',
      setLang: setLangState,
      toggle: () => setLangState((l) => (l === 'ar' ? 'en' : 'ar')),
    }),
    [lang],
  );

  return (
    <LangCtx.Provider value={value}>
      <div key={lang} dir={value.dir} style={{ display: 'contents' }}>
        {children}
      </div>
    </LangCtx.Provider>
  );
}

/** Falls back to Arabic outside a provider, so an isolated render still works. */
export function useLang(): Ctx {
  return (
    useContext(LangCtx) ?? {
      lang: 'ar',
      dir: 'rtl',
      isAr: true,
      setLang: () => {},
      toggle: () => {},
    }
  );
}
