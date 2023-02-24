declare namespace API {
  /**
   * 角色列表
   */
  type RoleListItem = {
    id: number;
    name: string;
    remark?: string;
    sort: number;
    permission?: string;
    isSystem: boolean;

    enable: boolean;

    updateIP: string;
    updateTime: string;
    updateUser?: string;
    updateUserID: number;

    createIP: string;
    createTime: string;
    createUser?: string;
    createUserID: number;

    ex1: number;
    ex2: number;
    ex3: number;
    ex4?: string;
    ex5?: string;
    ex6?: string;
  };
  /**
   *
   */
  type RoleList = {
    data?: RoleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };
}
