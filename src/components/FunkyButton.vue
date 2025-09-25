<template>
<button 
  class="button-56" 
  role="button"
  @click="handleClick"
  :disabled="disabled"
>
  <span class="text">{{ text }}</span>
</button>
</template>

<script>
export default {
  name: 'BuzzerTimer',
  props: {
    text: {
      type: String,
      default: 'Create new game'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  methods: {
    handleClick(event) {
      if (this.disabled) return;
      this.$emit('click', event);
    }
  }
}
</script>

<style>

.button-56 {
  border-radius: 0px;
  background-color: transparent;
  transition: border-color 0.25s;
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  letter-spacing: 2px;
  text-decoration: none;
  text-transform: uppercase;
  color: #000;
  cursor: pointer;
  border: 3px solid;
  padding: 0.25em 0.5em;
  box-shadow: 1px 1px 0px 0px, 2px 2px 0px 0px, 3px 3px 0px 0px, 4px 4px 0px 0px, 5px 5px 0px 0px;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-56:active {
  box-shadow: 0px 0px 0px 0px;
  top: 5px;
  left: 5px;
}

@media (min-width: 768px) {
  .button-56 {
    padding: 0.25em 0.75em;
  }
}

</style>