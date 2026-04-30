<template>
  <div class="calc-card p-4 bg-dark rounded shadow-lg">
    <div class="text-center mb-4">
      <h4 class="text-white">Профіль користувача</h4>
    </div>

    <div v-if="user && user.login">
      
      <div class="profile-info-row d-flex justify-content-between align-items-center">
        <div>
          <div class="text-white-50 small">Логін</div>
          <div class="text-white">{{ user.login }}</div>
        </div>
        <button type="button" class="edit-btn" @click="activeField = 'login'">Змінити</button>
      </div>
      <form v-if="activeField === 'login'" @submit.prevent="saveField('login')">
        <input type="text" v-model="user.login" class="form-control mb-2 bg-secondary text-white border-0" @blur="cancelEdit" autofocus />
      </form>

      <div class="profile-info-row d-flex justify-content-between align-items-center">
        <div>
          <div class="text-white-50 small">Електронна пошта</div>
          <div class="text-white">{{ user.email }}</div>
        </div>
        <button type="button" class="edit-btn" @click="activeField = 'email'">Змінити</button>
      </div>
      <form v-if="activeField === 'email'" @submit.prevent="saveField('email')">
        <input type="email" v-model="user.email" class="form-control mb-2 bg-secondary text-white border-0" @blur="cancelEdit" autofocus />
      </form>

      <div class="profile-info-row d-flex justify-content-between align-items-center">
        <div>
          <div class="text-white-50 small">Пароль</div>
          <div class="text-white">
            {{ showPass ? user.password : '************' }}
          </div>
        </div>
        <div class="d-flex align-items-center gap-2">
          <label class="text-white-50 small" style="font-size: 0.75rem">Підглядати</label>
          <input type="checkbox" v-model="showPass" />
          <button type="button" class="edit-btn" @click="activeField = 'password'">Змінити</button>
        </div>
      </div>
      <form v-if="activeField === 'password'" @submit.prevent="saveField('password')">
        <input type="text" v-model="user.password" class="form-control mb-2 bg-secondary text-white border-0" @blur="cancelEdit" autofocus />
      </form>

      <!-- Дата реєстрації (людський вигляд)[cite: 14] -->
      <div class="profile-info-row d-flex justify-content-between align-items-center">
        <div>
          <div class="text-white-50 small">Дата реєстрації</div>
          <div class="text-white">{{ formattedDate }}</div>
        </div>
      </div>

      <div v-if="error" class="text-danger mt-3 text-end small">{{ error }}</div>

      <button type="button" class="auth-btn mt-4 logout-style w-100" @click="handleLogout">
        Вийти з акаунту
      </button>
    </div>

    <div v-else class="text-center py-5">
      <h5 class="text-white mb-4">Дані користувача відсутні</h5>
      <button class="auth-btn" @click="router.push('/auth')">Увійти / Зареєструватися</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from './JS/api'; 

const router = useRouter();

const user = ref(JSON.parse(localStorage.getItem('currentUser')) || null);
const activeField = ref(null); 
const showPass = ref(false);   
const error = ref('');

const formattedDate = computed(() => {
  if (!user.value || !user.value.created_at) return '00.00.0000';
  const d = new Date(user.value.created_at);
  return d.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
});

const cancelEdit = () => {
  setTimeout(() => { activeField.value = null; }, 200);
};

const saveField = async (field) => {
  try {
    const updatedUser = await authService.updateProfile(user.value.id, {
      [field]: user.value[field]
    });
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    user.value = updatedUser;
    activeField.value = null;
    error.value = '';
  } catch (err) {
    error.value = "Помилка оновлення даних";
  }
};

const handleLogout = () => {
  localStorage.removeItem('currentUser');
  router.push('/auth');
};
</script>

<style scoped>
.logout-style {
  background-color: #333;
  color: #ff4c4c;
  border: 1px solid #444;
}
.profile-info-row {
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 10px;
}
.edit-btn {
  background: none;
  border: 1px solid #555;
  color: #aaa;
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}
.edit-btn:hover {
  background: #444;
  color: #fff;
}
.form-control:focus {
  box-shadow: none;
  outline: 1px solid #4cc2ff;
}
</style>