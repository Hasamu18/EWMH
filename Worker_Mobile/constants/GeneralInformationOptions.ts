export type GeneralInformationOption = {
  icon: string;
  title: string;
  targetScreen: string;
};

export const GENERAL_INFORMATION_OPTIONS: GeneralInformationOption[] = [
  // {
  //   icon: "people-outline",
  //   title: "Nhóm của tôi",
  //   targetScreen: "/myTeam",
  // },
  // {
  //   icon: "bonfire-outline",
  //   title: "Trưởng nhóm của tôi",
  //   targetScreen: "myLeader",
  // },
  {
    icon: "checkmark-done-circle-outline",
    title: "Các yêu cầu đã hoàn thành",
    targetScreen: "/completedRequests",
  },
  {
    icon: "person-circle-outline",
    title: "Cập nhật thông tin cá nhân",
    targetScreen: "/updateProfile",
  },
];
