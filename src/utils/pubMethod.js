// 转换字符串长度
const spaceReg = /^[\s]*$/;   //监测是否为空格正则
const pwdReg = /^\d{0,6}$/
export const getByteLen = (val) => {
    let len = 0;
    if (!spaceReg.test(val) && val) {
      for (let i = 0; i < val.length; i += 1) {
        const a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
          len += 2;
        } else {
          len += 1;
        }
      }
    } else {
      len = 0;
    }
    return len;
  }
// 密码合法
export const isPwdValid = (pwd) => {
    const res = {
        str: '',
        isValidate: true
    }
    if(pwd && !pwdReg.test(pwd)){
        res.str = "密码必须为6位以内的数字"
        res.isValidate = false
    }
    return res
}
// 名字合法
export const isNameValid = (name) => {
    const res = {
        str: '',
        isValidate: true
    }
    const len = getByteLen(name)
    if (len === 0)  {
        res.str = '请填写名称'
        res.isValidate = false
    } else if(len > 16){
        res.str = '名字不能超过8个中文或16个字母'
        res.isValidate = false
    }
    return res
}

// 


export default {
    getByteLen,
    isPwdValid,
    isNameValid,
}