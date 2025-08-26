export interface siteSetting {
  phone: string;
  address: string;
  email: string;
  fb_page: string;
  fb_group: string;
  twitter: string;
  instagram: string;
  whatsapp: string;
}
export interface User {
  id: number;
  name: string;
  email: string;
  image: string | null;
  address: string;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  scope: "credentials" | string;
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
  refreshTokenExpiresAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
