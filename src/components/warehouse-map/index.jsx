function WarehouseMap({ cx, dataView, handleOnClickLocation }) {
  const handleClick = (rowIndex, colIndex, cell) => {
    if (typeof handleOnClickLocation === 'function') {
      handleOnClickLocation({ rowIndex, colIndex, cell });
    }
  };
  return (
    <>
      <table>
        <tbody>
          {dataView?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={`${rowIndex}.${colIndex}`}
                  rowSpan={cell.rowSpan}
                  colSpan={cell.colSpan}
                  className={cx({
                    location: cell.status === 0,
                    'has-product': cell.status === 1,
                    'has-product-search': cell.status === 2,
                    'has-export': cell.status === 3,
                  })}
                  onClick={() => handleClick(rowIndex, colIndex, cell)}
                >
                  {cell.areaName ? cell.areaName : cell.name}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default WarehouseMap;
