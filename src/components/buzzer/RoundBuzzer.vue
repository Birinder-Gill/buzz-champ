<template>
  <button
    :type="type"
    :class="['threed-btn', { 'threed-btn--secondary': variant === 'secondary' }]"
    @click="$emit('click', $event)"
  >
    <span class="threed-btn__inner">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'ThreeDButton',
  props: {
    label: { type: String, default: '3D Button' },
    variant: { type: String, default: 'primary' }, // 'primary' | 'secondary'
    type: { type: String, default: 'button' } // 'button' | 'submit' | 'reset'
  }
}
</script>

<style scoped>
/* Optional font (applies only to this component due to 'scoped') */
@import url('https://fonts.googleapis.com/css?family=Dosis');

/* Base button */
.threed-btn {
  font-family: 'Dosis', cursive;
  font-size: 3.5vw; /* reduced from 5vw */
  border: none;
  background-color: rgb(235, 235, 240);
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  user-select: none;
  position: relative;
  z-index: 1;
  padding: 0;
  cursor: pointer;
}

/* Larger screens */
@media (min-width: 40em) {
  .threed-btn {
    font-size: 1.4em; /* reduced from 2em */
  }
}

/* Shadow (right bar) */
.threed-btn::before {
  content: "";
  position: absolute;
  z-index: -1;
  width: 10px;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 10, 50, 0.2);
  transition: transform 0.6s cubic-bezier(0, .90, .13, .90);
  transform: translate3d(0, 0, 0);
}

/* Base background layer */
.threed-btn::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(235, 235, 240);
  z-index: -1;
}

/* Interactions */
.threed-btn:hover::before,
.threed-btn:focus::before {
  transform: translate3d(10px, 0, 0);
}

.threed-btn:active::before {
  transform: translate3d(0, 0, 0);
}

.threed-btn:focus,
.threed-btn:active {
  outline: none;
}

/* The inner face with the text */
.threed-btn__inner {
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #333;
  padding: 1em 1.5em;
  background-color: #fbfbfb;
  display: block;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0, .90, .13, .90), background-color 0.2s ease;
  position: relative;

  /* subtle texture from your original */
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI5OS4zNCIgaGVpZ2h0PSI5OS44NiIgdmlld0JveD0iMCAwIDk5LjM0IDk5Ljg2Ij48dGl0bGU+cmFuZG9tX2RvdHMtLWxhcmdlPC90aXRsZT48Y2lyY2xlIGN4PSI4IiBjeT0iNjIuNDEiIHI9IjEuMDYiIHN0eWxlPSJmaWxsOiMwMDBmM2M7b3BhY2l0eTowLjAzIi8+PGNpcmNsZSBjeD0iMjUuNzgiIGN5PSI1MS4wNiIgcj0iMS4wNiIgc3R5bGU9ImZpbGw6IzAwMGYzYztvcGFjaXR5OjAuMDUiLz48Y2lyY2xlIGN4PSIzNi4yOCIgY3k9Ijc0Ljg3IiByPSIxLjA2IiBzdHlsZT0iZmlsbDojMDAzYTAzO29wYWNpdHk6MC4wNyIvPjxjaXJjbGUgY3g9IjQ1LjA3IiBjeT0iNzIuNTUiIHI9IjEuMDYiIHN0eWxlPSJmaWxsOiMwMDBmM2M7b3BhY2l0eTowLjA1Ii8+PGNpcmNsZSBjeD0iMTAuNyIgY3k9IjkwLjk5IiByPSIxLjA2IiBzdHlsZT0iZmlsbDojMDAwZjNjO29wYWNpdHk6MC4wNSIvPiA8L3N2Zz4=);
   /* added to make text a little bolder */
}

/* Lift and color on hover/focus */
.threed-btn:hover .threed-btn__inner,
.threed-btn:focus .threed-btn__inner {
  transform: translate3d(0, -10px, 0);
  background-color: #fff;
}

.threed-btn:active .threed-btn__inner {
  transform: translate3d(0, 0, 0);
}

/* Secondary variant */
.threed-btn.threed-btn--secondary {
  background-color: #00d18e;
  z-index: 0;
}

.threed-btn.threed-btn--secondary::after {
  background-color: #00d18e;
}

.threed-btn.threed-btn--secondary .threed-btn__inner {
  background-color: #00ffb2;
  /* Default to lifted state for secondary variant */
  transform: translate3d(0, -10px, 0);
}

.threed-btn.threed-btn--secondary::before {
  /* Default to shifted shadow to enhance 3D effect */
  transform: translate3d(10px, 0, 0);
}

.threed-btn.threed-btn--secondary:hover .threed-btn__inner,
.threed-btn.threed-btn--secondary:focus .threed-btn__inner {
  background-color: #11ffb3;
}
</style>
