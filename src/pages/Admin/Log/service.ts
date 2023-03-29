import { RequestData } from '@ant-design/pro-components';
import { request } from '@umijs/max';
import { SortOrder } from 'antd/es/table/interface';

export async function queryColumns(): Promise<ResponseStructure<CubeColumn[]>> {
  return request<ResponseStructure<CubeColumn[]>>('/Admin/Log/GetColumns', {
    method: 'GET',
  });
}

export async function detail(id: number): Promise<ResponseStructure<API.LogListItem>> {
  const res = await request<ResponseStructure<API.LogListItem>>(`/Admin/Log/ExportExcel?id=${id}`);
  console.log(res);
  return res;
}

/** 查询数据 */
export async function query(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
    /** 关键字 */
    keyword?: string;
    /** 日期 */
    dateRange?: string[];
  },
  sort: Record<string, SortOrder>,
  options?: { [key: string]: any },
): Promise<RequestData<API.LogListItem>> {
  let ext = {};
  if (params.keyword) {
    ext = {
      Q: params.keyword,
    };
  }
  if (Object.keys(sort).length > 0) {
    ext = {
      ...ext,
      sort: Object.keys(sort)[0],
      desc: sort[Object.keys(sort)[0]] === 'descend' ? 'True' : 'False',
    };
  }
  if (params.dateRange && params.dateRange.length === 2) {
    ext = {
      ...ext,
      dtStart: params.dateRange[0],
      dtEnd: params.dateRange[1],
    };
  }
  const res = await request<ResponseStructure<API.LogListItem[]>>('/Admin/Log', {
    method: 'GET',
    params: {
      pageIndex: params.current,
      pageSize: params.pageSize,
      ...ext,
    },
    ...(options || {}),
  });
  return {
    data: res.data,
    success: res.code === 0,
    total: res.pager?.totalCount || 0,
  };
}
