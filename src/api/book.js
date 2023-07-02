import request from '@/utils/request'

const bookApi = {
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',

  BookFind: '/zlib/find',
  BookRecommend: 'zlib/recommend',
  BookRandom: 'zlib/random',
  BookDetail: '/zlib/',
  DelBook: '/zlib/del/',
  BookList: '/zlib/bookList',
  BookListDetail: '/zlib/bookList/',
  BookListItems: '/zlib/bookList/items',

  Convert: '/zlib/convert'
  
}

export function findBook (parameter) {
  return request({
    url: bookApi.BookFind,
    method: 'get',
    params: parameter
  })
}

export function getBookRecommend () {
  return request({
    url: bookApi.BookRecommend,
    method: 'get'
  })
}

export function getBookRandom () {
  return request({
    url: bookApi.BookRandom,
    method: 'get'
  })
}

export function getBookList (parameter) {
  return request({
    url: bookApi.BookList,
    method: 'get',
    params: parameter
  })
}

export function getBookDetail (id) {
  return request({
    url: bookApi.BookDetail + id,
    method: 'get'
  })
}

export function convert(id) {
  return request({
    url: bookApi.Convert,
    params: {id: id},
    method: 'get'
  })
}

export function getBookListDetail (id) {
  return request({
    url: bookApi.BookListDetail + id,
    method: 'get'
  })
}

export function getBookListItems (parameter) {
  return request({
    url: bookApi.BookListItems,
    method: 'get',
    params: parameter
  })
}

export function delBook(bookId) {
  return request({
    url: bookApi.DelBook + bookId,
    method: 'post'
  })
}