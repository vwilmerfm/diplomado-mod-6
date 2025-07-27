<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>
        <i class="bi bi-tags me-2"></i>
        Gestión de Categorías
      </h2>
      <button class="btn btn-primary" @click="openModal()">
        <i class="bi bi-plus-circle me-1"></i>
        Nueva Categoría
      </button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th width="120">Acciones</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="loading">
              <td colspan="4" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="categorias.length === 0">
              <td colspan="4" class="text-center py-4 text-muted">
                No hay categorías registradas
              </td>
            </tr>
            <tr v-else v-for="categoria in categorias" :key="categoria.id">
              <td>{{ categoria.id }}</td>
              <td><strong>{{ categoria.nombre }}</strong></td>
              <td>{{ categoria.descripcion || 'Sin descripción' }}</td>
              <td>
                <button
                    class="btn btn-sm btn-outline-primary me-1"
                    @click="openModal(categoria)"
                    title="Editar"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                    class="btn btn-sm btn-outline-danger"
                    @click="confirmDelete(categoria)"
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

    <div class="modal fade" id="categoriaModal" tabindex="-1" ref="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ editingItem ? 'Editar Categoría' : 'Nueva Categoría' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveItem">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre *</label>
                <input
                    type="text"
                    class="form-control"
                    id="nombre"
                    v-model="formData.nombre"
                    :class="{ 'is-invalid': errors.nombre }"
                    required
                >
                <div v-if="errors.nombre" class="invalid-feedback">
                  {{ errors.nombre }}
                </div>
              </div>
              <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción</label>
                <textarea
                    class="form-control"
                    id="descripcion"
                    v-model="formData.descripcion"
                    rows="3"
                ></textarea>
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

    <div class="modal fade" id="deleteModal" tabindex="-1" ref="deleteModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirmar Eliminación</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar la categoría <strong>"{{ itemToDelete?.nombre }}"</strong>?</p>
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
import {categoriasService} from '@/services/api'
import {Modal, Toast} from 'bootstrap'

export default {
  name: 'Categorias',
  data() {
    return {
      categorias: [],
      loading: false,
      saving: false,
      deleting: false,
      editingItem: null,
      itemToDelete: null,
      formData: {
        nombre: '',
        descripcion: ''
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
  },
  methods: {
    async fetchCategorias() {
      this.loading = true
      try {
        const response = await categoriasService.getAll()
        this.categorias = response.data
      } catch (error) {
        this.showToast('Error', 'Error al cargar las categorías', 'danger')
        console.error('Error:', error)
      } finally {
        this.loading = false
      }
    },

    openModal(item = null) {
      this.editingItem = item
      this.errors = {}

      if (item) {
        this.formData = {...item}
      } else {
        this.formData = {
          nombre: '',
          descripcion: ''
        }
      }

      const modal = new Modal(this.$refs.modal)
      modal.show()
    },

    async saveItem() {
      this.errors = {}

      if (!this.formData.nombre.trim()) {
        this.errors.nombre = 'El nombre es requerido'
        return
      }

      this.saving = true
      try {
        if (this.editingItem) {
          await categoriasService.update(this.editingItem.id, this.formData)
          this.showToast('Éxito', 'Categoría actualizada exitosamente', 'success')
        } else {
          await categoriasService.create(this.formData)
          this.showToast('Éxito', 'Categoría creada exitosamente', 'success')
        }

        await this.fetchCategorias()
        const modal = Modal.getInstance(this.$refs.modal)
        modal.hide()
      } catch (error) {
        this.showToast('Error', 'Error al guardar la categoría', 'danger')
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
        await categoriasService.delete(this.itemToDelete.id)
        this.showToast('Éxito', 'Categoría eliminada exitosamente', 'success')
        await this.fetchCategorias()
        const modal = Modal.getInstance(this.$refs.deleteModal)
        modal.hide()
        this.itemToDelete = null
      } catch (error) {
        this.showToast('Error', 'Error al eliminar la categoría', 'danger')
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