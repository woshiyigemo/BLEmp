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