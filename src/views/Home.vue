<template>
  <div>
    <div class="row mb-5">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-body text-center py-5">
            <i class="bi bi-book display-1 text-primary mb-3"></i>
            <h1 class="display-4 mb-3">Bienvenido al Sistema de Biblioteca</h1>
            <p class="lead text-muted">Administración de libros y categorías para la Tarea 2 del diplomado</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="card h-100 shadow-sm hover-card" style="cursor: pointer" @click="$router.push('/libros')">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-book-half text-primary fs-2 me-3"></i>
              <h4 class="card-title mb-0 text-primary">Gestión de Libros</h4>
            </div>
            <p class="card-text">Administra el catálogo completo de libros de la biblioteca:</p>
            <ul class="list-unstyled">
              <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Crear nuevos libros</li>
              <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Editar información existente</li>
              <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Buscar por título o autor</li>
              <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Filtrar por categoría</li>
            </ul>
          </div>
          <div class="card-footer bg-transparent">
            <button class="btn btn-primary">
              Ir a Libros <i class="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card h-100 shadow-sm hover-card" style="cursor: pointer" @click="$router.push('/categorias')">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-tags text-secondary fs-2 me-3"></i>
              <h4 class="card-title mb-0 text-secondary">Gestión de Categorías</h4>
            </div>
            <p class="card-text">Organiza los libros por categorías temáticas:</p>
            <ul class="list-unstyled">
              <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Crear nuevas categorías</li>
              <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Editar categorías existentes</li>
              <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Ver libros por categoría</li>
              <li class="mb-2"><i class="bi bi-check-circle text-success me-2"></i>Eliminar categorías vacías</li>
            </ul>
          </div>
          <div class="card-footer bg-transparent">
            <button class="btn btn-secondary">
              Ir a Categorías <i class="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>