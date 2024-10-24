import request from '@/utils/request'
import { isEmpty } from '@/utils/index'

export function addAgent(data) {
  return request({
    url: '/agent/add',
    method: 'post',
    data
  })
}

export function editAgent(data) {
  return request({
    url: '/agent/update',
    method: 'post',
    data
  })
}

export function getAgentInfo(data) {
  return request({
    url: '/agent/info',
    method: 'post',
    data
  })
}

export function disAgent(data) {
  return request({
    url: '/agent/disabled',
    method: 'post',
    data
  })
}

export function unlockAgent(data) {
  return request({
    url: '/agent/unlock',
    method: 'post',
    data
  })
}

export function getAgentOptions(countryCode, agentType) {
  if (isEmpty(countryCode)) {
    countryCode = ''
  }
  if (isEmpty(agentType)) {
    agentType = ''
  }
  return request({
    url: '/agent/options?countryCode=' + countryCode + '&agentType=' + agentType,
    method: 'get'
  })
}

export function resetAgentLoginPsw(data) {
  return request({
    url: '/agent/pwd/login',
    method: 'post',
    data
  })
}

export function resetAgentDrawPsw(data) {
  return request({
    url: '/agent/pwd/draw',
    method: 'post',
    data
  })
}

export function resetAgentDGC(data) {
  return request({
    url: '/agent/reset/draw/gc',
    method: 'post',
    data
  })
}

export function getWalletStats(data) {
  return request({
    url: '/agent/wallet/stats',
    method: 'post',
    data
  })
}

export function plusAmount(data) {
  return request({
    url: '/agent/wallet/plus',
    method: 'post',
    data
  })
}

export function minusAmount(data) {
  return request({
    url: '/agent/wallet/minus',
    method: 'post',
    data
  })
}
