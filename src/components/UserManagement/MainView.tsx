"use client";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Input,
  Pagination,
  Tooltip,
  User,
} from "@heroui/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import {
  CircleCheck,
  CircleX,
  Edit,
  Eye,
  Plus,
  SearchIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AlertModal } from "@/components/alert-modal";
import showToast from "@/lib/toast";

import { format } from "date-fns";
import { deleteInstances } from "@/actions";

type Data = {
  id: number;
  classId?: number;
  groupId?: number;
  class?: any;
  group?: any;
  name: string;
  shortForm?: string;
  startTime?: string;
  endTime?: string;
};
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
    {
      key: "#",
      label: "#",
    },

    {
      key: "users",
      label: "USER",
    },

    {
      key: "is_active",
      label: "IS ACTIVE",
    },
    // {
    //   key: "is_stack_holder",
    //   label: "IS STACK HOLDER",
    // },
    // {
    //   key: "stack_holder_title",
    //   label: "STACK HOLDER TITLE",
    // },
    {
      key: "phoneNumber",
      label: "PHONE",
    },
    {
      key: "joiningDate",
      label: "JOINING DATE",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [mainViewData, setMainViewData] = useState<Data[]>([]);

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
                href={`/dashboard/${fromPage
                  .toLowerCase()
                  .replace(" ", "-")}/update?id=${item.id}`}
              >
                <Edit strokeWidth={1.5} />
              </Link>
            </Tooltip>

            <Tooltip content={`View ${fromPage}`} color="foreground">
              <Link
                href={`/dashboard/${fromPage
                  .toLowerCase()
                  .replace(" ", "-")}/update?id=${item.id}`}
              >
                <Eye strokeWidth={1.5} />
              </Link>
            </Tooltip>

            {role === "admin" && (
              <Tooltip
                content={`Delete ${fromPage.toLowerCase().replace(" ", "-")}`}
                color="danger"
              >
                <Trash2
                  onClick={() => handleDataDelete(item?.id!)}
                  className="text-danger-500 cursor-pointer"
                />
              </Tooltip>
            )}
          </TableCell>
        );
      case "#":
        return <TableCell>{data.indexOf(item) + 1}</TableCell>;
      case "is_active":
        return (
          <TableCell>
            {item.isActive ? (
              <CircleCheck size={20} color="green" />
            ) : (
              <CircleX size={20} color="red" />
            )}
          </TableCell>
        );
      case "is_stack_holder":
        return (
          <TableCell>
            {item.isStackHolder ? (
              <CircleCheck size={20} color="green" />
            ) : (
              <CircleX size={20} color="red" />
            )}
          </TableCell>
        );
      case "stack_holder_title":
        return <TableCell>{item.stackHolderTitle || "-"}</TableCell>;
      case "joiningDate":
        return <TableCell>{format(item.joiningDate, "PP")}</TableCell>;

      case "users":
        return (
          <TableCell>
            <User
              as={Link}
              href={`/dashboard/${fromPage
                .toLowerCase()
                .replace(" ", "-")}/update?id=${item.id}`}
              avatarProps={{
                src: item.image,
              }}
              description={item.phoneNumber || item.email}
              name={item.name}
            />
          </TableCell>
        );

      default:
        return <TableCell>{cellValue}</TableCell>;
    }
  };

  const onSearchChange = (value: any) => {
    if (value) {
      setSearchQuery(value);

      const filteredData = data.filter(
        (data: any) =>
          data.name?.toLowerCase().includes(value.toLowerCase().trim()) ||
          data?.chapter?.name
            ?.toLowerCase()
            .includes(value.toLowerCase().trim()) ||
          data?.chapter?.subject?.name
            ?.toLowerCase()
            .includes(value.toLowerCase().trim()) ||
          data?.subject?.name
            ?.toLowerCase()
            .includes(value.toLowerCase().trim()) ||
          data?.chapter?.subject?.class?.name
            ?.toLowerCase()
            .includes(value.toLowerCase().trim()) ||
          data?.subject?.class?.name
            ?.toLowerCase()
            .includes(value.toLowerCase().trim()) ||
          data.class?.name.toLowerCase().includes(value.toLowerCase().trim())
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
          as={Link}
          href={`/dashboard/${fromPage
            .toLowerCase()
            .replaceAll(" ", "-")}/create`}
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
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={`No data to display. Create new ${fromPage.toLowerCase()} to display`}
          items={mainViewData}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => renderCell(item, columnKey)}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <p>
        Showing {mainViewData.length} of {totalRow} {fromPage}
      </p>

      {totalPage > 1 && (
        <Pagination
          page={currentPage}
          onChange={setCurrentPage}
          showControls
          initialPage={1}
          total={totalPage}
        />
      )}
    </>
  );
};

export default MainView;
