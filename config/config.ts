export default {
    database: {
        dbName: 'graduation_project',
        host: '81.71.128.138',
        port: 3306,
        user: 'root',
        password: 'wuhan20001226',
        env: 'prod', // 当前环境
    },
    auth: {
        secretKey: 'KUVH/0ZQn%8OKhI#MZv%yNT2!0O97iFnIK*HfioO#*e1',
        expiresIn: 60 * 60 * 24,
    },
    qq: {
        appId: '101993258',
        appKey: '1a2396bafa1a415081b5f12c3f80989d',
        redirectUrl: 'http://my-graduation-project.com/home',
        loginUrl: 'https://graph.qq.com/oauth2.0/authorize',
        tokenUrl: 'https://graph.qq.com/oauth2.0/token',
        openIdUrl: 'https://graph.qq.com/oauth2.0/me',
        userMessageUrl: 'https://graph.qq.com/user/get_user_info',
    },
};