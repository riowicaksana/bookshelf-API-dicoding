const listBooks=require('./book');
const {nanoid}=require('nanoid');
const listbooks = require('./book');

const addBookHandler=(request, h)=>{
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  }=request.payload;


  const isSuccess = name!=undefined||!pageCount<readPage;
  const emptyName=name===undefined;
  const readPageMorePageCount=pageCount<readPage;

  if (readPageMorePageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else if (emptyName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (isSuccess) {
    const id = nanoid(16);
    const finished=pageCount===readPage;
    const insertedAt= new Date().toISOString();
    const updatedAt=insertedAt;

    const newBookList = {
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
      updatedAt,
    };


    listBooks.push(newBookList);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } else {
    const response = h.response({
      status: 'error',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};


const getAllNotesHandler=(request, h)=>{
  const {name, reading, finished}=request.query;

  if (name !== undefined) {
    // eslint-disable-next-line max-len
    const nameBooks= listBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    const books=nameBooks.map((book)=>({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    const response=h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  } else if (reading !== undefined) {
    // eslint-disable-next-line max-len
    const readBooks = listbooks.filter((book) => book.reading === !!Number(reading));
    const books=readBooks.map((book)=>({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    const response=h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  } else if (finished !== undefined) {
    // eslint-disable-next-line max-len
    const finishedBooks = listbooks.filter((book) => book.finished === !!Number(finished));
    const books=finishedBooks.map((book)=>({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    const response=h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  const books=listBooks.map((book)=>({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  const response=h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);
  return response;
};


const getBookByIdHandler=(request, h)=>{
  const {bookId}=request.params;
  const book=listBooks.filter((n)=>n.id===bookId)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler=(request, h)=>{
  const {bookId}=request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  }=request.payload;

  const updatedAt = new Date().toISOString();
  const index = listBooks.findIndex((book) => book.id === bookId);
  const isSuccess = name!=undefined&&!pageCount<readPage&&index!== -1;
  const emptyName=name===undefined;
  const readPageMorePageCount=pageCount<readPage;
  if (readPageMorePageCount) {
    const response = h.response({
      status: 'fail',
      // eslint-disable-next-line max-len
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  if (isSuccess) {
    listBooks[index] = {
      ...listBooks[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  } else if (emptyName) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const {bookId} = request.params;

  const index = listBooks.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    listBooks.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


module.exports={
  addBookHandler,
  getAllNotesHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
