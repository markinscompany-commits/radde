/**
 * Типограф — заменяет обычные пробелы после коротких предлогов/союзов
 * на неразрывные (&nbsp;), чтобы они не оставались в конце строки.
 */

const shortWords = /(\s|^)(в|и|к|о|с|у|а|я|на|не|ни|но|по|за|из|от|до|об|во|со|ко|же|бы|ли|их|мы|он|ее|её|ей|им|то|те|ту|та)\s/gi

export function useTypograf() {
  function fix(text: string): string {
    return text.replace(shortWords, (_, before, word) => {
      return `${before}${word}\u00A0`
    })
  }

  /** Применить типограф ко всем текстовым узлам внутри элемента */
  function applyToElement(el: HTMLElement) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const nodes: Text[] = []
    let node: Text | null
    while ((node = walker.nextNode() as Text)) {
      nodes.push(node)
    }
    nodes.forEach((textNode) => {
      const original = textNode.textContent || ''
      const fixed = fix(original)
      if (fixed !== original) {
        textNode.textContent = fixed
      }
    })
  }

  return { fix, applyToElement }
}
