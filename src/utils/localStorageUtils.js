export const AUTH_USER = 'auth_user';
export const ACCESS_TOKEN = 'access_token';
export const RESFRESH_TOKEN = 'refresh_token';
export const AUTHORITIES = 'authorities';

class localStorage {
  ls = window.localStorage;
  sessionStorage = window.sessionStorage;
  getLoginUser() {
    return this.getSessionItem(AUTH_USER);
  }

  getAuthorities = () => {
    let authorities = this.getSessionItem(AUTHORITIES);
    return authorities || {};
  };

  setSessionLogin({ accessToken, refreshToken, user, authorities }) {
    this.setSessionItem(ACCESS_TOKEN, accessToken);
    this.setSessionItem(RESFRESH_TOKEN, refreshToken);
    this.setSessionItem(AUTH_USER, user);
    this.setSessionItem(AUTHORITIES, authorities);
  }

  setSessionItem(key, value) {
    value = JSON.stringify(value);
    this.sessionStorage.setItem(key, value);
  }

  getSessionItem(key) {
    let value = this.sessionStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }

  removeSessionItem(key) {
    this.sessionStorage.removeItem(key);
  }

  clearSession() {
    this.sessionStorage.clear();
  }
}

export default new localStorage();
