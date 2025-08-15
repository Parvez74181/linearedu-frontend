import CreateOrUpdateView from "@/components/AcademicManagement/CreateOrUpdateView";

interface Props {
  params: Promise<{ action: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const page = async ({ searchParams, params }: Props) => {
  const { action } = await params;
  if (action === "create") {
    const [classes, courses] = await Promise.all([
      fetch(`${process.env.API_V1}/class/all`).then((res) => res.json()),
      fetch(`${process.env.API_V1}/course/all`).then((res) => res.json()),
    ]);
    if (!classes || !courses) {
      return <h2>Classes / Courses not found</h2>;
    }

    return (
      <>
        <CreateOrUpdateView
          fromPage="Subject"
          action="Create"
          role={"admin"}
          classes={classes.data.data}
          courses={courses.data.data}
        />
      </>
    );
  } else if (action === "update") {
    const { id } = await searchParams;

    const [classes, courses, res] = await Promise.all([
      fetch(`${process.env.API_V1}/class/all`).then((res) => res.json()),
      fetch(`${process.env.API_V1}/course/all`).then((res) => res.json()),
      fetch(`${process.env.API_V1}/subject?id=${id}`).then((res) => res.json()),
    ]);
    if (!classes || !courses) {
      return <h2>Classes / Courses not found</h2>;
    }

    return (
      <>
        <CreateOrUpdateView
          fromPage="Subject"
          action="Update"
          role={"admin"}
          data={res.data}
          classes={classes.data.data}
          courses={courses.data.data}
        />
      </>
    );
  } else {
    return <h2>Invalid Action</h2>;
  }
};

export default page;
