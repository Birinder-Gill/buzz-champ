<template>
  <div class="decor-bg" aria-hidden="true">
    <div class="decor-layer">
      <component
        v-for="(s,i) in shapeSet"
        :is="s.comp"
        :key="i"
        v-bind="s"
      />
    </div>
    <div class="decor-gradient" />
  </div>
</template>

<script setup lang="ts">
import { defineComponent, h } from 'vue';

interface ShapeBase {
  size: number;
  color: string;
  top: string;
  left: string;
  rotate?: number;
  opacity?: number;
  delay?: number;
}

function shapeStyle(p: ShapeBase, extra: Record<string,string> = {}) {
  return {
    position: 'absolute',
    width: p.size + 'px',
    height: p.size + 'px',
    top: p.top,
    left: p.left,
    '--c': p.color,
    opacity: (p.opacity ?? 0.13).toString(),
    transform: `translate(-50%, -50%) rotate(${p.rotate ?? 0}deg)`,
    animationDelay: (p.delay ?? 0) + 's',
    ...extra
  };
}

const ShapeCircle = defineComponent<ShapeBase>({
  name: 'ShapeCircle',
  props: ['size','color','top','left','rotate','opacity','delay'],
  setup(props){ return () => h('div',{ class:'shape shape-circle', style: shapeStyle(props) }); }
});

const ShapeBlob = defineComponent<ShapeBase>({
  name: 'ShapeBlob',
  props: ['size','color','top','left','rotate','opacity','delay'],
  setup(props){
    return () => h('div',{
      class:'shape shape-blob',
      style: shapeStyle(props, { clipPath: 'path("M53.5 -58Q70 -43 72 -21.5Q74 0 66 19Q58 38 44 55.5Q30 73 12.5 68.5Q-5 64 -22.5 57.5Q-40 51 -49 36.5Q-58 22 -64 5.5Q-70 -11 -63.5 -26Q-57 -41 -45 -57Q-33 -73 -16.5 -74Q0 -75 18 -72Q36 -69 53.5 -58Z")' })
    });
  }
});

const ShapeTriangle = defineComponent<ShapeBase>({
  name: 'ShapeTriangle',
  props: ['size','color','top','left','rotate','opacity','delay'],
  setup(props){
    return () => h('div',{
      class:'shape shape-triangle',
      style: shapeStyle(props, { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' })
    });
  }
});

const ShapeZigzag = defineComponent<ShapeBase>({
  name: 'ShapeZigzag',
  props: ['size','color','top','left','rotate','opacity','delay'],
  setup(props){
    return () => h('div',{
      class:'shape shape-zigzag',
      style: shapeStyle(props)
    }, [
      h('svg', { width: '100%', height: '100%', viewBox: '0 0 100 100', fill:'none' }, [
        h('polyline', { points: '0,20 25,40 50,20 75,40 100,20 100,80 75,60 50,80 25,60 0,80 0,20', stroke: 'var(--c)', 'stroke-width': 10, strokeLinecap:'round', strokeLinejoin:'round', fill:'transparent' })
      ])
    ]);
  }
});

const shapeSet = [
  { comp: ShapeCircle,   size: 170, color:'#c7d2fe', top:'14%', left:'12%', opacity:.25, rotate:0 },
  { comp: ShapeBlob,     size: 210, color:'#fecaca', top:'74%', left:'18%', opacity:.22, rotate:18 },
  { comp: ShapeTriangle, size: 140, color:'#bfdbfe', top:'30%', left:'83%', opacity:.20, rotate:10 },
  { comp: ShapeZigzag,   size: 150, color:'#bbf7d0', top:'80%', left:'70%', opacity:.28, rotate:-6 },
  { comp: ShapeCircle,   size: 100, color:'#fde68a', top:'50%', left:'9%',  opacity:.30 },
  { comp: ShapeBlob,     size: 140, color:'#fbcfe8', top:'50%', left:'52%', opacity:.18, rotate:-14 },
  { comp: ShapeTriangle, size: 100, color:'#e9d5ff', top:'16%', left:'54%', opacity:.22, rotate:-20 },
  { comp: ShapeCircle,   size: 80,  color:'#a5f3fc', top:'86%', left:'46%', opacity:.26 },
  { comp: ShapeZigzag,   size: 120, color:'#fde68a', top:'38%', left:'32%', opacity:.24, rotate:4 }
];
</script>

<style scoped>
.decor-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0; /* behind app content */
  background: linear-gradient(135deg,#ffffff 0%, #f8fafc 80%);
}
.decor-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 80% 20%, #e2e8f00f, transparent 60%),
    radial-gradient(circle at 15% 75%, #e2e8f00d, transparent 65%);
  mix-blend-mode: normal;
}
.decor-layer { position: absolute; inset:0; }
.shape { filter:none; animation: shapeFloat 20s ease-in-out infinite, shapePulse 9s ease-in-out infinite; mix-blend-mode:multiply; border-radius:24%; }
.shape-circle { border-radius:50%; }
.shape-triangle { border-radius:8%; }
.shape-blob { border-radius:38%; }
@keyframes shapeFloat { 0%,100% { transform: translate(-50%, -50%) rotate(var(--r,0deg)); } 50% { transform: translate(-50%, calc(-50% - 20px)) rotate(var(--r,0deg)); } }
@keyframes shapePulse { 0%,100% { transform-origin:center; } 50% { transform-origin:center; } }
</style>
