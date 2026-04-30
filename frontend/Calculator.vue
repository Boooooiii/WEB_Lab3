<template>
  <div class="calc-card p-2 bg-dark rounded">
    <div class="row mb-6">
      <div class="col-6 text-white fs-2 fw-bold" style="padding-left: 30px; padding-top: 10px;">
        Standard mode
      </div>
    </div>

    <div class="row mb-3">
  <label class="small text-white-50 text-end col-12">
    {{ store.state.previousValue }} {{ store.state.operator }} {{ store.state.currentValue }}
  </label>
  <div class="col-12 text-end text-white"     :style="{ fontSize: getFontSize }">
    {{ store.state.currentValue }}
  </div>
</div>

    <div class="row g-2 mt-2" @click="handleBtnClick">
        <div class="col-3"><button type="button" class="my-btn">%</button></div>
        <div class="col-3"><button type="button" class="my-btn">CE</button></div>
        <div class="col-3"><button type="button" class="my-btn">C</button></div>
        <div class="col-3"><button type="button" class="my-btn">⌫</button></div>
    </div>

    <div class="row g-2 mt-2" @click="handleBtnClick">
        <div class="col-3"><button type="button" class="my-btn">¹/x</button></div>
        <div class="col-3"><button type="button" class="my-btn">x²</button></div>
        <div class="col-3"><button type="button" class="my-btn">²√x</button></div>
        <div class="col-3"><button type="button" class="my-btn">÷</button></div>
    </div>

    <div class="row g-2 mt-2" @click="handleBtnClick">
        <div class="col-3"><button type="button" class="my-btn">7</button></div>
        <div class="col-3"><button type="button" class="my-btn">8</button></div>
        <div class="col-3"><button type="button" class="my-btn">9</button></div>
        <div class="col-3"><button type="button" class="my-btn">×</button></div>
    </div>

     <div class="row g-2 mt-2" @click="handleBtnClick">
        <div class="col-3"><button type="button" class="my-btn">4</button></div>
        <div class="col-3"><button type="button" class="my-btn">5</button></div>
        <div class="col-3"><button type="button" class="my-btn">6</button></div>
        <div class="col-3"><button type="button" class="my-btn">−</button></div>
    </div>

    <div class="row g-2 mt-2" @click="handleBtnClick">
        <div class="col-3"><button type="button" class="my-btn">1</button></div>
        <div class="col-3"><button type="button" class="my-btn">2</button></div>
        <div class="col-3"><button type="button" class="my-btn">3</button></div>
        <div class="col-3"><button type="button" class="my-btn">+</button></div>
    </div>

    <div class="row g-2 mt-2" @click="handleBtnClick">
        <div class="col-3"><button type="button" class="my-btn">+/-</button></div>
        <div class="col-3"><button type="button" class="my-btn">0</button></div>
        <div class="col-3"><button type="button" class="my-btn">.</button></div>
        <div class="col-3"><button type="button" class="my-btn btn-equal">=</button></div>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { computed } from 'vue';
import { store } from './JS/store.js';

const router = useRouter();

onMounted(async () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.id) {
        await store.fetchState(user.id); 
    } else {
        router.push('/auth'); 
    }
});

const handleBtnClick = (event) => {
    const btn = event.target.closest('button');
    if (!btn) return;

    const val = btn.textContent.trim(); 

    if (!isNaN(val) || val === '.') store.dispatch('DIGIT', val);
    else if (val === 'C') store.dispatch('CLEAR');
    else if (val === 'CE') store.dispatch('CLEAR CURRENT')
    else if (val === '=') store.dispatch('EQUALS');
    else if (val === '⌫') store.dispatch('DELETE');
    else {
        let op = val;
        if (val === '×') op = '*';
        else if (val === '÷') op = '/';

        if (val === 'x²') { op = '^2'; store.dispatch('FAST OP', op); }
        else if (val === '²√x') { op = '2sqrt'; store.dispatch('FAST OP', op); }
        else if (val === '¹/x') { op = '1/'; store.dispatch('FAST OP', op); }
        else if (val === '+/-') { store.dispatch('FAST OP', op); }
        else { store.dispatch('OP', op); }
    }
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.id) store.saveState(user.id);
};

const getFontSize = computed(() => {
  const length = store.state.currentValue.toString().length;
  
  if (length <= 10) return '3rem';
  if (length <= 15) return '2.5rem';
  if (length <= 20) return '2rem';
  return '1.5rem'; 
});
</script>
