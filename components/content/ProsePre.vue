<template>
  <div class="pre">
    <div class="pre-head">
      <div v-if="props.filename" class="filename">
        {{ filename }}
      </div>
      <button @click="copyCode" class="copy-btn">
        <Icon v-if="!codeCopied" name="uil:copy" size="1.4em" />
        <Icon v-else name="uil:check" size="1.4em" />
      </button>
    </div>
    <pre class="pre-body" :class="$props.class"><slot/></pre>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  code: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
});
const codeCopied = ref<boolean>(false);

const copyCode = (): void => {
  navigator.clipboard
    .writeText(props.code)
    .then(() => {
      codeCopied.value = true;
      setTimeout(function () {
        codeCopied.value = false;
      }, 1000);
    })
    .catch((e) => {
      console.error("Error: Unable to copy code.");
    });
};
</script>
<style lang="scss">
.pre {
  overflow-x: hidden;
  border-radius: 6px;
  margin-bottom: 3rem;
  background-color: hsl(223, 20%, 15%);
  border: 1px solid var(--background-color-lighter);

  &-head {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0.5rem 0.5rem 0.5rem 0.75rem;

    .filename,
    .copy-btn {
      font-family: Arial, "sans-serif";
      font-size: 0.8rem;
    }

    .filename {
      margin-left: 0;
      margin-right: auto;
      color: var(--light-main-opacity);
    }

    .copy-btn {
      padding: 0.25em 0.75em;
      border: 1px solid transparent;
      border-radius: 4px;
      display: grid;
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      opacity: 0;
      background-color: inherit;
      border-color: var(--light-main-opacity);
      color: var(--light-main-opacity);
      &:hover,
      &:active {
        color: var(--primary);
        border-color: var(--primary);
      }
    }
  }
  &:hover .copy-btn {
    opacity: 1;
  }
  &-body {
    margin: 0;
    padding: 0.75rem 0 0.75rem 0;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    overflow-x: auto;

    code {
      display: inline-block;
      width: 100%;
      min-width: max-content;
    }

    .line {
      padding: 0 0.75rem;
      line-height: 1.6;

      span {
        background-color: transparent !important;
      }

      &.highlight,
      &.highlighted {
        background-color: color-mix(in srgb, hsl(223, 20%, 15%) 85%, #888888);
      }

      &::before {
        content: attr(line);
        color: var(--light-main-opacity);
        padding-right: 1.25rem;
        display: inline-block;
        opacity: 0.8;
      }

      &.diff.remove {
        background-color: color-mix(
          in srgb,
          var(--background-color-lighter) 65%,
          #f43f5e
        );
      }

      &.diff.add {
        background-color: color-mix(
          in srgb,
          var(--background-color-lighter) 75%,
          #10b981
        );
      }
    }
  }
}

pre code .line {
  display: block;
}
</style>
