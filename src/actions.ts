"use server";

import { cookies } from "next/headers";

export const getSession = async () => {
  const cookieStore = await cookies();
  const session_token = cookieStore.get("linearedu.session_token")?.value;
  if (!session_token) {
    return { message: "No session", success: false };
  }
  try {
    const res = await fetch(`${process.env.API_V1}/user/session`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: session_token }),
    });
    const resData = await res.json();
    if (res.ok) return { message: resData.message, user: resData.data.user, success: true };
    else return { success: false, message: resData.message };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong, please try again", error: JSON.stringify(error), success: false };
  }
};

export const login = async (data: any) => {
  const cookieStore = await cookies();
  const parsedData = JSON.parse(data);
  try {
    const res = await fetch(`${process.env.API_V1}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ phoneNumber: parsedData.phoneNumber, password: parsedData.password }),
    }).then((res) => res.json());

    if (res.success) {
      console.log(res.data.user);
      cookieStore.set("linearedu.session_token", res.data.user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 14 * 24 * 60 * 60, // 14 days
        path: "/",
        domain: process.env.NODE_ENV === "production" ? "linearedu.com" : undefined,
      });
      return { success: true, message: res.message, user: res.data.user };
    } else {
      return { success: false, message: res.message };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
};

export const logout = async (id: any) => {
  const cookieStore = await cookies();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_V1}/user/logout?userId=${id}`, {
      method: "GET",
      credentials: "include",
    }).then((res) => res.json());

    if (res.success) {
      cookieStore.delete("linearedu.session_token");
      return { success: true, message: res.message };
    } else {
      return { success: false, message: res.message };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
};

export const otpVerify = async (data: any) => {
  const cookieStore = await cookies();
  const parsedData = JSON.parse(data);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_V1}/user/verify-otp?type=signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ otp: parsedData.otp, phone: parsedData.phone }),
    }).then((res) => res.json());

    if (res.success) {
      cookieStore.set("linearedu.session_token", res.data.user.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 14 * 24 * 60 * 60, // 14 days
        path: "/",
        domain: process.env.NODE_ENV === "production" ? "linearedu.com" : undefined,
      });
      return { success: true, message: res.message, user: res.data.user };
    } else {
      return { success: false, message: res.message };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
};

// CRUD API
export const addInstances = async (data: any, fromPage: string) => {
  try {
    const res = await fetch(`${process.env.API_V1}/${fromPage.toLowerCase().replaceAll(" ", "-")}/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    const resData = await res.json();
    if (res.ok) return { message: `${fromPage} updated successfully`, success: true };
    else return { message: resData.message, success: false };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong, please try again", error: JSON.stringify(error), success: false };
  }
};

export const updateInstances = async (data: any, fromPage: string) => {
  const parsedData = JSON.parse(data);

  try {
    const res = await fetch(
      `${process.env.API_V1}/${fromPage.toLowerCase().replaceAll(" ", "-")}/update/${parsedData?.id}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }
    );
    const resData = await res.json();
    if (res.ok) return { message: `${fromPage} updated successfully`, success: true };
    else return { message: resData.message || "Something went wrong", success: false };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong, please try again", error: JSON.stringify(error), success: false };
  }
};

export const deleteInstances = async (id: any, fromPage: string) => {
  try {
    const res = await fetch(`${process.env.API_V1}/${fromPage?.toLowerCase().replaceAll(" ", "-")}/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) return { message: `${fromPage} deleted successfully`, success: true };
    else return { message: "Something went wrong", success: false };
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong, please try again", error: JSON.stringify(error), success: false };
  }
};
