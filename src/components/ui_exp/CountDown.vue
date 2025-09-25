<template>
    <div class="demo">
  <div class="demo__colored-blocks">
    <div class="demo__colored-blocks-rotater">
      <div class="demo__colored-block"></div>
      <div class="demo__colored-block"></div>
      <div class="demo__colored-block"></div>
    </div>
    <div class="demo__colored-blocks-inner"></div>
    <!-- <div class="demo__text">Ready</div> -->
  </div>
  <div class="demo__inner">
    <svg class="demo__numbers" viewBox="0 0 100 100">
      <path
        :key="value"
        class="demo__numbers-path draw"
        :d="currentPath"
        :style="dashStyle"
      />
    </svg>
  </div>
</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number,
    required: true,
    validator: v => [1, 2, 3].includes(v)
  }
});

const paths = {
  1: 'M40,28 55,22 55,78',
  2: 'M69,73 l-35,0 l30,-30 a16,16 0 0,0 -22.6,-22.6 l-7,7',
  3: 'M30,20 60,20 40,50 a18,15 0 1,1 -12,19'
};

const lengths = {
  1: 72.1554946899414,
  2: 136.02162170410156,
  3: 144.4256591796875
};

const currentPath = computed(() => paths[props.value]);
const dashStyle = computed(() => {
  const len = lengths[props.value];
  return {
    strokeDasharray: `${len}, ${len}`,
    strokeDashoffset: len
  };
});
</script>

<style scoped>
/* Converted from SCSS to plain CSS */

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #ffffff;
  font-family: Helvetica, Arial, sans-serif;
}

.demo {
  position: absolute;
  left: 50%;
  top: 45%;
  width: 220px;
  height: 220px;
  margin-top: -110px;
  padding: 10px;
  border-radius: 20px;
  transform: translateX(-50%);
}

.demo__colored-blocks {
  overflow: hidden;
  position: absolute;
  left: 50%;
  top: 0;
  width: 220px;
  height: 100%;
  margin-left: -110px;
  padding: 10px;
  border-radius: 20px;
  perspective: 1000px;
  animation: demoAnim 4s ease-in-out infinite; /* removed contAnim */
}

.demo__colored-blocks-rotater {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  animation: rotation 1.3s linear infinite;
}

.demo__colored-blocks-inner {
  overflow: hidden;
  position: relative;
  height: 100%;
  background: #ffffff;
  border-radius: inherit;
}

.demo__colored-block {
  position: absolute;
  left: 50%;
  top: 45%;
  width: 300%;
  height: 300%;
  transform-origin: 0 0;
}

.demo__colored-block:nth-child(1) {
  transform: rotate(0deg) skewX(-30deg);
  background-color: #FD3359;
}

.demo__colored-block:nth-child(2) {
  transform: rotate(120deg) skewX(-30deg);
  background-color: #F4D302;
}

.demo__colored-block:nth-child(3) {
  transform: rotate(240deg) skewX(-30deg);
  background-color: #21BDFF;
}

.demo__inner {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
}

.demo__numbers {
  overflow: visible;
  position: absolute;
  left: 50%;
  top: 45%;
  width: 160px;
  height: 160px;
  margin-left: -80px;
  margin-top: -80px;
}

.demo__numbers-path {
  fill: none;
  stroke-width: 12px;
  stroke: #32386D; /* colored stroke instead of white */
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 1;
  /* removed previous animation + fixed dash values (now dynamic inline) */
}

.demo__numbers-path.draw {
  animation: draw 0.8s ease forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

.demo__text {
  position: absolute;
  left: 50%;
  top: 0;
  width: 500px;
  height: 100%;
  margin-left: -250px;
  text-align: center;
  line-height: 140px;
  font-size: 100px;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 15px;
  transform: translateX(10px);
  animation: hideText 4s infinite;
}

@keyframes rotation {
  to {
    transform: rotate(360deg);
  }
}

@keyframes demoAnim {
  15% {
    border-radius: 20px;
    transform: rotate(0);
  }
  30%, 43% {
    border-radius: 50%;
    transform: rotate(360deg);
  }
  52%, 65% {
    border-radius: 0;
    transform: rotate(720deg);
  }
  78%, 90% {
    border-radius: 50%;
    transform: rotate(1080deg);
  }
  100% {
    border-radius: 20px;
    transform: rotate(1440deg);
  }
}

@keyframes hideText {
  15%, 100% {
    opacity: 1;
  }
  20%, 96% {
    opacity: 0;
  }
}
</style>