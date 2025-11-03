(function (global) {
    'use strict';

    function getTelegramWebApp() {
        if (typeof global === 'undefined') {
            return null;
        }

        const webApp = global.Telegram && global.Telegram.WebApp
            ? global.Telegram.WebApp
            : null;

        return webApp || null;
    }

    function parseUserFromInitData(initData) {
        if (!initData) {
            return null;
        }

        try {
            const params = new URLSearchParams(initData);
            const userParam = params.get('user');

            if (!userParam) {
                return null;
            }

            return JSON.parse(userParam);
        } catch (error) {
            console.warn('Failed to parse Telegram init data:', error);
            return null;
        }
    }

    function cacheTelegramUser(user) {
        if (!user || !user.id) {
            return;
        }

        try {
            global.sessionStorage.setItem('telegram_user', JSON.stringify(user));
        } catch (error) {
            console.warn('Failed to cache Telegram user:', error);
        }
    }

    function getCachedTelegramUser() {
        try {
            const cached = global.sessionStorage.getItem('telegram_user');
            if (!cached) {
                return null;
            }

            const user = JSON.parse(cached);
            return user && user.id ? user : null;
        } catch (error) {
            console.warn('Failed to read cached Telegram user:', error);
            return null;
        }
    }

    function getTelegramUser() {
        const webApp = getTelegramWebApp();
        if (!webApp) {
            return getCachedTelegramUser();
        }

        const unsafeUser = webApp.initDataUnsafe && webApp.initDataUnsafe.user
            ? webApp.initDataUnsafe.user
            : null;

        if (unsafeUser && unsafeUser.id) {
            cacheTelegramUser(unsafeUser);
            return unsafeUser;
        }

        const parsedUser = parseUserFromInitData(webApp.initData);
        if (parsedUser && parsedUser.id) {
            cacheTelegramUser(parsedUser);
            return parsedUser;
        }

        return getCachedTelegramUser();
    }

    global.TelegramHelpers = {
        getTelegramWebApp,
        getTelegramUser,
        cacheTelegramUser
    };
})(window);
