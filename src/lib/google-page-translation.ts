import i18n from "./i18n";

const ENDPOINT = "/api/translate-ui";
const MAX_BATCH_SIZE = 80;
const MAX_BATCH_CHARACTERS = 18_000;
const IGNORED_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA"]);

type OriginalText = { source: string; rendered: string; language: string };
const originals = new Map<Text, OriginalText>();
const inFlight = new Set<Text>();
let activeLanguage = "";
let scanTimer: ReturnType<typeof setTimeout> | undefined;
let scanQueued = false;

function isTranslatable(node: Text): boolean {
  const text = node.nodeValue;
  const parent = node.parentElement;
  if (!text?.trim() || !parent || IGNORED_TAGS.has(parent.tagName)) return false;
  if (parent.closest("[data-translation-exclude], [contenteditable='true'], .notranslate")) return false;
  return true;
}

function collectTextNodes(root: Node): Text[] {
  const nodes: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current: Node | null;
  while ((current = walker.nextNode())) {
    const node = current as Text;
    if (!isTranslatable(node)) continue;

    const existing = originals.get(node);
    if (existing && node.nodeValue !== existing.rendered) {
      // React may have replaced this node's content. Keep its newest source text.
      existing.source = node.nodeValue ?? "";
      existing.rendered = existing.source;
      existing.language = "";
    }
    if (!existing || existing.language !== activeLanguage) nodes.push(node);
  }
  return nodes;
}

async function translateBatch(nodes: Text[], language: string) {
  if (!nodes.length || language === "en") return;
  const texts = nodes.map((node) => originals.get(node)?.source ?? node.nodeValue ?? "");
  nodes.forEach((node) => inFlight.add(node));

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, targetLang: language }),
    });
    if (!response.ok) return;
    const result = (await response.json()) as { translations?: string[] };
    if (language !== activeLanguage || !Array.isArray(result.translations)) return;

    nodes.forEach((node, index) => {
      const translated = result.translations?.[index];
      if (!translated || !node.isConnected) return;
      const entry = originals.get(node) ?? {
        source: texts[index] ?? "",
        rendered: texts[index] ?? "",
        language: "",
      };
      // Do not overwrite text that React changed while the request was in flight.
      if (node.nodeValue !== entry.rendered) return;
      entry.rendered = translated;
      entry.language = language;
      originals.set(node, entry);
      node.nodeValue = translated;
    });
  } catch {
    // Keep the original text visible when Google or the network is unavailable.
  } finally {
    nodes.forEach((node) => inFlight.delete(node));
  }
}

async function translateNodes(nodes: Text[], language: string) {
  const pending = nodes.filter((node) => !inFlight.has(node));
  let batch: Text[] = [];
  let characters = 0;

  for (const node of pending) {
    const length = (originals.get(node)?.source ?? node.nodeValue ?? "").length;
    if (batch.length && (batch.length >= MAX_BATCH_SIZE || characters + length > MAX_BATCH_CHARACTERS)) {
      await translateBatch(batch, language);
      batch = [];
      characters = 0;
    }
    batch.push(node);
    characters += length;
  }
  if (batch.length) await translateBatch(batch, language);
}

function scheduleScan(root: Node = document.body) {
  if (!root || scanQueued) return;
  scanQueued = true;
  scanTimer = setTimeout(() => {
    scanQueued = false;
    if (activeLanguage === "en") return;
    void translateNodes(collectTextNodes(root), activeLanguage);
  }, 80);
}

function applyLanguage(language: string) {
  activeLanguage = language;
  if (language === "en") {
    for (const [node, entry] of originals) {
      if (!node.isConnected) {
        originals.delete(node);
        continue;
      }
      if (node.nodeValue === entry.rendered) node.nodeValue = entry.source;
      entry.rendered = entry.source;
      entry.language = "en";
    }
    return;
  }

  // Restore source text before translating again, so changing languages never
  // translates a previous Google translation into the next language.
  for (const [node, entry] of originals) {
    if (!node.isConnected) {
      originals.delete(node);
      continue;
    }
    if (node.nodeValue === entry.rendered) node.nodeValue = entry.source;
    entry.rendered = entry.source;
    entry.language = "";
  }
  if (document.body) scheduleScan(document.body);
}

function start() {
  if (!document.body) return;
  activeLanguage = i18n.resolvedLanguage || i18n.language || "en";
  const observer = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === "characterData" && record.target instanceof Text) {
        const entry = originals.get(record.target);
        if (entry && record.target.nodeValue !== entry.rendered) {
          entry.source = record.target.nodeValue ?? "";
          entry.rendered = entry.source;
          entry.language = "";
        }
      }
      for (const added of Array.from(record.addedNodes)) {
        if (added.nodeType === Node.ELEMENT_NODE || added.nodeType === Node.TEXT_NODE) {
          scheduleScan(added);
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  scheduleScan(document.body);
  i18n.on("languageChanged", applyLanguage);
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}
