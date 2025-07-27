<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <router-link class="navbar-brand" to="/">
          <i class="bi bi-book me-2"></i>
          Sistema de Biblioteca
        </router-link>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/">
                <i class="bi bi-house me-1"></i>
                Inicio
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/libros">
                <i class="bi bi-book-half me-1"></i>
                Libros
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/categorias">
                <i class="bi bi-tags me-1"></i>
                Categorías
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container my-4">
      <router-view></router-view>
    </main>

    <footer class="bg-primary text-white text-center py-3 mt-5">
      <div class="container">
        © {{ new Date().getFullYear() }} — Sistema de Biblioteca - Tarea 2 del diplomado | Wilmer Villca
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.router-link-active {
  font-weight: bold;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>