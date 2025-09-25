<template>
  <!-- replaced native button element with v-btn -->
  <v-btn
    class="button-55"
    variant="flat"
    :ripple="false"
    v-bind="$attrs"
    :style="buttonStyles"
    @click="handleClick"
  >
    <span class="text">{{ text }}</span>
  </v-btn>
</template>

<script>
export default {
  name: 'BuzzerTimer',
  props: {
    text: {
      type: String,
      default: 'Create new game'
    },
    color: {
      type: String,
      default: '#000'
    }
  },
  emits: ['click'],
  computed: {
    buttonStyles() {
      return {
        backgroundColor: this.color,
        borderColor: this.color,
        boxShadow: `#fff 4px 4px 0 0, ${this.color} 4px 4px 0 1px`
      }
    }
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event);
    }
  }
}
</script>

<style>

.button-55 {
  /* ensure v-btn flex center & override default styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* keep existing look (rest unchanged) */
  appearance: button;
  background-color: #000;
  background-image: none;
  border: 1px solid #000;
  border-radius: 4px;
  box-shadow: #fff 4px 4px 0 0,#000 4px 4px 0 1px;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.08em;
  margin: 0 5px 5px 0;
  overflow: visible;
  padding: 8px 28px;
  text-align: center;
  text-transform: none;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  --optical-shift: 1px; /* tweak if needed */
}

.button-55:focus {
  text-decoration: none;
}

.button-55:hover {
  text-decoration: none;
}

.button-55:active {
  box-shadow: rgba(0, 0, 0, .125) 0 3px 5px inset;
  outline: 0;
}

.button-55:not([disabled]):active {
  /* ...existing code... */
  box-shadow: #fff 2px 2px 0 0, var(--button-color, #000) 2px 2px 0 1px;
  transform: translate(2px, 2px);
}

.button-55 .text {
  padding: 0 2px;
  line-height: 1; /* helps vertical centering */
}

/* remove Vuetify overlay layers */
.button-55 :deep(.v-btn__overlay),
.button-55 :deep(.v-btn__underlay) {
  display: none;
}

.button-55:focus-visible {
  outline: none;
}

@media (min-width: 768px) {
  .button-55 {
    padding: 10px 36px;
  }
}
</style>