'use client';

import React from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

type Props = {
  onUpload: (file: File) => void;
};

const UploadComponent = ({ onUpload }: Props) => {
  const beforeUpload = (file: File) => {
    const isCSV = file.type === 'text/csv';
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
  
    if (!isCSV && !isExcel) {
      message.error('Only CSV or Excel files are allowed!');
    }
  
    return true;
  };  

  return (
    <Upload
      customRequest={({ file }) => onUpload(file as File)}
      showUploadList={false}
      beforeUpload={beforeUpload}
    >
      <Button
        icon={<UploadOutlined />}
        style={{
          backgroundColor: '#28a745',
          color: '#fff',
          borderColor: '#28a745',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.color = '#28a745';
          e.currentTarget.style.borderColor = '#28a745';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#28a745';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderColor = '#28a745';
        }}
      >
        Upload CSV/Excel
      </Button>
    </Upload>
  );
};

export default UploadComponent;
