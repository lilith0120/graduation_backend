const sendConfig = {
    host: 'smtp.qq.com', // QQ邮箱
    port: 465, // QQ邮箱提供的端口
    secureConnection: true,
    auth: {
        user: '3428098215@qq.com', // 发送邮箱
        pass: 'mxyaizirwnvzchhb', // 授权码
    }
};

const recieveConfig = {
    from: '3428098215@qq.com',
    to: '',
    subject: '毕业设计管理系统——重置密码的验证码',
    html: '',
};

export {
    sendConfig,
    recieveConfig,
};