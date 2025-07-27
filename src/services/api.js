import axios from 'axios'

const API_URL = 'http://localhost:3001'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// SERVICIO PARA CATEGORÍAS
export const categoriasService = {
    getAll() {
        return api.get('/categorias')
    },

    getById(id) {
        return api.get(`/categorias/${id}`)
    },

    create(categoria) {
        return api.post('/categorias', categoria)
    },

    update(id, categoria) {
        return api.put(`/categorias/${id}`, categoria)
    },

    delete(id) {
        return api.delete(`/categorias/${id}`)
    }
}

// SERVICIO PARA LIBROS
export const librosService = {
    getAll() {
        return api.get('/libros?_expand=categoria')
    },

    getWithFilters(filters = {}) {
        let url = '/libros?_expand=categoria'

        if (filters.categoriaId) {
            url += `&categoriaId=${filters.categoriaId}`
        }

        if (filters.search) {
            url += `&q=${filters.search}`
        }

        return api.get(url)
    },

    getById(id) {
        return api.get(`/libros/${id}?_expand=categoria`)
    },

    create(libro) {
        return api.post('/libros', libro)
    },

    update(id, libro) {
        return api.put(`/libros/${id}`, libro)
    },

    delete(id) {
        return api.delete(`/libros/${id}`)
    }
}