<script setup lang="ts">
import { RichText } from "#components";
import { ref } from "vue";

const html = ref(`<h1>Field notes</h1>
<p>A <strong>rich text</strong> editor on the foundation layer: the toolbar is icon-only, each button named for a screen reader and on hover, with one tab stop and the arrow keys moving between tools.</p>
<h2>What to try</h2>
<ul>
<li>Select a word and press <em>bold</em>: the selection stays put.</li>
<li>Tab into the toolbar from the text, then use the arrow keys.</li>
<li>Undo is off until there is something to undo.</li>
<li>Select a word and press <em>link</em>, or put the caret in <a href="https://tiptap.dev">a link</a> to change or remove it.</li>
<li>Press <em>image</em> and give it an address; click an image, then the button, to change it.</li>
</ul>
<blockquote><p>Inside a code block the marks turn off, because the block admits none.</p></blockquote>
<pre><code>const can = editor.can.toggle("bold"); // false here</code></pre>`);
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div>
        <h1 class="page-title">Editor</h1>
        <p class="page-lead">
          The rich text component of the foundation layer, as an app would style
          it.
        </p>
      </div>
    </header>

    <section class="demo">
      <RichText v-model="html" :features="{ headings: [1, 2, 3] }" />
    </section>

    <section class="output">
      <h2 class="output-title">HTML</h2>
      <pre class="output-code"><code>{{ html }}</code></pre>
    </section>
  </div>
</template>
