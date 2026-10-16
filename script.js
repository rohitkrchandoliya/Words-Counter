const textInput = document.getElementById('textInput');

function countWords(text) {
    if (!text.trim()) return 0;

    // Segmenter handles Unicode words (including many non-Latin scripts)
    // and avoids treating punctuation-only chunks as words.
    if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
        let count = 0;
        for (const part of segmenter.segment(text)) {
            if (part.isWordLike) count += 1;
        }
        return count;
    }

    // Fallback for browsers without Intl.Segmenter.
    const words = text.match(/[\p{L}\p{N}_]+(?:['’][\p{L}\p{N}_]+)*/gu);
    return words ? words.length : 0;
}

function countSentences(text) {
    const trimmed = text.trim();
    if (!trimmed) return 0;

    if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'sentence' });
        let count = 0;
        for (const sentence of segmenter.segment(trimmed)) {
            if (sentence.segment.trim()) count += 1;
        }
        return count;
    }

    // A practical fallback: count punctuation-terminated sentences and
    // include any final non-empty text without terminal punctuation.
    const matches = trimmed.match(/[^.!?]+(?:[.!?]+["'”’)}\]]*)?(?=\s|$)/gu);
    return matches ? matches.filter(sentence => sentence.trim()).length : 0;
}

function updateCounts() {
    const text = textInput.value;

    document.getElementById('wordCount').textContent = countWords(text);
    document.getElementById('charCount').textContent = text.length;
    document.getElementById('charCountNoSpace').textContent = text.replace(/\s/gu, '').length;
    document.getElementById('sentenceCount').textContent = countSentences(text);
}

textInput.addEventListener('input', updateCounts);
updateCounts();
