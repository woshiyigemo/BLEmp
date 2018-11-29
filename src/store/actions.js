
export const updateSwitch = ({commit}, device)=>{
  commit('updateSwitch', device)
}
export const deleteSwitch = ({commit}, deviceId) => {
  commit('deleteSwitch', deviceId)
}
export const changeSwitchName = ({commit}, { deviceId, localName }) => {
  commit('changeSwitchName', { deviceId, localName })
}
export const changeLightState = ({commit}, {deviceId, value}) => {
  commit('changeLightState', {deviceId, value})
}
export const changeLightName = ({commit}, {deviceId, lightIndex, value}) => {
  commit('changeLightName', {deviceId, lightIndex, value})
}
export const updateLocalSwitch = ({commit}, device)=>{
  commit('updateLocalSwitch', device)
}
// 获取历史数据
export const getHisDevice = ({commit})=>{
  commit('getHisDevice')
}
export const connSwitch = ({commit}, device) => {
  commit('connSwitch', device)
}
export const disconSwitch = ({commit}, deviceId) => {
  commit('disconSwitch', deviceId)
}