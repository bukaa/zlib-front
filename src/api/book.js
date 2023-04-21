import request from '@/utils/request'

const bookApi = {
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',

  BookList: '/zlib/bookList',
  BookListDetail: '/zlib/bookList/',
  BookListItems: '/zlib/bookList/items'
}

export function getBookList (parameter) {
  return request({
    url: bookApi.BookList,
    method: 'get',
    params: parameter
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