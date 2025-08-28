import { getSession } from "@/actions";
import CreateOrUpdateView from "@/components/AcademicManagement/CreateOrUpdateView";

interface Props {
  params: Promise<{ action: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const page = async ({ searchParams, params }: Props) => {
  const { action } = await params;
  const session = await getSession();
  if (action === "create") {
    const [classes, programs] = await Promise.all([
      fetch(`${process.env.API_V1}/class/all`).then((res) => res.json()),
      fetch(`${process.env.API_V1}/program/all`).then((res) => res.json()),
    ]);
    if (!classes || !programs) {
      return <h2>Classes / Programs not found</h2>;
    }

    return (
      <>
        <CreateOrUpdateView
          fromPage="Subject"
          action="Create"
          role={session.user.role}
          classes={classes.data.data}
          programs={programs.data.data}
        />
      </>
    );
  } else if (action === "update") {
    const { id } = await searchParams;

    const [classes, programs, res] = await Promise.all([
      fetch(`${process.env.API_V1}/class/all`).then((res) => res.json()),
      fetch(`${process.env.API_V1}/program/all`).then((res) => res.json()),
      fetch(`${process.env.API_V1}/subject?id=${id}`).then((res) => res.json()),
    ]);
    if (!classes || !programs) {
      return <h2>Classes / Programs not found</h2>;
    }

    return (
      <>
        <CreateOrUpdateView
          fromPage="Subject"
          action="Update"
          role={session.user.role}
          data={res.data}
          classes={classes.data.data}
          programs={programs.data.data}
        />
      </>
    );
  } else {
    return <h2>Invalid Action</h2>;
  }
};

export default page;
