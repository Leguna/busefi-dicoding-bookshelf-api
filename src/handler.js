const books = require('./books')
const { nanoid } = require('nanoid')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  const finished = pageCount === readPage

  const book = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    }).code(400)
  } else if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  books.push(book)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    }).code(201)
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  }).code(500)
}

const getAllBooksHandler = () => {
  books.map(({
    id,
    name,
    publisher
  }) => {
    return {
      id,
      name,
      publisher
    }
  })
  return {
    status: 'success',
    data: {
      books: books.map(({
        id,
        name,
        publisher
      }) => {
        return {
          id,
          name,
          publisher
        }
      })
    }
  }
}

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((n) => n.id === bookId)[0]

  if (book !== undefined) {
    return h.response({
      status: 'success',
      data: {
        book
      }
    }).code(200)
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  }).code(404)
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (name === undefined) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    }).code(400)
  } else if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    }).code(400)
  }

  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === bookId)

  console.log(bookId)
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }).code(200)
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  }).code(404)
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  deleteBookByIdHandler,
  editBookByIdHandler,
  getAllBooksHandler,
  getBookByIdHandler
}
