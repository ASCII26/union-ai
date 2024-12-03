<template>
  <div class="min-h-screen p-4 bg-gray-100">
    <h1 class="mb-6 text-3xl font-bold text-center">AI Chat Playground</h1>
    <div class="grid gap-4" :class="`grid-cols-${columns} grid-rows-${rows}]`" :style="{height: containerHeight}">
      <Chatbox v-for="provider in providers" :key="provider.name" :provider="provider" />
    </div>
  </div>

</template>
<script setup lang="ts">
import { ref } from 'vue'
import { BoltIcon, SparklesIcon, CloudIcon, BeakerIcon } from 'lucide-vue-next'
import { ProviderEnum } from '@unionai/core/dist/providers';
import Chatbox from './components/chat-box/index.vue';
import { Provider } from './type';

const providers = ref<Provider[]>([
  {
    name: ProviderEnum.OpenAI,
    model: 'gpt-4o-mini',
    icon: SparklesIcon,
  },
  {
    name: ProviderEnum.Claude,
    model: 'claude-3-5-sonnet-20240620',
    icon: BoltIcon,
  },
  // {
  //   id: 'gemini',
  //   name: 'Gemini-1.5-Flash',
  //   icon: CloudIcon,
  // },
  // {
  //   id: 'llama',
  //   name: 'Llama-3.2-90B',
  //   icon: BeakerIcon,
  // }
])

const columns = 2;
const rows = providers.value.length / columns
const containerHeight = `calc(100vh - 8rem)`
</script>

