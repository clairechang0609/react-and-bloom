import { FC, memo } from 'react';

// 狀態圖示
const StatusIcon: FC<{isEnabled: boolean | 1 | 0; labels?: string[]}> = memo(({ isEnabled, labels = ['停用', '啟用'] }) => {
  const status = isEnabled
    ? { icon: 'bi-check-circle-fill', class: 'text-success' }
    : { icon: 'bi-x-circle-fill', class: 'text-danger' };

  return (
    <small className={`d-flex align-items-center ${status.class}`}>
      <i className={`me-2 bi ${status.icon}`}></i>
      {labels[isEnabled ? '1' : '0']}
    </small>
  );
});

export default StatusIcon;
