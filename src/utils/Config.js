// 密码规则
export const pwdReg = /^\d{0,6}$/
// 颜色获取
export const colorList = [
  '#9bd90a', // 0已连接
  '#ffb400', // 1未连接
  '#fd5d51', // 2新设备
  '#999999' // 3离线
]
// 颜色获取
export const switchColorList = [
  '#9bd90a', // 0已连接
  '#ffb400', // 1未连接
  '#fd5d51', // 2新设备
  '#999999' // 3离线
]
// 灯状态拾色器
export const lightColorList = [
  '#9bd90a', // 打开
  '#ffb400' // 关闭
]
export const lightColor = {
  0: '#ffb400', // 关闭
  1: '#9bd90a' // 打开
}
// 等状态文案
export const statusText = {
  0: '已连接', // 已连接
  1: '未连接', // 有历史记录且未连接
  2: '新设备', // 无历史记录且未连接
  3: '离线' // 有历史记录且未未扫描到
}
export const statusColor = {
  0: '#9bd90a', // 0已连接
  1: '#ffb400', // 1未连接
  2: '#fd5d51', // 2新设备
  3: '#999999' // 3离线
}
// 特征值列表
export const SampleGattAttributes = {
  FREE: '0000180a-0000-1000-8000-00805f9b34fb'.toUpperCase(),
  OAD_SERVICE: 'f000ffc0-0451-4000-b000-000000000000'.toUpperCase(), // 服务
  OAD_IMAGE_NOTIFY_CHAR: 'f000ffc1-0451-4000-b000-000000000000'.toUpperCase(), // 查询版本，发送升级通知
  OAD_BLOCK_REQUEST_CHAR: 'f000ffc2-0451-4000-b000-000000000000'.toUpperCase(), // 发送升级文件
  OAD_IMAGE_STATUS_CHAR: 'f000ffc4-0451-4000-b000-000000000000'.toUpperCase(),
  HEART_RATE_MEASUREMENT: '00002a37-0000-1000-8000-00805f9b34fb'.toUpperCase(), // 测温
  CLIENT_CHARACTERISTIC_CONFIG: '00002902-0000-1000-8000-00805f9b34fb'.toUpperCase(),
  SIMPLEIO_SERVICE: '0000fff0-0000-1000-8000-00805f9b34fb'.toUpperCase(), // 设备特征值
  SIMPLEIO_CHAR1_CHARACTERISTIC: '0000fff1-0000-1000-8000-00805f9b34fb'.toUpperCase(), // 灯1/2/3/4/
  SIMPLEIO_CHAR2_CHARACTERISTIC: '0000fff2-0000-1000-8000-00805f9b34fb'.toUpperCase(), // 灯状态/静音/背景光
  SIMPLEIO_CHAR4_CHARACTERISTIC: '0000fff4-0000-1000-8000-00805f9b34fb'.toUpperCase(), // 灯3
  SIMPLEIO_CHAR5_CHARACTERISTIC: '0000fff5-0000-1000-8000-00805f9b34fb'.toUpperCase(), // 灯4
  RESET_SERVICE: 'f000ffd0-0451-4000-b000-000000000000'.toUpperCase(), // 重启
  RESET_CHARACTERISTIC: 'f000ffd1-0451-4000-b000-000000000000'.toUpperCase()
}
// 转发
export const shareInfo = {
  title: 'LoLar-开启智慧生活第一步',
  path: '/pages/switchList',
  imageUrl: '../images/static/thumb.png'
}
export default {
  pwdReg,
  colorList,
  switchColorList,
  lightColorList,
  SampleGattAttributes,
  statusText,
  statusColor,
  lightColor,
  shareInfo
}
