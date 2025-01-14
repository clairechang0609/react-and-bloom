import { FC } from 'react';

// 狀態圖示
const StatusIcon: FC<{isEnabled: '0' | '1'}> = ({ isEnabled }) => {
  const status = isEnabled
    ? { icon: 'bi-check-circle-fill', label: '啟用', class: 'text-success' }
    : { icon: 'bi-x-circle-fill', label: '停用', class: 'text-danger' };

  return (
    <small className={`d-flex align-items-center ${status.class}`}>
      <i className={`me-2 bi ${status.icon}`}></i>
      {status.label}
    </small>
  );
};

export default StatusIcon;
