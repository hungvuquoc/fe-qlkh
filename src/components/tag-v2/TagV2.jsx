import { AiOutlineClose } from 'react-icons/ai';

function TagV2({ fieldName = 'name', data = [], cx, handleClickContainer, handleDeleteItem }) {
  const handleContainer = () => {
    handleClickContainer();
  };

  const handleDelete = (event, index, tag) => {
    event.stopPropagation();
    handleDeleteItem(index, tag);
  };

  return (
    <>
      <div className={cx('tag-container')} onClick={handleContainer}>
        {data?.map((tag, index) => (
          <div key={index} className={cx('tag-item')}>
            <span>{eval(`tag?.${fieldName}`)}</span>
            <button
              type="button"
              className={cx('tag-button-delete')}
              onClick={(event) => handleDelete(event, index, tag)}
            >
              <AiOutlineClose className={cx('tag-icon-delete')} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default TagV2;
