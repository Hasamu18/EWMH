export type ProfileResponse = {
  message: string;
  response: UserProfile;
};
export type UserProfile = {
  accountId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  dateOfBirth: string;
};
