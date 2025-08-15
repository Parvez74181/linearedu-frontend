import MainView from "@/components/AcademicManagement/MCQ/MainView";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const page = async ({ searchParams }: Props) => {
  const { page = "1" } = await searchParams;
  try {
    const res = await fetch(`${process.env.API_V1}/mcq/all?page=${page}`).then((res) => res.json());
    const totalPage = Math.ceil(res.data.totalRow / res.data.limit);

    return (
      <>
        <MainView
          fromPage="MCQ"
          data={res.data.data || []}
          limit={res.data.limit}
          totalPage={totalPage}
          totalRow={res.data.totalRow}
          role={"admin"}
        />
      </>
    );
  } catch (error) {
    console.log(error);

    return <>Something Went Wrong</>;
  }
};

export default page;
