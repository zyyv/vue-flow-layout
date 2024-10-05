<script setup lang="ts">
import { computed, ref } from 'vue'

const list = ref(Array.from({ length: 10 }, (_, index) => index + 1))

function add(num: number) {
  if (num === -1) {
    list.value = Array.from({ length: 10 }, (_, index) => index + 1)
    return
  }

  for (let i = 0; i < num; i++) {
    list.value.push(list.value.length + 1)
  }
}
const cols = ref(4)
const gapX = ref(10)
const gapY = ref(10)
const gap = computed(() => [gapX.value, gapY.value].map(Number))
</script>

<template>
  <div>
    <div sticky left-1 top-1 z-1 space-x-2>
      <button btn @click="add(1)">
        Add 1
      </button>
      <button btn @click="add(5)">
        Add 5
      </button>
      <button btn @click="add(10)">
        Add 10
      </button>
      <button btn="~ ghost" @click="add(-1)">
        Reset
      </button>
      <div c-white>
        Cols: {{ cols }}
        <input v-model="cols" type="range" :min="1" :max="5" :step="1">
      </div>
      <div c-white>
        Gap X: {{ gapX }}
        <input v-model="gapX" type="range" :min="0" :max="20" :step="1">
      </div>
      <div c-white>
        Gap Y: {{ gapY }}
        <input v-model="gapY" type="range" :min="0" :max="20" :step="1">
      </div>
    </div>

    <FlowLayout w-80vw ma :cols="Number(cols)" :gap>
      <div v-for="item in list" :key="`_${item}`" class="card bg-gray:30 rd-md b b-gray:10 flex justify-center items-center">
        <div v-for="i in 3" :key="i">
          {{ `${item}_${i}` }},
        </div>
      </div>
    </FlowLayout>
  </div>
</template>

<style>
:root {
 background-color: #1f1f1f;
}
/* 高度不同 */
.card:nth-child(1n) {
  height: 80px;
}
.card:nth-child(2n) {
  height: 200px;
}
.card:nth-child(3n) {
  height: 150px;
}
.card:nth-child(4n) {
  height: 100px;
}
.card:nth-child(5n) {
  height: 120px;
}
</style>
