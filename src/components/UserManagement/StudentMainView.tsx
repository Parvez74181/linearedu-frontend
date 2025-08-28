"use client";
import {
  Autocomplete,
  AutocompleteItem,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  ButtonGroup,
  DatePicker,
  Input,
  Pagination,
  Tooltip,
  User,
} from "@heroui/react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { CircleCheck, CircleX, Delete, Download, Edit, Eye, Plus, SearchIcon, Trash, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import showToast from "@/lib/toast";
import {
  deleteAcademicStructure,
  deleteStudentRecords,
  deleteStudents,
  deleteUserManagement,
  getSearchedStudents,
} from "@/actions";
import { AlertModal } from "../alert-modal";
import type { AttendanceData, Batch, StudentData, User as UsersType } from "@/types";
import { cn, exportToExcel, filterAttendanceByDay } from "@/lib/utils";
import { format } from "date-fns";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

type Props = {
  fromPage: string;

  batches?: Batch[];
  payload?: any;
};

const StudentMainView = ({ fromPage, payload, batches }: Props) => {
  const columns = [
    {
      key: "#",
      label: "#",
    },
    {
      key: "studentId",
      label: "STUDENT ID",
    },

    {
      key: "student",
      label: "STUDENT",
    },
    { key: "monthlyFee", label: "MONTHLY FEE" },

    { key: "studentsPhone", label: "STUDENT PHONE" },
    { key: "guardiansPhone", label: "GUARDIAN PHONE" },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];
  const [studentsData, setStudentsData] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateSelected, setDateSelected] = useState<DateValue | null>(today(getLocalTimeZone()));
  const [selectedBatch, setSelectedBatch] = useState<React.Key | null>("");
  const [updatedStudentsData, setUpdatedStudentsData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const alertRef = useRef<any>(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  let formatter = useDateFormatter({ dateStyle: "short" });

  const handleDateChange = (e: any) => {
    setDateSelected(e);
  };

  const handleSearch = async () => {
    setLoading(true);
    const res = await getSearchedStudents(searchQuery.trim().toLowerCase());
    if (res.success) {
      showToast("Success", "success", res.message);
      router.push(`/dashboard/students/update?id=${res.data?.id}`);
    } else {
      showToast("Error", "danger", res.message);
      console.log(res);
    }
    setLoading(false);
  };

  // handleGetStudentsByBatchAndDate
  const handleGetStudentsByBatchAndDate = async () => {
    setLoading(true);

    const formattedDate = formatter.format(dateSelected!.toDate(getLocalTimeZone()));

    if (!selectedBatch) {
      showToast("Error", "danger", "Please select a batch");
      setLoading(false);

      return;
    }

    try {
      const params = new URLSearchParams(searchParams);
      params.set("date", format(formattedDate, "dd-MM-yyyy"));
      params.set("batch", selectedBatch as any);

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl, { scroll: false });

      const res = await fetch("/api/get-students-by-batch-and-date", {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify({
          batch: selectedBatch,
          date: formattedDate,
          fromPage: "All",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStudentsData(data.student);
        setUpdatedStudentsData([]); // reset

        showToast("Success", "success", "Students fetched successfully");
      } else {
        showToast("Error", "danger", data.message || "Failed to fetch students");
      }
    } catch (error) {
      console.log("Error fetching students:", error);
      showToast("Error", "danger", "Failed to fetch students");
    }

    setLoading(false);
  };

  useEffect(() => {
    const date = searchParams.get("date");
    const batch = searchParams.get("batch");

    if (date && batch && !selectedBatch) {
      try {
        setSelectedBatch((batch as any) || "");
        // Parse the date string to DateValue
        const [month, day, year] = date.split("/");
        if (month && day && year) {
          setDateSelected(
            today(getLocalTimeZone()).set({
              year: Number(year),
              month: Number(month),
              day: Number(day),
            })
          );
        }
      } catch (err) {
        console.error("Failed to parse date from URL params:", err);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const batch = searchParams.get("batch");
    if (batch && selectedBatch && dateSelected && !studentsData.length) {
      handleGetStudentsByBatchAndDate();
    }
  }, [selectedBatch, dateSelected, searchParams]);

  const handleDataDelete = (id: number, prevFile: string) => {
    alertRef.current?.showAlert({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this student?",
      onConfirm: async () => {
        const resDelete = await deleteStudents(id, prevFile);
        if (resDelete.success) {
          showToast("Success", "success", resDelete.message);
          setStudentsData((prevData) => prevData.filter((student: any) => student.id !== id));
        } else {
          showToast(resDelete.message, "danger");
          console.log(resDelete);
        }
      },
    });
  };

  const renderCell = (item: any, columnKey: string | number) => {
    const cellValue = item[columnKey as keyof any];

    switch (columnKey) {
      case "actions":
        return (
          <TableCell className="flex items-center gap-3">
            <Tooltip content={`Edit ${fromPage}`} color="foreground">
              <Link href={`/dashboard/${fromPage.toLowerCase().replace(" ", "-")}/update?id=${item.id}`}>
                <Edit strokeWidth={1.5} />
              </Link>
            </Tooltip>

            <Tooltip content={`View ${fromPage}`} color="foreground">
              <Link href={`/dashboard/${fromPage.toLowerCase().replace(" ", "-")}/update?id=${item.id}`}>
                <Eye strokeWidth={1.5} />
              </Link>
            </Tooltip>

            {payload?.role === "admin" && (
              <Tooltip content={`Delete ${fromPage.toLowerCase().replace(" ", "-")}`} color="danger">
                <Trash2
                  onClick={() => handleDataDelete(item?.id!, item?.image!)}
                  className="text-danger-500 cursor-pointer"
                />
              </Tooltip>
            )}
          </TableCell>
        );
      case "#":
        return <TableCell>{studentsData.indexOf(item) + 1}</TableCell>;
      case "monthlyFee":
        return (
          <TableCell className={cn(item?.fees[0]?.status !== "paid" ? "text-danger-500" : "text-success-500")}>
            {item?.isActive ? item?.fees[0]?.status || "unpaid" : "Inactive"}
          </TableCell>
        );
      case "guardiansPhone":
        return (
          <TableCell>
            <a href={`tel:${item.guardiansPhone}`}>{item.guardiansPhone}</a>
          </TableCell>
        );
      case "studentsPhone":
        return (
          <TableCell>
            <a href={`tel:${item.studentsPhone}`}>{item.studentsPhone}</a>
          </TableCell>
        );

      case "student":
        return (
          <TableCell>
            <User
              as={Link}
              href={`/dashboard/${fromPage.toLowerCase().replace(" ", "-")}/update?id=${item.id}`}
              avatarProps={{
                src: item.image,
              }}
              classNames={{
                base: !item?.isActive && "opacity-50",
              }}
              description={item.email || item.studentID}
              name={item?.isActive ? item.name : `${item.name} (Inactive)`}
            />
          </TableCell>
        );

      default:
        return <TableCell>{cellValue}</TableCell>;
    }
  };

  const handleDownloadData = () => {
    let data: any[] = [];
    const formattedDate = formatter.format(dateSelected!.toDate(getLocalTimeZone()));
    studentsData.forEach((item: any, i: any) => {
      let studentData = {
        si: i + 1,
        entityId: item.id,
        studentId: item.studentId,
        name: item.name,
        email: item.email,
        studentsPhone: item.studentsPhone,
        guardiansPhone: item.guardiansPhone,
        monthlyFee: "",
      };
      if (item.fees.length > 0) {
        studentData.monthlyFee = item?.fees[0]?.status;
      }
      if (item.attendance.length > 0) {
        data.push({
          ...studentData,
          present: item.attendance[0].attendanceData[format(formattedDate, "yyyy-MM-dd")]?.present,
          late: item.attendance[0].attendanceData[format(formattedDate, "yyyy-MM-dd")]?.late,
          absent: item.attendance[0].attendanceData[format(formattedDate, "yyyy-MM-dd")]?.absent,
          examAttended: item.attendance[0].attendanceData[format(formattedDate, "yyyy-MM-dd")]?.examAttended,
          inTime: item.attendance[0].attendanceData[format(formattedDate, "yyyy-MM-dd")]?.inTime,
          outTime: item.attendance[0].attendanceData[format(formattedDate, "yyyy-MM-dd")]?.outTime,
        });
      } else {
        data.push({ ...studentData });
      }
    });

    if (data.length > 0) exportToExcel(data, `students_report-${format(new Date(), "dd-MM-yyyy")}`);
  };

  return (
    <>
      <AlertModal ref={alertRef} />
      <Breadcrumbs>
        <BreadcrumbItem>
          <Link href="/dashboard">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrent>{fromPage}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex items-center justify-between my-5">
        <h1 className="text-xl md:text-3xl lg:text-5xl flex items-center gap-2">All {fromPage}</h1>

        <ButtonGroup>
          <Button
            color="primary"
            radius="sm"
            startContent={<Plus />}
            as={Link}
            href={`/dashboard/${fromPage.toLowerCase().replace(" ", "-")}/create`}
          >
            Add New {fromPage}
          </Button>
          <Button
            isDisabled={studentsData.length === 0}
            color="secondary"
            variant="bordered"
            radius="sm"
            onPress={handleDownloadData}
            startContent={<Download />}
          >
            Download Report
          </Button>
        </ButtonGroup>
      </div>
      <div className="pt-10 flex flex-wrap gap-6 justify-between items-start sm:items-center mb-6">
        <div className="w-[60%] flex md:flex-row flex-col gap-5 md:items-center">
          <Autocomplete
            defaultItems={batches}
            classNames={{
              base: "*:*:border-default-300",
            }}
            selectedKey={selectedBatch as string}
            onSelectionChange={(e) => setSelectedBatch(e)}
            variant="bordered"
            radius="sm"
            label="Choose Batch"
          >
            {(batches) => <AutocompleteItem key={batches.id}>{batches.name}</AutocompleteItem>}
          </Autocomplete>

          <Button
            isLoading={loading}
            color="warning"
            radius="sm"
            className="h-14 !px-14"
            onPress={handleGetStudentsByBatchAndDate}
          >
            Get Students
          </Button>
        </div>
      </div>

      {/* search  */}
      <div className="w-full  flex items-center gap-5 my-5">
        <Input
          classNames={{
            base: "*:*:dark:bg-dark-3",
            inputWrapper: "border-default-300",
          }}
          isClearable
          variant="faded"
          className="w-full lg:max-w-1/2 "
          placeholder="Search by studentID, name, phone, email..."
          radius="sm"
          startContent={<SearchIcon />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          onClear={() => setSearchQuery("")}
        />
      </div>
      <p>
        Showing {studentsData.length} {fromPage}
      </p>

      <Table
        classNames={{
          base: "*:dark:bg-dark-2",
          th: "dark:bg-dark-3",
        }}
        className="my-5 max-h-[600px]"
        isHeaderSticky
        aria-labelledby="table"
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody
          emptyContent={`No data to display. Create new ${fromPage.toLowerCase()} to display`}
          items={studentsData}
        >
          {(item: any) => <TableRow key={item.id}>{(columnKey) => renderCell(item, columnKey)}</TableRow>}
        </TableBody>
      </Table>

      <p>
        Showing {studentsData.length} {fromPage}
      </p>
    </>
  );
};

export default StudentMainView;
