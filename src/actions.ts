"use server";

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
