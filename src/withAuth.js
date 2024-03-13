import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localStorageUtils from './utils/localStorageUtils';
import { ACCESS_TOKEN } from './utils/localStorageUtils';

const withAuth = (WrappedComponent) => {
  const AuthComponent = (props) => {
    const history = useNavigate();

    useEffect(() => {
      // Kiểm tra token
      let token = localStorageUtils.getSessionItem(ACCESS_TOKEN);

      if (!token) {
        // Nếu không có token, chuyển hướng đến trang login
        history('/login');
      }
    }, [history]);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
