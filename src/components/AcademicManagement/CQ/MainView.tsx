"use client";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Edit, Eye, Plus, SearchIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlertModal } from "@/components/alert-modal";
import showToast from "@/lib/toast";

import { format } from "date-fns";
import { deleteInstances } from "@/actions";

type Props = {
  fromPage: string;
  data: any[];
  limit?: number;
  totalPage: number;
  totalRow?: number;
  role?: any;
};

const MainView = ({ fromPage, data, totalPage, totalRow, role }: Props) => {
  const columns = [
    { key: "#", label: "#" },
    { key: "id", label: "ID" },
    { key: "classId", label: "CLASS" },
    { key: "subjectId", label: "SUBJECT" },
    { key: "chapterId", label: "CHAPTER" },
    { key: "topicId", label: "TOPIC" },
    { key: "question", label: "QUESTION" },
    { key: "createdAt", label: "CREATED AT" },
    { key: "updatedAt", label: "UPDATED AT" },
    { key: "actions", label: "ACTIONS" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [mainViewData, setMainViewData] = useState<any[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (data) setMainViewData(data);
  }, [data]);

  const [currentPage, setCurrentPage] = useState(1);
  const alertRef = useRef<any>(null);
  const router = useRouter();

  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (totalPage > 1) {
      const params = new URLSearchParams(searchParams);
      // Update `page` only if it changes (avoid unnecessary updates)
      if (currentPage === 1) {
        params.delete("page"); // Remove `page` if it's 1 (cleaner URL)
      } else {
        params.set("page", String(currentPage));
      }

      // Construct the new URL
      const newUrl = `${pathname}?${params.toString()}`;

      router.push(newUrl);
    }
  }, [currentPage]);

  const handleDataDelete = (id: number) => {
    alertRef.current?.showAlert({
      title: "Confirm Action",
      message: "Are you sure you want to delete this data?",
      onConfirm: async () => {
        const resDelete = await deleteInstances(id, fromPage);

        if (resDelete.success) {
          showToast("Success", "success", resDelete.message);
          router.refresh();
        } else {
          showToast("Error", "danger", resDelete.message);
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
              <Link
                href={`/dashboard/${fromPage.toLowerCase().replaceAll(" ", "-")}/update?id=${item.id}&type=${
                  item.questionType
                }`}
              >
                <Edit strokeWidth={1.5} />
              </Link>
            </Tooltip>

            <Tooltip content={`View ${fromPage}`} color="foreground">
              <Link
                href={`/dashboard/${fromPage.toLowerCase().replaceAll(" ", "-")}/update?id=${item.id}&type=${
                  item.questionType
                }`}
              >
                <Eye strokeWidth={1.5} />
              </Link>
            </Tooltip>

            {role === "admin" && (
              <Tooltip content={`Delete ${fromPage}`} color="danger">
                <Trash2 onClick={() => handleDataDelete(item.id)} className="text-danger-500 cursor-pointer" />
              </Tooltip>
            )}
          </TableCell>
        );
      case "classId":
        return <TableCell>{item?.topic?.chapter?.subject?.class?.name || "-"}</TableCell>;
      case "subjectId":
        return <TableCell>{item?.topic?.chapter?.subject?.name || "-"}</TableCell>;
      case "chapterId":
        return <TableCell>{item?.topic?.chapter?.name || "-"}</TableCell>;
      case "topicId":
        return (
          <TableCell>
            {(item?.topic?.name?.length > 30 ? item?.topic?.name?.substring(0, 30) + "..." : item?.topic?.name) || "-"}
          </TableCell>
        );
      case "question":
        return (
          <TableCell>
            {(item?.question?.length > 30 ? item?.question?.substring(0, 30) + "..." : item?.question) || "-"}
          </TableCell>
        );
      case "#":
        return <TableCell>{data.indexOf(item) + 1}</TableCell>;
      case "createdAt":
        return <TableCell>{item?.createdAt ? format(item.createdAt, "dd MMM, yyyy") : "-"}</TableCell>;
      case "updatedAt":
        return <TableCell>{item?.updatedAt ? format(item.updatedAt, "dd MMM, yyyy") : "-"}</TableCell>;
      default:
        return <TableCell>{cellValue || "-"}</TableCell>;
    }
  };

  const onSearchChange = (value: any) => {
    if (value) {
      setSearchQuery(value);

      const filteredData = data.filter(
        (data: any) =>
          data.question?.toLowerCase().includes(value.toLowerCase().trim()) ||
          data?.topic?.name?.toLowerCase().includes(value.toLowerCase().trim()) ||
          data?.topic?.chapter?.name?.toLowerCase().includes(value.toLowerCase().trim()) ||
          data?.topic?.chapter?.subject?.name?.toLowerCase().includes(value.toLowerCase().trim()) ||
          data?.topic?.chapter?.subject?.class?.name?.toLowerCase().includes(value.toLowerCase().trim())
      );
      setMainViewData(filteredData);
    } else {
      setSearchQuery("");
      setMainViewData(data);
    }
  };

  const onClear = () => {
    setSearchQuery("");
    setMainViewData(data);
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
        <h1 className="text-xl md:text-3xl lg:text-5xl">All {fromPage}</h1>
        <Button
          color="primary"
          radius="sm"
          startContent={<Plus />}
          // as={Link}
          // href={`/dashboard/${fromPage.toLowerCase().replaceAll(" ", "-")}/create`}
          onPress={onOpen}
        >
          Add New {fromPage}
        </Button>
      </div>

      {/* search input */}
      <Input
        classNames={{
          base: "*:*:dark:bg-dark-3",
          inputWrapper: "border-default-300",
        }}
        isClearable
        variant="faded"
        className="w-full lg:max-w-1/2 mb-5"
        placeholder="Search..."
        radius="sm"
        startContent={<SearchIcon />}
        value={searchQuery}
        onValueChange={onSearchChange}
        onClear={() => onClear()}
      />

      <p>
        Showing {mainViewData.length} of {totalRow} {fromPage}
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
          items={mainViewData}
        >
          {(item) => <TableRow key={item.id}>{(columnKey) => renderCell(item, columnKey)}</TableRow>}
        </TableBody>
      </Table>

      <p>
        Showing {mainViewData.length} of {totalRow} {fromPage}
      </p>

      {totalPage > 1 && (
        <Pagination page={currentPage} onChange={setCurrentPage} showControls initialPage={1} total={totalPage} />
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create a new {fromPage}</ModalHeader>
              <ModalBody>
                <p>Choose the type of {fromPage} (Math/Normal) you want to create.</p>
                <Button
                  color="primary"
                  radius="sm"
                  startContent={<Plus />}
                  as={Link}
                  href={`/dashboard/${fromPage.toLowerCase().replaceAll(" ", "-")}/create?type=math`}
                  onPress={onOpen}
                >
                  Add New Math Type {fromPage}
                </Button>
                <Button
                  color="primary"
                  radius="sm"
                  startContent={<Plus />}
                  as={Link}
                  href={`/dashboard/${fromPage.toLowerCase().replaceAll(" ", "-")}/create`}
                  onPress={onOpen}
                >
                  Add New Normal Type {fromPage}
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MainView;
