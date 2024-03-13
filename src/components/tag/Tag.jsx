import classNames from 'classnames/bind';
import Style from './Default.module.scss';
import { AiOutlineClose } from 'react-icons/ai';

function Tag({ fieldName = 'name', data = [], handleDelete, styleCustom = {} }) {
  const cx = classNames.bind({ ...Style, ...styleCustom });

  const handleButtonDelete = (index, tag) => {
    handleDelete(index, tag);
  };

  return (
    <>
      <div className={cx('container')}>
        {data?.map((tag, index) => (
          <div key={index} className={cx('item')}>
            <span>{eval(`tag?.${fieldName}`)}</span>
            <button type="button" className={cx('button-delete')} onClick={() => handleButtonDelete(index, tag)}>
              <AiOutlineClose className={cx('icon-delete')} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Tag;
