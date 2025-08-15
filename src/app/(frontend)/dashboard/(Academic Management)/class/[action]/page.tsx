import CreateOrUpdateView from "@/components/AcademicStructure/CreateOrUpdateView";

interface Props {
  params: Promise<{ action: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const page = async ({ searchParams, params }: Props) => {
  const { action } = await params;
  if (action === "create") {
    return (
      <>
        <CreateOrUpdateView fromPage="Class" action="Create" role={"admin"} />
      </>
    );
  } else if (action === "update") {
    const { id } = await searchParams;
    const res = await fetch(`${process.env.API_V1}/class?id=${id}`).then((res) => res.json());

    return (
      <>
        <CreateOrUpdateView fromPage="Class" action="Create" role={"admin"} data={res.data} />
      </>
    );
  } else {
    return <h2>Invalid Action</h2>;
  }
};

export default page;
