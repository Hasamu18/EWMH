import { ROLE } from "../../../constants/role";

export function roleNameGenerator(roleId?: string) {
  switch (roleId) {
    case ROLE.admin:
      return "Quản trị viên";
    case ROLE.manager:
      return "Quản lý";
    case ROLE.leader:
      return "Trưởng nhóm";
    case ROLE.worker:
      return "Nhân viên";
    case ROLE.customer:
      return "Khách hàng";
    default:
      return "Unknown";
  }
}
