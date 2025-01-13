import { FC } from 'react';

// 狀態圖示
const StatusIcon: FC<{isEnabled: 0|1}> = ({ isEnabled }) => {
  const status = isEnabled
    ? { icon: 'bi-check', label: '啟用', class: 'text-bg-success' }
    : { icon: 'bi-x', label: '停用', class: 'text-bg-danger' };

  return (
    <div className={`badge rounded-pill ${status.class}`}>
      <i className={`bi ${status.icon}`}></i> {status.label}
    </div>
  );
};

export default StatusIcon;
