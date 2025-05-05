'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Table, Input, Pagination, Spin, Row, Col, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UploadComponent } from '@/components';
import { fetchSummary } from '@/services/api/Summary';
import { uploadDataset } from '@/services/api/Upload';
import { loadDataset } from '@/services/api/LoadDataset';
import { SummaryResponse } from '@/interfaces/responses';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {
  const [genderStats, setGenderStats] = useState<SummaryResponse['genderStats']>([]);
  const [data, setData] = useState<SummaryResponse['data']['data']>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const getSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchSummary(search, page, pageSize);
      if (res) {
        setGenderStats(res.genderStats);
        setData(res.data.data);
        setTotal(res.data.total);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(`Failed to fetch summary: ${err.message}`);
      } else {
        message.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, pageSize]);
  
  useEffect(() => {
    getSummary();
  }, [getSummary]);

  const handleUpload = async (file: File) => {
    const isCSV = file.type === 'text/csv';
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
  
    if (!isCSV && !isExcel) {
      message.error('Only CSV or Excel files are allowed!');
      return;
    }
  
    const result = await uploadDataset(file);
    if (result?.success) {
      message.success(result.message);
  
      const loadResult = await loadDataset();
      if (loadResult.success) {
        message.success(loadResult.message);
        await getSummary();
      } else {
        message.error(loadResult.message);
      }
  
    } else {
      message.error(result?.message || 'Upload failed');
    }
  };  

  const genderChartData = {
    labels: genderStats.map((item) => item._id || 'Unknown'),
    datasets: [
      {
        label: 'Gender Count',
        data: genderStats.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const columns: ColumnsType<SummaryResponse['data']['data'][0]> = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Gender', dataIndex: 'gender' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Location', dataIndex: 'nameOfLocation' },
    { title: 'Login Hour', dataIndex: 'loginHour' },
  ];

  return (
    <div style={{ padding: '40px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>Dataset Summary</h1>
        </Col>
        <Col>
          <UploadComponent onUpload={handleUpload} />
        </Col>
      </Row>

      <div style={{ marginBottom: 30, fontWeight: 400 }}>
        <h2>Gender Chart</h2>
        <Bar data={genderChartData} />
      </div>

      <div style={{ margin: '20px 0' }}>
        <Input.Search
          placeholder="Search by name or email"
          enterButton
          onSearch={(value) => {
            setPage(1);
            setSearch(value);
          }}
          style={{ maxWidth: 400 }}
        />
      </div>

      <Spin spinning={loading}>
        <Table
          rowKey="email"
          dataSource={data}
          columns={columns}
          pagination={false}
        />
        <div style={{ display: 'flex', marginTop: 20 }}>
          <div style={{ marginTop: 6 }}>Total Data: <strong>{total}</strong></div>
          <Pagination
            current={page}
            total={total}
            onChange={(value, pageSize) => {
              setPage(1);
              setPageSize(pageSize);
            }}
          />
        </div>
      </Spin>
    </div>
  );
}
