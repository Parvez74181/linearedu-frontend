import VisitorCharLine from "@/components/Visitor/VisitorCharLine";

interface Props {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}
const page = async ({ searchParams }: Props) => {
  const { year } = await searchParams;

  const date = new Date();

  const currentYear = date.getFullYear();
  try {
    const res = await fetch(
      `${process.env.API_V1}/visitor?year=${year ? year : currentYear}`,
      {
        method: "GET",
        credentials: "include",
      }
    ).then((res) => res.json());
    if (res.success) {
      return (
        <>
          <VisitorCharLine visitorData={res.data.monthlyData} />
        </>
      );
    } else {
      return <div>Something went wrong</div>;
    }
  } catch (error) {
    return <div>Something went wrong</div>;
  }
};

export default page;
