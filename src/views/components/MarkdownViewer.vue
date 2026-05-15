<template>
  <div class="markdown-container" @click="handleCopy" v-html="renderedContent"></div>
</template>

<script setup>
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; 

const props = defineProps({
  rawText: {
    type: String,
    required: true,
    default: ''
  }
});

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});


md.renderer.rules.fence = function (tokens, idx) {
  const token = tokens[idx];
  let lang = token.info.trim();
  const code = token.content; 

  let highlightedCode = '';
  
  if (lang && hljs.getLanguage(lang)) {
    try {
      highlightedCode = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
    } catch (__) {}
  } else {
    highlightedCode = md.utils.escapeHtml(code);
    lang = 'text'; 
  }


  return `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-lang">${lang}</span>
        <button class="copy-btn" data-code="${encodeURIComponent(code)}">
          <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span class="copy-text">Copy code</span>
        </button>
      </div>
      <pre class="hljs"><code>${highlightedCode}</code></pre>
    </div>
  `;
};

const renderedContent = computed(() => {
  return md.render(props.rawText);
});


const handleCopy = async (event) => {
  const btn = event.target.closest('.copy-btn');
  if (!btn) return; 

  const encodedCode = btn.getAttribute('data-code');
  if (encodedCode) {
    const rawCode = decodeURIComponent(encodedCode);
    try {
      await navigator.clipboard.writeText(rawCode);
      
      const textSpan = btn.querySelector('.copy-text');
      const originalText = textSpan.innerText;
      textSpan.innerText = 'Copied!';
      btn.classList.add('copied');

      setTimeout(() => {
        textSpan.innerText = originalText;
        btn.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Lỗi khi copy: ', err);
    }
  }
};
</script>

<style>

.markdown-container {
  line-height: 1.6;
  font-size: 15px;
}

.code-block-wrapper {
  margin: 1.5em 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f6f8fa; 
  border: 1px solid #d0d7de; 
}

.code-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #eaecef; 
  color: #57606a;
  font-size: 12px;
  border-bottom: 1px solid #d0d7de;
}

.code-lang {
  text-transform: uppercase;
  font-weight: 600;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #8b949e;
  cursor: pointer;
  font-size: 12px;
  transition: color 0.2s;
}

.copy-btn:hover {
  color: #c9d1d9; 
}

.copy-btn.copied {
  color: #2ea043;
}

.code-block-wrapper pre.hljs {
  margin: 0;
  padding: 16px;
  border-radius: 0; 
  overflow-x: auto;
  background-color: transparent !important;
}

.code-block-wrapper code {
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 14px;
}
</style>