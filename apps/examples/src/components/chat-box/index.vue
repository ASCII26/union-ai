<template>
  <div class="flex flex-col overflow-hidden bg-white rounded-lg shadow-md">
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center space-x-2">
        <component :is="provider.icon" class="w-6 h-6" />
        <span class="font-medium">{{ provider.name }}</span>
      </div>
    </div>
    <div class="flex-grow p-4 space-y-4 overflow-y-auto">
      <template v-for="message in messages" :key="message.id">
        <div :class="[
          'max-w-[80%] rounded-lg py-2 px-4',
          message.type === 'user' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-gray-100'
        ]">
          {{ message.content }}
          <div v-if="message.type === 'assistant'" class="text-sm text-right text-gray-600">本次消费token：{{ message.usage?.total_tokens }}</div>
        </div>
      </template>
      <div v-if="tempAnswer" class="max-w-[80%] rounded-lg py-2 px-4 mr-auto bg-gray-100">
        {{ tempAnswer }}
      </div>
    </div>
    <div class="p-4 border-t">
      <a-input-search
        v-model:value="currentInput"
        placeholder="Ask AI..."
        enter-button="Send"
        size="large"
        @search="sendMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FinishData } from '@unionai/core';
import { unai } from '../../main';
import { Provider, RequestMessage } from '../../type';

const messages = ref<RequestMessage[]>([{ id: '1', type: 'system', content: '我是一个人工智能助手，随时为您提供帮助！' }])
const currentInput = ref<string>('')
const tempAnswer = ref<string>('')

const { provider } = defineProps({
  provider: {
    type: Object as () => Provider,
    required: true,
  }
})


const onMessage = (chunk: string) => {
  tempAnswer.value = tempAnswer.value + chunk
}

const onFinish = ({ usage }: FinishData) => {
  messages.value.push({
    id: (Date.now() + 1).toString(),
    type: 'assistant',
    content: tempAnswer.value,
    usage,
  })
  tempAnswer.value = ''
}

const sendMessage = () => {
  const content = currentInput.value.trim()
  if (!content) return

  messages.value.push({
    id: Date.now().toString(),
    type: 'user',
    content,
  })

  unai.request(
    {
      provider: provider.name,
      model: provider.model,
      messages: [{ role: "user", content }],
    },
    {
      onMessage,
      onError: (error) => console.error("===AI onError:", error),
      onFinish,
    }
  );

  // const adapter = unai[provider.name]
  // if (!adapter) {
  //   console.error('AI provider not found:', provider.name)
  //   return
  // }

  // adapter({
  //   model: provider.model,
  //   messages: [{ role: "user", content }],
  // },
  // {
  //   onMessage,
  //   onError: (error: any) => console.error("===AI onError:", error),
  //   onFinish,
  // })

  currentInput.value = ''
}

</script>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>