<template>
  <!-- HTML !-->
  <div class="buzzer-responsive">
    <div class="buzzer buzzer-scale">
      <div class="button-platform"></div>
      <button
        class="button-4"
        :class="{ pressed: isPressed }"
        type="button"
        role="button"
        :aria-pressed="isPressed.toString()"
        @click="press"
      >
        <span class="text">BUZZER</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits(['buzz','released'])

const props = defineProps({
  // Change this value (e.g. increment a counter) from parent to force unpress
  releaseToken: {
    type: [Number, String, Boolean],
    default: 0
  },
  buzzed: { type: Boolean, default: false }
})

const isPressed = ref(false)

// Only allow pressing if currently unpressed
const press = () => {
  if (isPressed.value) return
  isPressed.value = true
  emit('buzz', true)
}

// Watch external releaseToken to unpress
watch(() => props.releaseToken, () => {
  if (isPressed.value) {
    isPressed.value = false
    emit('released', false)
  }
})

// Mirror buzzed prop into isPressed whenever parent updates it
watch(() => props.buzzed, (val) => {
  isPressed.value = !!val
})

const handleKeydown = (e) => {
  if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault()
    press()
  }
}

onMounted(() => {
  isPressed.value = !!props.buzzed
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style>
button.button-4,
button.button-4:before,
button.button-4:after {
  box-sizing: border-box;
}

button.button-4 {
  touch-action: manipulation;
  position: relative;
  background: transparent;
  border: 1px solid #000; /* was none */
  outline: none;
  display: block;
  height: 150px;
  width: 500px;
  padding: 20px;
  font-size: 20px;
  line-height: 20px;
  font-weight: 100;
  text-transform: uppercase;
  margin: 0 auto;
  border-radius: 10px;
  top: 0px; /* was 0; now always raised */
  -webkit-transition: 0.05s ease-in-out;
  -moz-transition: 0.05s ease-in-out;
  -ms-transition: 0.05s ease-in-out;
  -o-transition: 0.05s ease-in-out;
  transition: 0.05s ease-in-out;
}

button.button-4 {
  touch-action: manipulation;
  transform: perspective(500px) rotateX(45deg);
}

button.button-4:before {
  content: "";
  display: block;
  position: absolute;
  z-index: 1;
  background: #f25d30;
  /* Old browsers */
  background: -moz-linear-gradient(top, #f25d30 0%, #e03b00 100%);
  /* FF3.6+ */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #f25d30), color-stop(100%, #e03b00));
  /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top, #f25d30 0%, #e03b00 100%);
  /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(top, #f25d30 0%, #e03b00 100%);
  /* Opera 11.10+ */
  background: -ms-linear-gradient(top, #f25d30 0%, #e03b00 100%);
  /* IE10+ */
  background: linear-gradient(to bottom, #f25d30 0%, #e03b00 100%);
  /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#f25d30", endColorstr="#e03b00",GradientType=0 );
  /* IE6-9 */
  top: 0;
  left: 0;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-shadow: inset 0 -2px 5px rgba(255, 255, 255, 0.3);
}

button.button-4:after {
  content: "";
  display: block;
  position: absolute;
  bottom: -42px;     /* was -10px */
  left: 11px;
  height: 47px;      /* was 15px */
  width: 476px;
  background: #ba2500;
  /* Old browsers */
  background: -moz-linear-gradient(top, #ba2500 0%, #9b3100 100%);
  /* FF3.6+ */
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #ba2500), color-stop(100%, #9b3100));
  /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(top, #ba2500 0%, #9b3100 100%);
  /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(top, #ba2500 0%, #9b3100 100%);
  /* Opera 11.10+ */
  background: -ms-linear-gradient(top, #ba2500 0%, #9b3100 100%);
  /* IE10+ */
  background: linear-gradient(to bottom, #ba2500 0%, #9b3100 100%);
  /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#ba2500", endColorstr="#9b3100",GradientType=0 );
  /* IE6-9 */
  border-radius: 0 0 5px 5px;
   transform: perspective(400px) rotateX(-40deg);
  box-shadow: inset 0 -2px 3px rgba(0, 0, 0, 0.5), 0 3px 2px -1px black;
  -webkit-transition: 0.05s ease-in-out;
  -moz-transition: 0.05s ease-in-out;
  -ms-transition: 0.05s ease-in-out;
  -o-transition: 0.05s ease-in-out;
  transition: 0.05s ease-in-out;
}

button.button-4:hover {
  top: -1px;

}


button.button-4:active {
  top: 30px;
}

button.button-4:active:after {
  height: 0px;      
  bottom: 0px;     
}

button.button-4.pressed {
  top: 30px;
}

button.button-4.pressed:after {
  height: 0px;
  bottom: 0px;
}

button.button-4 .text {
  position: relative;
  z-index: 2;
  font-weight: bold;
  font-size: 72px;
  color: white;
  text-shadow: 0 4px 4px rgba(0, 0, 0, 12);
}

.buzzer {
  position: relative;
 
  margin: 0 auto;
}

.buzzer .button-platform {
  position: absolute;
  left: 50%;
  top: 20px; /* sits just below the button's bottom piece */
  height: 180px;
  width: 600px;
  transform: translateX(-50%) perspective(500px) rotateX(45deg);
  background: #fff;
  border: 1px solid #000;
  border-radius: 10px;
  box-shadow: 0 6px 0 0 #000, 0 0px 0px -40px rgba(0,0,0,0.95);
  
  z-index: 0;
}

.buzzer .button-4 {
  position: relative;
  z-index: 2;
}

/* Responsive scaling additions */
:root {
  --buzzer-scale: 1;
}

.buzzer-responsive {
  width: 100%;
  display: flex;
  justify-content: center;
  /* Allow horizontal scroll avoidance if scaled large */
  overflow: visible;
  padding: 0 0 20px 0;
}

.buzzer-scale {
  transform: scale(var(--buzzer-scale));
  transform-origin: top center;
  /* Smoother rendering */
  will-change: transform;
}

/* Breakpoints (adjust only scale, not intrinsic sizes) */
@media (max-width: 1200px) { :root { --buzzer-scale: 0.9; } }
@media (max-width: 992px)  { :root { --buzzer-scale: 0.8; } }
@media (max-width: 768px)  { :root { --buzzer-scale: 0.65; } }
@media (max-width: 576px)  { :root { --buzzer-scale: 0.55; } }
@media (max-width: 420px)  { :root { --buzzer-scale: 0.48; } }

/* Optional: ensure platform shadows not clipped */
.buzzer-responsive .buzzer {
  overflow: visible;
}
</style>