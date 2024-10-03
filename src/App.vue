<script setup lang="ts">
import { ref } from 'vue'
import FlowLayout from './components/FlowLayout.vue'

const list = ref(Array.from({ length: 10 }, (_, index) => index + 1))

function add(num: number) {
  for (let i = 0; i < num; i++) {
    list.value.push(list.value.length + 1)
  }
}
const cols = ref(4)
</script>

<template>
  <div>
    <div style="position: sticky; top: 10px; z-index: 1;">
      <button @click="add(1)">
        Add 1
      </button>
      <button @click="add(5)">
        Add 5
      </button>
      <button @click="add(10)">
        Add 10
      </button>
      <input v-model="cols" type="range" :min="1" :max="5" :step="1">
    </div>

    <div>
      <FlowLayout class="test" style="width: 80vw; margin: 0 auto;" :cols="Number(cols)">
        <div v-for="item in list" :key="`_${item}`">
          {{ item }}
        </div>
      </FlowLayout>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.test > div {
  background-color: #666;
  border-radius: 10px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 高度不同 */
.test > div:nth-child(1n) {
  height: 80px;
}
.test > div:nth-child(2n) {
  height: 200px;
}
.test > div:nth-child(3n) {
  height: 150px;
}
.test > div:nth-child(4n) {
  height: 100px;
}
.test > div:nth-child(5n) {
  height: 120px;
}
</style>
