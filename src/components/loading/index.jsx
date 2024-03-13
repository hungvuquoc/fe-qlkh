import classNames from 'classnames/bind';
import style from './Index.module.scss';
import React from 'react';
import useStore, { LOADING } from '~/store/hooks';

const cx = classNames.bind(style);

const Loading = () => {
  const { isLoading } = useStore(LOADING);

  return isLoading ? <div className={cx('loading-overlay')}>Loading...</div> : null;
};

export default Loading;
