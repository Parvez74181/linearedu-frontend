import { getSession } from "@/actions";
import CreateOrUpdateView from "@/components/AcademicManagement/MCQ/CreateOrUpdateView";

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
          fromPage="MCQ"
          action="Create"
          role={session.user.role}
          chapters={chapters.data.data}
        />
      </>
    );
  } else if (action === "update") {
    const { id } = await searchParams;
    const [res, chapters] = await Promise.all([
      fetch(`${process.env.API_V1}/mcq?id=${id}`).then((res) => res.json()),
      fetch(`${process.env.API_V1}/chapter/all`).then((res) => res.json()),
    ]);
    if (!chapters) {
      return <h2>Chapters not found</h2>;
    }
    return (
      <>
        <CreateOrUpdateView
          fromPage="MCQ"
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
