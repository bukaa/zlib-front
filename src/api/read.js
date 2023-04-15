import request from '@/utils/request'

const readApi = {
  LastRead: '/user/read/record/findLast',
  ReadState: '/user/read/record/findState/',
  AddRead: '/user/read/record/add/',
  DoRead: '/user/read/record/read/',
  DelRead: '/user/read/record/del/',
  Count: '/user/read/record/count',

  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info',
  UserMenu: '/user/nav'
}

export function findLastRead () {
  return request({
    url: readApi.LastRead,
    method: 'get'
  })
}

export function getReadState (bookId) {
  return request({
    url: readApi.ReadState + bookId,
    method: 'get'
  })
}

export function getReadCount () {
  return request({
    url: readApi.Count,
    method: 'get'
  })
}

export function addRead(bookId, data) {
  return request({
    url: readApi.AddRead + bookId,
    method: 'post',
    data
  })
}

export function delRead(bookId) {
  return request({
    url: readApi.DelRead + bookId,
    method: 'post'
  })
}

export function doRead(bookId, data) {
  return request({
    url: readApi.DoRead + bookId,
    method: 'post',
    data
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}