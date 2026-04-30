<template>
  <div class="calc-card p-4 bg-dark rounded shadow-lg">
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: activeTab === 'login' }" 
          @click="activeTab = 'login'"
        >Вхід</button>
      </li>
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: activeTab === 'register' }" 
          @click="activeTab = 'register'"
        >Реєстрація</button>
      </li>
    </ul>

    <div class="tab-content">
      <div v-if="activeTab === 'login'">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Логін</label>
            <input type="text" v-model="loginForm.login" class="form-control" placeholder="example@mail.com" required>
          </div>
          <div class="form-group">
            <label>Пароль</label>
            <input type="password" v-model="loginForm.password" class="form-control" placeholder="••••••••" required>
          </div>
          <div class="text-danger mt-2 text-end">{{ authError }}</div>
          <button type="submit" class="auth-btn">Увійти в систему</button>
        </form>
      </div>

      <div v-else>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Логін</label>
            <input type="text" v-model="regForm.login" class="form-control" placeholder="Іван Іванов" required>
          </div>
          <div class="form-group">
            <label>Електронна пошта</label>
            <input type="email" v-model="regForm.email" class="form-control" placeholder="example@mail.com" required>
          </div>
          <div class="form-group">
            <label>Пароль</label>
            <input type="password" v-model="regForm.password" class="form-control" placeholder="••••••••" required>
          </div>
          <button type="submit" class="auth-btn">Створити акаунт</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from './JS/api.js'; 

const router = useRouter();

const activeTab = ref('login');
const loginForm = ref({ login: '', password: '' });
const regForm = ref({ login: '', email: '', password: '' });
const authError = ref('');

const handleLogin = async () => {
    authError.value = '';
    try {
        const data = await authService.login(loginForm.value.login, loginForm.value.password);
        if (data.user) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            router.push('/calculator');
        }
    } catch (err) {
        authError.value = "Невірний логін або пароль!"
    }
};

const handleRegister = async () => {
    authError.value = '';
    try { 
        const data = await authService.register(regForm.value);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        router.push('/calculator');
    } catch (err) {
        authError.value = "Помилка при реєстрації (користувач вже існує)";
    }
};
</script>