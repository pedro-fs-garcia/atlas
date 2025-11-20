export type RegisterDTO = {
  username: string;
  email: string;
  password: string;
};

export type LoginDTO = {
  email: string;
  password: string;
};

export type AuthResponseDTO = {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
};
