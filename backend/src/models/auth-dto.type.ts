export type TLoginDto = {
  email: string;
  password: string;
};

export type TGuestLoginResponse = {
  uid: string;
  token: string;
};

export type TLoginResponse = {
  uid: string;
  email: string;
};
