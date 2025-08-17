"use server";

// AcademicStructure
export const addAcademicStructure = async (data: any, academicStructure: string) => {
  const parsedData = JSON.parse(data);
  console.log(data);

  try {
    switch (academicStructure) {
      case "Class": {
        const res = await fetch(`${process.env.API_V1}/class/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });
        if (res.ok) return { message: "Class created successfully", success: true };
        else return { message: "Something went wrong", success: false };
      }
      case "Course": {
        const res = await fetch(`${process.env.API_V1}/course/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });
        if (res.ok) return { message: "Course created successfully", success: true };
        else return { message: "Something went wrong", success: false };
      }
      case "Subject": {
        const res = await fetch(`${process.env.API_V1}/subject/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });
        if (res.ok) return { message: "Subject created successfully", success: true };
        else return { message: "Something went wrong", success: false };
      }
      case "Chapter": {
        const res = await fetch(`${process.env.API_V1}/chapter/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });
        if (res.ok) return { message: "Chapter created successfully", success: true };
        else return { message: "Something went wrong", success: false };
      }
      case "Topic": {
        const res = await fetch(`${process.env.API_V1}/topic/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });
        if (res.ok) return { message: "Topic created successfully", success: true };
        else return { message: "Something went wrong", success: false };
      }

      case "CQ": {
        const res = await fetch(`${process.env.API_V1}/cq/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });
        const resData = await res.json();
        if (res.ok) return { message: "CQ created successfully", success: true };
        else return { message: resData.message, success: false };
      }
      case "MCQ": {
        const res = await fetch(`${process.env.API_V1}/mcq/create`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });
        const resData = await res.json();
        if (res.ok) return { message: "MCQ created successfully", success: true };
        else return { message: resData.message, success: false };
      }

      default: {
        return { message: "Invalid academic structure", success: false };
      }
    }
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong, please try again", error: JSON.stringify(error), success: false };
  }
};
export const updatedAcademicStructure = async (data: any, academicStructure: string) => {
  const parsedData = JSON.parse(data);
  try {
    switch (academicStructure) {
      case "Class": {
        const res = await fetch(`${process.env.API_V1}/class/update/${parsedData?.id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });

        if (res.ok) return { message: "Class updated successfully", success: true };
        else return { message: "Something went wrong", success: false };
      }
      case "Course": {
        const res = await fetch(`${process.env.API_V1}/course/update/${parsedData?.id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });

        if (res.ok) return { message: "Course updated successfully", success: true };
        else return { message: "Something went wrong", success: false };
      }
      case "Subject": {
        const res = await fetch(`${process.env.API_V1}/subject/update/${parsedData?.id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });

        if (res.ok) return { message: "Subject updated successfully", success: true };
        else return { message: "Something went wrong", success: false };
      }
      case "Chapter": {
        const res = await fetch(`${process.env.API_V1}/chapter/update/${parsedData?.id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });

        if (res.ok) return { message: "Chapter updated successfully", success: true };
        else return { message: "Something went wrong", success: false };
      }
      case "Topic": {
        const res = await fetch(`${process.env.API_V1}/topic/update/${parsedData?.id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });

        if (res.ok) return { message: "Topic updated successfully", success: true };
        else return { message: "Something went wrong", success: false };
      }
      case "CQ": {
        const res = await fetch(`${process.env.API_V1}/cq/update/${parsedData?.id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });
        const resData = await res.json();
        if (res.ok) return { message: "CQ updated successfully", success: true };
        else return { message: resData.message, success: false };
      }
      case "MCQ": {
        const res = await fetch(`${process.env.API_V1}/mcq/update/${parsedData?.id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: data,
        });
        const resData = await res.json();
        if (res.ok) return { message: "MCQ updated successfully", success: true };
        else return { message: resData.message, success: false };
      }

      default: {
        return { message: "Invalid academic structure", success: false };
      }
    }
  } catch (error) {
    console.log(error);
    return { message: "Something went wrong, please try again", error: JSON.stringify(error), success: false };
  }
};

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

    if (res.ok) return { message: `${fromPage} updated successfully`, success: true };
    else return { message: "Something went wrong", success: false };
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

    if (res.ok) return { message: `${fromPage} updated successfully`, success: true };
    else return { message: "Something went wrong", success: false };
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
