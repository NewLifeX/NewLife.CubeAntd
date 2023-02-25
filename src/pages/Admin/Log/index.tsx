import { query, queryColumns } from './service';
import { FormOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Button, Drawer } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import IconStatus from '@/components/IconStatus';

const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.LogListItem>();

  const columns: ProColumns<API.LogListItem>[] = [
    {
      title: '类型',
      dataIndex: 'category',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '成功',
      dataIndex: 'success',
      width: 70,
      hideInSearch: true,
      align: 'center',
      render(_, entity) {
        return <IconStatus status={entity.success} />;
      },
    },
    {
      title: '详细信息',
      dataIndex: 'remark',
      hideInSearch: true,
      ellipsis: true,
    },
    {
      title: '追踪',
      dataIndex: 'traceId',
      width: 70,
      hideInSearch: true,
      render(_, entity) {
        return <a href={`http://star.newlifex.com/trace?id=${entity.traceId}`}>追踪</a>;
      },
    },
    {
      title: '关联',
      dataIndex: 'linkID',
      width: 70,
      hideInSearch: true,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      width: 80,
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'createIP',
      width: 300,
      hideInSearch: true,
    },
    {
      title: '时间',
      dataIndex: 'createTime',
      width: 160,
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      width: 70,
      render() {
        return [
          <Button key={'view'} shape="circle" type={'link'} icon={<FormOutlined />}>
            查看
          </Button>,
        ];
      },
    },
    {
      title: '日期',
      dataIndex: 'dateRange',
      hideInTable: true,
      hideInForm: true,
      hideInDescriptions: true,
      hideInSearch: false,
      hideInSetting: true,
      valueType: 'dateRange',
      fieldProps: {
        placeholder: ['开始日期', '结束日期'],
      },
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      hideInForm: true,
      hideInDescriptions: true,
      hideInSearch: false,
      hideInSetting: true,
      fieldProps: {
        placeholder: '搜索关键字',
      },
    },
  ];

  const [columnsLoading, setColumnsLoading] = useState<boolean>(true);
  // todo 动态列使用这个
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [columnsData, setColumnsData] = useState<ProColumns<API.RoleListItem>[]>([]);

  useEffect(() => {
    const fetch = async () => {
      setColumnsLoading(false);
      const res = await queryColumns();
      const data = res.data;
      setColumnsData(
        data
          .sort((p) => p.sort)
          .map((d) => {
            return {
              dataIndex: d.name,
              title: d.displayName,
              width: parseInt(d.width) || 100,
              ellipsis: true,
              hideInTable: !d.showInList,
              hideInSearch: !d.showInSearch,
              hideInForm: !d.showInAddForm || !d.showInEditForm,
              hideInDescriptions: !d.showInDetailForm,
              tooltip: d.description === d.displayName ? undefined : d.description,
              render(dom, entity) {
                if (d.dataType === 'Boolean') {
                  return <IconStatus status={entity[d.name]} />;
                }
                return dom;
              },
            } as ProColumns<any>;
          }),
      );
    };
    if (columnsLoading) {
      fetch();
    }
  }, [columnsLoading]);

  return (
    <PageContainer>
      <ProTable<API.LogListItem, API.PageParams>
        headerTitle={'系统内重要操作均记录日志，便于审计。任何人都不能删除、修改或伪造操作日志。'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
        }}
        toolBarRender={() => []}
        request={query}
        columns={columns}
        scroll={{ x: 1366 }}
        rowSelection={false}
      />
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.LogListItem>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.LogListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
