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
    const chapters = await fetch(`${process.env.API_V1}/chapter/all`).then(
      (res) => res.json()
    );

    if (!chapters) {
      return <h2>Chapters not found</h2>;
    }
    return (
      <>
        <CreateOrUpdateView
          fromPage="Topic"
          action="Create"
          role={session.user.role}
          chapters={chapters.data.data}
        />
      </>
    );
  } else if (action === "update") {
    const { id } = await searchParams;
    const [chapters, res] = await Promise.all([
      fetch(`${process.env.API_V1}/chapter/all`).then((res) => res.json()),
      fetch(`${process.env.API_V1}/topic?id=${id}`).then((res) => res.json()),
    ]);

    return (
      <>
        <CreateOrUpdateView
          fromPage="Topic"
          action="Update"
          role={session.user.role}
          data={res.data}
          chapters={chapters.data.data}
        />
      </>
    );
  } else {
    return <h2>Invalid Action</h2>;
  }
};

export default page;
