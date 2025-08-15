import MainView from "@/components/AcademicManagement/MainView";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
const page = async ({ searchParams }: Props) => {
  const { page = "1" } = await searchParams;
  try {
    const res = await fetch(`${process.env.API_V1}/course/all?page=${page}`).then((res) => res.json());

    const totalPage = Math.ceil(res.data.totalRow / res.data.limit);
    return (
      <>
        <MainView
          fromPage="Course"
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
