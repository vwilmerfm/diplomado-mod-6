<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>
        <i class="bi bi-book-half me-2"></i>
        Gestión de Libros
      </h2>
      <button class="btn btn-primary" @click="openModal()">
        <i class="bi bi-plus-circle me-1"></i>
        Nuevo Libro
      </button>
    </div>

    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Buscar por título o autor</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input
                  type="text"
                  class="form-control"
                  v-model="searchQuery"
                  @input="applyFilters"
                  placeholder="Escribe para buscar..."
              >
              <button v-if="searchQuery" class="btn btn-outline-secondary" @click="clearSearch">
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
          <div class="col-md-4">
            <label class="form-label">Filtrar por categoría</label>
            <select class="form-select" v-model="selectedCategory" @change="applyFilters">
              <option value="">Todas las categorías</option>
              <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                {{ categoria.nombre }}
              </option>
            </select>
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button class="btn btn-outline-secondary w-100" @click="clearFilters">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
            <tr>
              <th width="60">ID</th>
              <th>Título</th>
              <th>Autor</th>
              <th width="80">Año</th>
              <th width="120">Categoría</th>
              <th width="100">Estado</th>
              <th width="150">Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="loading">
              <td colspan="7" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="filteredLibros.length === 0">
              <td colspan="7" class="text-center py-4 text-muted">
                {{
                  searchQuery || selectedCategory ? 'No se encontraron libros con los filtros aplicados' : 'No hay libros registrados'
                }}
              </td>
            </tr>
            <tr v-else v-for="libro in filteredLibros" :key="libro.id">
              <td>{{ libro.id }}</td>
              <td><strong>{{ libro.titulo }}</strong></td>
              <td>{{ libro.autor }}</td>
              <td>{{ libro.anio || '-' }}</td>
              <td>
                  <span class="badge bg-primary">
                    {{ libro.categoria?.nombre || 'Sin categoría' }}
                  </span>
              </td>
              <td>
                  <span :class="libro.disponible ? 'badge bg-success' : 'badge bg-danger'">
                    {{ libro.disponible ? 'Disponible' : 'No Disponible' }}
                  </span>
              </td>
              <td>
                <button
                    class="btn btn-sm btn-outline-info me-1"
                    @click="viewItem(libro)"
                    title="Ver detalles"
                >
                  <i class="bi bi-eye"></i>
                </button>
                <button
                    class="btn btn-sm btn-outline-primary me-1"
                    @click="openModal(libro)"
                    title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                    class="btn btn-sm btn-outline-danger"
                    @click="confirmDelete(libro)"
                    title="Eliminar"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal fade" id="libroModal" tabindex="-1" ref="modal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingItem ? 'Editar Libro' : 'Nuevo Libro' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveItem">
              <div class="row">
                <div class="col-12 mb-3">
                  <label for="titulo" class="form-label">Título *</label>
                  <input
                      type="text"
                      class="form-control"
                      id="titulo"
                      v-model="formData.titulo"
                      :class="{ 'is-invalid': errors.titulo }"
                      required
                  >
                  <div v-if="errors.titulo" class="invalid-feedback">
                    {{ errors.titulo }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="autor" class="form-label">Autor *</label>
                  <input
                      type="text"
                      class="form-control"
                      id="autor"
                      v-model="formData.autor"
                      :class="{ 'is-invalid': errors.autor }"
                      required
                  >
                  <div v-if="errors.autor" class="invalid-feedback">
                    {{ errors.autor }}
                  </div>
                </div>

                <div class="col-md-6 mb-3">
                  <label for="isbn" class="form-label">ISBN</label>
                  <input
                      type="text"
                      class="form-control"
                      id="isbn"
                      v-model="formData.isbn"
                  >
                </div>

                <div class="col-md-6 mb-3">
                  <label for="anio" class="form-label">Año</label>
                  <input
                      type="number"
                      class="form-control"
                      id="anio"
                      v-model.number="formData.anio"
                      min="1000"
                      max="2030"
                  >
                </div>

                <div class="col-md-6 mb-3">
                  <label for="categoriaId" class="form-label">Categoría *</label>
                  <select
                      class="form-select"
                      id="categoriaId"
                      v-model="formData.categoriaId"
                      :class="{ 'is-invalid': errors.categoriaId }"
                      required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                      {{ categoria.nombre }}
                    </option>
                  </select>
                  <div v-if="errors.categoriaId" class="invalid-feedback">
                    {{ errors.categoriaId }}
                  </div>
                </div>

                <div class="col-12 mb-3">
                  <label for="descripcion" class="form-label">Descripción</label>
                  <textarea
                      class="form-control"
                      id="descripcion"
                      v-model="formData.descripcion"
                      rows="3"
                  ></textarea>
                </div>

                <div class="col-12 mb-3">
                  <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="disponible"
                        v-model="formData.disponible"
                    >
                    <label class="form-check-label" for="disponible">
                      Disponible para préstamo
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button
                type="button"
                class="btn btn-primary"
                @click="saveItem"
                :disabled="saving"
            >
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="viewModal" tabindex="-1" ref="viewModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalles del Libro</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="viewingItem">
            <h6 class="fw-bold">{{ viewingItem.titulo }}</h6>
            <hr>
            <div class="row">
              <div class="col-6"><strong>Autor:</strong></div>
              <div class="col-6">{{ viewingItem.autor }}</div>
            </div>
            <div class="row" v-if="viewingItem.isbn">
              <div class="col-6"><strong>ISBN:</strong></div>
              <div class="col-6">{{ viewingItem.isbn }}</div>
            </div>
            <div class="row" v-if="viewingItem.anio">
              <div class="col-6"><strong>Año:</strong></div>
              <div class="col-6">{{ viewingItem.anio }}</div>
            </div>
            <div class="row">
              <div class="col-6"><strong>Categoría:</strong></div>
              <div class="col-6">
                <span class="badge bg-primary">
                  {{ viewingItem.categoria?.nombre || 'Sin categoría' }}
                </span>
              </div>
            </div>
            <div class="row">
              <div class="col-6"><strong>Estado:</strong></div>
              <div class="col-6">
                <span :class="viewingItem.disponible ? 'badge bg-success' : 'badge bg-danger'">
                  {{ viewingItem.disponible ? 'Disponible' : 'No Disponible' }}
                </span>
              </div>
            </div>
            <div v-if="viewingItem.descripcion" class="mt-3">
              <strong>Descripción:</strong>
              <p class="mt-2">{{ viewingItem.descripcion }}</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Eliminación</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar el libro <strong>"{{ itemToDelete?.titulo }}"</strong>?</p>
            <p class="text-danger mb-0">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button
                type="button"
                class="btn btn-danger"
                @click="deleteItem"
                :disabled="deleting"
            >
              <span v-if="deleting" class="spinner-border spinner-border-sm me-2"></span>
              {{ deleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div class="toast" :class="toast.class" ref="toast">
        <div class="toast-header">
          <i :class="toast.icon" class="me-2"></i>
          <strong class="me-auto">{{ toast.title }}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {librosService, categoriasService} from '@/services/api'
import {Modal, Toast} from 'bootstrap'

export default {
  name: 'Libros',
  data() {
    return {
      libros: [],
      filteredLibros: [],
      categorias: [],
      loading: false,
      saving: false,
      deleting: false,
      editingItem: null,
      viewingItem: null,
      itemToDelete: null,
      searchQuery: '',
      selectedCategory: '',
      formData: {
        titulo: '',
        autor: '',
        isbn: '',
        anio: null,
        descripcion: '',
        categoriaId: '',
        disponible: true
      },
      errors: {},
      toast: {
        title: '',
        message: '',
        class: '',
        icon: ''
      }
    }
  },
  async mounted() {
    await this.fetchCategorias()
    await this.fetchLibros()
  },
  methods: {
    async fetchLibros() {
      this.loading = true
      try {
        const response = await librosService.getAll()
        this.libros = response.data
        this.filteredLibros = [...this.libros]
      } catch (error) {
        this.showToast('Error', 'Error al cargar los libros', 'danger')
        console.error('Error:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchCategorias() {
      try {
        const response = await categoriasService.getAll()
        this.categorias = response.data
      } catch (error) {
        this.showToast('Error', 'Error al cargar las categorías', 'danger')
        console.error('Error:', error)
      }
    },

    applyFilters() {
      let filtered = [...this.libros]

      if (this.searchQuery && this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim()
        filtered = filtered.filter(libro =>
            libro.titulo.toLowerCase().includes(query) ||
            libro.autor.toLowerCase().includes(query)
        )
      }

      if (this.selectedCategory) {
        filtered = filtered.filter(libro =>
            libro.categoriaId == this.selectedCategory
        )
      }

      this.filteredLibros = filtered
    },

    clearSearch() {
      this.searchQuery = ''
      this.applyFilters()
    },

    clearFilters() {
      this.searchQuery = ''
      this.selectedCategory = ''
      this.filteredLibros = [...this.libros]
    },

    openModal(item = null) {
      this.editingItem = item
      this.errors = {}

      if (item) {
        this.formData = {...item}
      } else {
        this.formData = {
          titulo: '',
          autor: '',
          isbn: '',
          anio: null,
          descripcion: '',
          categoriaId: '',
          disponible: true
        }
      }

      const modal = new Modal(this.$refs.modal)
      modal.show()
    },

    viewItem(item) {
      this.viewingItem = item
      const modal = new Modal(this.$refs.viewModal)
      modal.show()
    },

    async saveItem() {
      this.errors = {}

      if (!this.formData.titulo.trim()) {
        this.errors.titulo = 'El título es requerido'
      }
      if (!this.formData.autor.trim()) {
        this.errors.autor = 'El autor es requerido'
      }
      if (!this.formData.categoriaId) {
        this.errors.categoriaId = 'La categoría es requerida'
      }

      if (Object.keys(this.errors).length > 0) {
        return
      }

      this.saving = true
      try {
        if (this.editingItem) {
          await librosService.update(this.editingItem.id, this.formData)
          this.showToast('Éxito', 'Libro actualizado exitosamente', 'success')
        } else {
          await librosService.create(this.formData)
          this.showToast('Éxito', 'Libro creado exitosamente', 'success')
        }

        await this.fetchLibros()
        this.applyFilters()
        const modal = Modal.getInstance(this.$refs.modal)
        modal.hide()
      } catch (error) {
        this.showToast('Error', 'Error al guardar el libro', 'danger')
        console.error('Error:', error)
      } finally {
        this.saving = false
      }
    },

    confirmDelete(item) {
      this.itemToDelete = item
      const modal = new Modal(this.$refs.deleteModal)
      modal.show()
    },

    async deleteItem() {
      this.deleting = true
      try {
        await librosService.delete(this.itemToDelete.id)
        this.showToast('Éxito', 'Libro eliminado exitosamente', 'success')
        await this.fetchLibros()
        this.applyFilters()
        const modal = Modal.getInstance(this.$refs.deleteModal)
        modal.hide()
        this.itemToDelete = null
      } catch (error) {
        this.showToast('Error', 'Error al eliminar el libro', 'danger')
        console.error('Error:', error)
      } finally {
        this.deleting = false
      }
    },

    showToast(title, message, type = 'success') {
      this.toast = {
        title: title,
        message: message,
        class: type === 'success' ? 'text-bg-success' : 'text-bg-danger',
        icon: type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-triangle-fill'
      }

      const toast = new Toast(this.$refs.toast)
      toast.show()
    }
  }
}
</script>