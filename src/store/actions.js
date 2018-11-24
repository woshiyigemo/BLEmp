export const addSwitch = ({commit}, device)=>{
  commit('addSwitch', device)
}
export const deleteSwitch = ({commit}, deviceId) => {
  commit('deleteSwitch', deviceId)
}
export const changeSwitchState = ({commit}, device) => {
  commit('changeSwitchState', device)
}
export const changeLightState = ({commit}, {deviceId, value}) => {
  commit('changeLightState', {deviceId, value})
}
export const changeLightName = ({commit}, {deviceId, lightIndex, value}) => {
  commit('changeLightName', {deviceId, lightIndex, value})
}
export const addLocalSwitch = ({commit}, device)=>{
  commit('addLocalSwitch', device)
}
// 获取历史数据
export const getHisDevice = ({commit})=>{
  commit('getHisDevice')
}