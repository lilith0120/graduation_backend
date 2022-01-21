import * as requireDirectory from 'require-directory';
import * as Router from 'koa-router';

class InitManager {
    static app: any;

    // 入口方法
    static initCore(app: any) {
        InitManager.app = app;
        InitManager.initLoadRouter();
    };

    static initLoadRouter() {
        const apiDirectory = `${process.cwd()}/app/api`;
        requireDirectory(module, apiDirectory, {
            visit: whenLoadModule
        });

        function whenLoadModule(obj: any) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes());
            }
        };
    };
};

export default InitManager;