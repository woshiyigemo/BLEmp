export const mpvueInfo = state => state.mpvueInfo
export const switchList = state => state.switchList
export const bleAvailable = state => state.bleAvailable
export const switchListArr = (state) => {
  var arr = []
  for (var i in state.switchList) {
    if (state.switchList[i].deviceId) {
      arr.push(state.switchList[i])
    }
  }
  return arr
}
export const getSwitchById = (state, getters) => {
  return (deviceId) => {
    if (!deviceId || !state.switchList[deviceId]) return null
    return state.switchList[deviceId]
  }
}
export const getLocalSwitchById = (state) => {
  return (deviceId) => {
    if (!deviceId || !state.switchListLocal[deviceId]) return null
    return state.switchListLocal[deviceId]
  }
}
export const getCurSwitch = (state) => {
  return () => {
    return state.switchList[state.curSwitchId]
  }
}