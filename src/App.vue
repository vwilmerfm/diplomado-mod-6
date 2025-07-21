<template>
  <div id="app">
    <div class="container-fluid">
      <div class="app-container">

        <div class="text-center mb-5">
          <h1 class="display-4 fw-bold header-title mb-3">
            <i class="bi bi-person-rolodex me-3"></i>
            Agenda de Contactos
          </h1>
          <p class="lead text-muted">Práctica Nro. 1, del módulo 6 | Desarrollo Frontend con Vuejs</p>
        </div>

        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="row g-3 align-items-center">
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-person"></i>
                  </span>
                  <input
                      v-model="filters.name"
                      type="text"
                      class="form-control"
                      placeholder="Filtrar por nombre..."
                  >
                </div>
              </div>
              <div class="col-md-4">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input
                      v-model="filters.email"
                      type="text"
                      class="form-control"
                      placeholder="Filtrar por email..."
                  >
                </div>
              </div>
              <div class="col-md-2">
                <button
                    @click="clearFilters"
                    v-if="filters.name || filters.email"
                    class="btn btn-outline-secondary btn-custom w-100"
                >
                  <i class="bi bi-x-circle me-1"></i>
                  Limpiar
                </button>
              </div>
              <div class="col-md-2">
                <button
                    @click="openAddModal"
                    class="btn btn-primary btn-custom w-100"
                >
                  <i class="bi bi-plus-circle me-1"></i>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4" v-if="filteredContacts.length > 0">
          <div
              v-for="contact in filteredContacts"
              :key="contact.id"
              class="col-md-6 col-lg-4"
          >
            <div class="card contact-card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <h5 class="card-title fw-bold text-primary">{{ contact.name }}</h5>
                  <div class="btn-group" role="group">
                    <button
                        @click="openEditModal(contact)"
                        class="btn btn-outline-primary btn-sm"
                        title="Editar"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                        @click="confirmDelete(contact)"
                        class="btn btn-outline-danger btn-sm"
                        title="Eliminar"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>

                <div class="contact-info">
                  <div class="mb-2">
                    <i class="bi bi-envelope-fill text-info contact-icon"></i>
                    <small class="text-muted">{{ contact.email }}</small>
                  </div>
                  <div class="mb-2">
                    <i class="bi bi-telephone-fill text-success contact-icon"></i>
                    <small class="text-muted">{{ contact.phone }}</small>
                  </div>
                  <div class="mb-2">
                    <i class="bi bi-house-fill text-warning contact-icon"></i>
                    <small class="text-muted">{{ contact.address }}</small>
                  </div>
                  <div class="mb-0">
                    <i class="bi bi-geo-alt-fill text-danger contact-icon"></i>
                    <small class="text-muted">{{ contact.city }}, {{ contact.country }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-5">
          <i class="bi bi-inbox display-1 text-muted mb-4"></i>
          <h3 class="text-muted mb-3">No se encontraron contactos</h3>
          <p class="text-muted">
            {{
              contacts.length === 0 ? 'Comienza agregando tu primer contacto' : 'Intenta ajustar los filtros de búsqueda'
            }}
          </p>
        </div>
      </div>
    </div>

    <div
        class="modal fade"
        :class="{ show: showModal }"
        :style="{ display: showModal ? 'block' : 'none' }"
        tabindex="-1"
        @click="closeModal"
    >
      <div class="modal-dialog modal-dialog-centered" @click.stop>
        <div class="modal-content">
          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-person-plus me-2"></i>
              {{ isEditing ? 'Editar Contacto' : 'Nuevo Contacto' }}
            </h5>
            <button
                type="button"
                class="btn-close"
                @click="closeModal"
            ></button>
          </div>
          <form @submit.prevent="saveContact">
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-person me-1"></i>Nombre
                  </label>
                  <input
                      v-model="currentContact.name"
                      type="text"
                      class="form-control"
                      placeholder="Nombre completo"
                      required
                  >
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-envelope me-1"></i>Email
                  </label>
                  <input
                      v-model="currentContact.email"
                      type="email"
                      class="form-control"
                      placeholder="correo@ejemplo.com"
                      required
                  >
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-telephone me-1"></i>Teléfono
                  </label>
                  <input
                      v-model="currentContact.phone"
                      type="tel"
                      class="form-control"
                      placeholder="123-456-7890"
                      required
                  >
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-house me-1"></i>Dirección
                  </label>
                  <input
                      v-model="currentContact.address"
                      type="text"
                      class="form-control"
                      placeholder="Dirección completa"
                      required
                  >
                </div>

                <div class="col-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-flag me-1"></i>País
                  </label>
                  <input
                      v-model="currentContact.country"
                      type="text"
                      class="form-control"
                      placeholder="País"
                      required
                  >
                </div>

                <div class="col-6">
                  <label class="form-label fw-semibold">
                    <i class="bi bi-geo-alt me-1"></i>Ciudad
                  </label>
                  <input
                      v-model="currentContact.city"
                      type="text"
                      class="form-control"
                      placeholder="Ciudad"
                      required
                  >
                </div>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button
                  type="button"
                  class="btn btn-outline-secondary btn-custom"
                  @click="closeModal"
              >
                <i class="bi bi-x-circle me-1"></i>Cancelar
              </button>
              <button
                  type="submit"
                  class="btn btn-primary btn-custom"
              >
                <i class="bi bi-check-circle me-1"></i>
                {{ isEditing ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div
        v-if="showModal"
        class="modal-backdrop fade show"
        @click="closeModal"
    ></div>

    <div
        class="modal fade"
        :class="{ show: showDeleteModal }"
        :style="{ display: showDeleteModal ? 'block' : 'none' }"
        tabindex="-1"
        @click="closeDeleteModal"
    >
      <div class="modal-dialog modal-dialog-centered modal-sm" @click.stop>
        <div class="modal-content">
          <div class="modal-header border-0 text-center">
            <div class="w-100">
              <i class="bi bi-exclamation-triangle-fill text-warning display-4 mb-3"></i>
              <h5 class="modal-title fw-bold">¿Eliminar contacto?</h5>
            </div>
            <button
                type="button"
                class="btn-close"
                @click="closeDeleteModal"
            ></button>
          </div>
          <div class="modal-body text-center">
            <p class="mb-0">
              ¿Estás seguro de que quieres eliminar a
              <strong class="text-primary">{{ contactToDelete?.name }}</strong>?
            </p>
            <small class="text-muted">Esta acción no se puede deshacer.</small>
          </div>
          <div class="modal-footer border-0">
            <button
                type="button"
                class="btn btn-outline-secondary btn-custom"
                @click="closeDeleteModal"
            >
              <i class="bi bi-x-circle me-1"></i>Cancelar
            </button>
            <button
                type="button"
                class="btn btn-danger btn-custom"
                @click="deleteContact"
            >
              <i class="bi bi-trash me-1"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
        v-if="showDeleteModal"
        class="modal-backdrop fade show"
        @click="closeDeleteModal"
    ></div>
  </div>
</template>

<script>
import {ref, computed, reactive} from 'vue'

export default {
  name: 'ContactManager',
  setup() {
    // VECTOR DE CONTACTOS
    const contacts = ref([
      {
        id: 1,
        name: "Wilmer Villca",
        email: "wilmer.villca@gmail.com",
        address: "Calle Mario Calvo # 3840",
        phone: "76538993",
        country: "Bolivia",
        city: "El Alto"
      },
      {
        id: 2,
        name: "Froilan Mamani",
        email: "froilan.mamani@gmail.com",
        address: "Calle Mario Calvo # 3840",
        phone: "76538993",
        country: "Bolivia",
        city: "La Paz"
      },
      {
        id: 3,
        name: "Angela Siñani",
        email: "angela.siñani@gmail.com",
        address: "Calle Mario Calvo # 3840",
        phone: "76538993",
        country: "Bolivia",
        city: "El Alto"
      },
      {
        id: 4,
        name: "Danny Quelali",
        email: "danny.quelali@gmail.com",
        address: "Calle Mario Calvo # 3840",
        phone: "76538993",
        country: "Bolivia",
        city: "La Paz"
      },
      {
        id: 5,
        name: "Wilmer Froialan Villca Mamani",
        email: "wvillca@gmail.com",
        address: "Calle Mario Calvo # 3840",
        phone: "76538993",
        country: "Bolivia",
        city: "El Alto"
      }
    ])

    const showModal = ref(false)
    const showDeleteModal = ref(false)
    const isEditing = ref(false)
    const contactToDelete = ref(null)
    const nextId = ref(6)

    const filters = reactive({
      name: '',
      email: ''
    })

    const currentContact = reactive({
      id: null,
      name: '',
      email: '',
      address: '',
      phone: '',
      country: '',
      city: ''
    })

    const filteredContacts = computed(() => {
      return contacts.value.filter(contact => {
        const nameMatch = contact.name.toLowerCase().includes(filters.name.toLowerCase())
        const emailMatch = contact.email.toLowerCase().includes(filters.email.toLowerCase())
        return nameMatch && emailMatch
      })
    })

    const openAddModal = () => {
      isEditing.value = false
      resetCurrentContact()
      showModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const openEditModal = (contact) => {
      isEditing.value = true
      Object.assign(currentContact, contact)
      showModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
      showModal.value = false
      resetCurrentContact()
      document.body.style.overflow = ''
    }

    const resetCurrentContact = () => {
      Object.assign(currentContact, {
        id: null,
        name: '',
        email: '',
        address: '',
        phone: '',
        country: '',
        city: ''
      })
    }

    const saveContact = () => {
      if (isEditing.value) {
        const index = contacts.value.findIndex(c => c.id === currentContact.id)
        if (index !== -1) {
          contacts.value[index] = {...currentContact}
        }
      } else {
        const newContact = {
          ...currentContact,
          id: nextId.value++
        }
        contacts.value.push(newContact)
      }
      closeModal()
    }

    const confirmDelete = (contact) => {
      contactToDelete.value = contact
      showDeleteModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const deleteContact = () => {
      if (contactToDelete.value) {
        const index = contacts.value.findIndex(c => c.id === contactToDelete.value.id)
        if (index !== -1) {
          contacts.value.splice(index, 1)
        }
      }
      closeDeleteModal()
    }

    const closeDeleteModal = () => {
      showDeleteModal.value = false
      contactToDelete.value = null
      document.body.style.overflow = ''
    }

    const clearFilters = () => {
      filters.name = ''
      filters.email = ''
    }

    return {
      contacts,
      filteredContacts,
      showModal,
      showDeleteModal,
      isEditing,
      currentContact,
      contactToDelete,
      filters,
      openAddModal,
      openEditModal,
      closeModal,
      saveContact,
      confirmDelete,
      deleteContact,
      closeDeleteModal,
      clearFilters
    }
  }
}
</script>

<style scoped>

#app {
  padding: 24px;
}

</style>