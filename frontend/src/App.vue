<template>
  <div class="app-wrapper text-white">
    <header class="page-header">
      <h1>Calculator <span>v1.0</span></h1>
    </header>

    <nav>
      <router-link to="/auth" class="nav-box" style="top: 20px; left: 20px;">☰</router-link>
      <router-link to="/profile" class="nav-box" style="top: 80px; left: 20px;">웃</router-link>
      <router-link to="/calculator" class="nav-box" style="top: 140px; left: 20px;">Σ</router-link>
      <router-link to="/info" class="nav-box" style="bottom: 20px; left: 20px;">ⓘ</router-link>
      <div class="side-line"></div>
    </nav>

    <main class="d-flex justify-content-center align-items-center vh-100">
      <router-view />
    </main>

    <footer>
      Розроблено студентом <b>КВ-33</b> &copy; 2026
    </footer>
  </div>
</template>

<style>
body, html {
  margin: 0;
  padding: 0;
  overflow: hidden; 
  height: 100%;
}

.app-wrapper {
  position: relative; 
  height: 100vh;
  width: 100vw;
}
</style>