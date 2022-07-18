import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    todos: [],
    count: 0,
  }),
  actions: {
    increment() {
      this.count++;
    }
  }
});
