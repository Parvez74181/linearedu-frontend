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
    const subjects = await fetch(`${process.env.API_V1}/subject/all`).then(
      (res) => res.json()
    );

    if (!subjects) {
      return <h2>Subjects not found</h2>;
    }
    return (
      <>
        <CreateOrUpdateView
          fromPage="Chapter"
          action="Create"
          role={session.user.role}
          subjects={subjects.data.data}
        />
      </>
    );
  } else if (action === "update") {
    const { id } = await searchParams;
    const [subjects, res] = await Promise.all([
      fetch(`${process.env.API_V1}/subject/all`).then((res) => res.json()),
      fetch(`${process.env.API_V1}/chapter?id=${id}`).then((res) => res.json()),
    ]);
    if (!subjects) {
      return <h2>Subjects not found</h2>;
    }

    return (
      <>
        <CreateOrUpdateView
          fromPage="Chapter"
          action="Update"
          role={session.user.role}
          data={res.data}
          subjects={subjects.data.data}
        />
      </>
    );
  } else {
    return <h2>Invalid Action</h2>;
  }
};

export default page;
