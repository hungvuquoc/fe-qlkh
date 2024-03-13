import classNames from 'classnames/bind';
import style from './Index.module.scss';
import SecurityApi from '~/store/api/SecurityApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localStorageUtils from '~/utils/localStorageUtils';
import useStore, { LOADING } from '~/store/hooks';
import { mapObjectToForm } from '~/utils/common';
import { ACCESS_TOKEN } from '~/utils/localStorageUtils';
import logo from '~/assets/images/ChungLan.jpg';

const cx = classNames.bind(style);

function Login() {
  const [data, setData] = useState({
    username: null,
    password: null,
    showPassword: false,
  });
  const history = useNavigate();
  const { startLoading, stopLoading } = useStore(LOADING);

  useEffect(() => {
    let token = localStorageUtils.getSessionItem(ACCESS_TOKEN);
    if (token) {
      history('/warehouse');
    }
  });

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    startLoading();
    try {
      const formData = new FormData();
      mapObjectToForm(formData, { username: data.username, password: data.password }, null);
      const response = await SecurityApi.login(formData);
      console.log(response);
      localStorageUtils.setSessionLogin({ ...response });
      history('/warehouse');
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };
  return (
    <>
      <div className={cx('main')}>
        <div className={cx('container')}>
          <div className={cx('logo')}>
            <img src={logo} />
          </div>
          <div className={cx('form')}>
            <div className={cx('form_item')}>
              <div className={cx('form_item-container')}>
                <div className={cx('form-input')}>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Tên đăng nhập"
                    value={data?.username || ''}
                    onChange={(event) => handleChangeInput(event)}
                  />
                </div>
              </div>
              <div className={cx('form_item-container')}>
                <div className={cx('form-input')}>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Mật khẩu"
                    value={data?.password || ''}
                    onChange={(event) => handleChangeInput(event)}
                  />
                </div>
              </div>
            </div>
            <div>
              <button className={cx('button')} onClick={handleSubmit}>
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
