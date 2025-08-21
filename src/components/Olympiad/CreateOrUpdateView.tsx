"use client";

import showToast from "@/lib/toast";
import {
  Autocomplete,
  AutocompleteItem,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Select,
  Selection,
  SelectItem,
  Textarea,
} from "@heroui/react";
import Link from "next/link";
import { Key, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { AlertModal } from "@/components/alert-modal";
import { addInstances, deleteInstances, updateInstances } from "@/actions";
import UploadPhoto from "@/components/UploadPhoto";
import { DateValue, getLocalTimeZone, now, parseDate, today } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";

type Props = {
  fromPage: string;
  action: "Create" | "Update";
  data?: any;
  role?: string;
};

const olympiadType = [
  { key: "olympiad", value: "Olympiad" },
  { key: "medhaBritti", value: "Medha Britti" },
];
const CreateOrUpdateView = ({ fromPage, action, data, role }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"save" | "save_and_create">("save");
  const [image, setImage] = useState("");
  const [selectedType, setSelectedType] = useState<Key | null>("");
  const [startTime, setStartTime] = useState<DateValue | null>(now(getLocalTimeZone()));
  const [endTime, setEndTime] = useState<DateValue | null>(now(getLocalTimeZone()));

  let formatter = useDateFormatter({ dateStyle: "short", timeStyle: "short" });

  const alertRef = useRef<any>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    let fileUploadResData;
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    formData.append("fromPage", fromPage);
    if (!image) {
      setLoading(false);
      showToast("Error", "danger", "Please choose an image");
      return;
    }

    // image upload
    if (image) {
      formData.append("image", image);

      if (action === "Update") {
        if (image === data?.image) formData.delete("image");
        if (image !== data?.image) formData.append("prevFile", data.image);
      }
      const imageFile = formData.get("image") as any;

      if (imageFile) {
        const fileUploadRes = await fetch("/api/upload-file", {
          method: "POST",
          body: formData,
        });
        fileUploadResData = await fileUploadRes.json();
        if (!fileUploadResData?.success) {
          showToast("Error", "danger", fileUploadResData.message);
          setLoading(false);
          return;
        }
      }
    }

    const bodyData = {
      title,
      description,
      startTime: new Date(startTime!.toDate(getLocalTimeZone())),
      endTime: new Date(endTime!.toDate(getLocalTimeZone())),
      olympiadType: selectedType,
      image: fileUploadResData?.imageUrl,
    };

    if (action == "Create") {
      const resAdd = await addInstances(JSON.stringify(bodyData), fromPage);
      if (resAdd?.success) {
        showToast("Success", "success", resAdd?.message);
        handleFormAction();
      } else {
        showToast("Error", "danger", resAdd!.message);
        console.log(resAdd);
      }
    }
    if (action == "Update") {
      const resUpdate = await updateInstances(JSON.stringify({ id: data?.id, ...bodyData }), fromPage);

      if (resUpdate?.success) {
        showToast("Success", "success", resUpdate.message);
        handleFormAction();
      } else {
        showToast("Error", "danger", resUpdate.message);
        console.log(resUpdate);
      }
    }

    setLoading(false);
  };

  const handleFormAction = () => {
    if (actionType === "save") {
      router.back();
      setTimeout(() => {
        router.refresh();
      }, 300);
    } else if (actionType === "save_and_create") {
      router.push(`/dashboard/${fromPage.toLowerCase().replaceAll(" ", "-")}/create`);

      // reset all states
      setActionType("save");
    }
  };

  const handleDelete = () => {
    alertRef.current?.showAlert({
      title: "Confirm Action",
      message: "Are you sure you want to delete this data?",
      onConfirm: async () => {
        const resDelete = await deleteInstances(data.id, fromPage);

        if (resDelete.success) {
          showToast("Success", "success", resDelete.message);
          router.back();
          setTimeout(() => {
            router.refresh();
          }, 300);
        } else {
          showToast("Error", "danger", resDelete.message);
          console.log(resDelete);
        }
      },
    });
  };

  useEffect(() => {
    if (data) {
      if (data?.image) setImage(data?.image || "");
      setSelectedType(data?.olympiadType);
    }
  }, [data]);

  return (
    <>
      <AlertModal ref={alertRef} />
      <Breadcrumbs>
        <BreadcrumbItem>
          <Link href="/dashboard">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href={`/dashboard/${fromPage.toLowerCase().replaceAll(" ", "-")}`}>{fromPage}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrent>{action}</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="text-xl md:text-3xl lg:text-5xl my-5">
        {action} {fromPage}
      </h1>

      <Form validationBehavior="native" onSubmit={handleSubmit} className="w-full space-y-5">
        <UploadPhoto image={image} setImage={setImage} title={`Upload ${fromPage} Image`} />

        <div className="flex items-center gap-5  flex-col w-full">
          <Input
            classNames={{
              inputWrapper: "border-default-300",
              mainWrapper: "w-full",
            }}
            name="title"
            label={`Enter ${fromPage.toLowerCase()} title`}
            radius="sm"
            size="lg"
            labelPlacement="outside"
            variant="bordered"
            placeholder=" "
            isRequired
            defaultValue={data?.title || ""}
          />

          <div className="flex items-center gap-5 md:flex-row flex-col w-full">
            <DatePicker
              classNames={{
                inputWrapper: "border-default-300",
              }}
              hideTimeZone
              showMonthAndYearPickers
              minValue={today(getLocalTimeZone())}
              defaultValue={now(getLocalTimeZone())}
              label={`Choose ${fromPage.toLowerCase()} start time`}
              labelPlacement="outside"
              variant="bordered"
              radius="sm"
              size="lg"
              isRequired
              value={startTime}
              onChange={setStartTime}
            />
            <DatePicker
              classNames={{
                inputWrapper: "border-default-300",
              }}
              hideTimeZone
              showMonthAndYearPickers
              minValue={today(getLocalTimeZone())}
              label={`Choose ${fromPage.toLowerCase()} end time`}
              defaultValue={now(getLocalTimeZone())}
              labelPlacement="outside"
              variant="bordered"
              radius="sm"
              size="lg"
              isRequired
              value={endTime}
              onChange={setEndTime}
            />
            <Autocomplete
              classNames={{
                base: "*:*:*:border-default-300",
              }}
              items={olympiadType}
              label={`Choose olympiad type`}
              labelPlacement="outside"
              radius="sm"
              size="lg"
              isRequired
              variant="bordered"
              selectedKey={selectedType as any}
              onSelectionChange={setSelectedType}
              defaultSelectedKey={"olympiad"}
            >
              {(type) => <AutocompleteItem key={type.key}>{type.value}</AutocompleteItem>}
            </Autocomplete>
          </div>

          <Textarea
            classNames={{
              inputWrapper: "border-default-300",
              mainWrapper: "w-full",
            }}
            name="description"
            labelPlacement="outside"
            label={`Enter ${fromPage.toLowerCase()} description`}
            radius="sm"
            size="lg"
            variant="bordered"
            isRequired
            defaultValue={data?.description || ""}
          />
        </div>

        <div className="flex lg:flex-row flex-col lg:items-center gap-5">
          <Button
            isLoading={loading}
            type="submit"
            radius="sm"
            color="success"
            startContent={action == "Create" ? <Plus /> : <RefreshCw />}
          >
            {action} {fromPage}
          </Button>

          <Button
            isLoading={loading}
            type="submit"
            radius="sm"
            color="success"
            startContent={action == "Create" ? <Plus /> : <RefreshCw />}
            onPress={() => setActionType("save_and_create")}
          >
            Save and Create a New {fromPage}
          </Button>

          {action == "Update" && (
            <>
              <Button
                as={Link}
                href={`/dashboard/${fromPage.toLowerCase()}/create`}
                isLoading={loading}
                type="submit"
                radius="sm"
                color="warning"
                startContent={<Plus />}
              >
                Create a New {fromPage}
              </Button>

              {role === "admin" && (
                <Button isLoading={loading} onPress={handleDelete} radius="sm" color="danger" startContent={<Trash2 />}>
                  Delete {fromPage}
                </Button>
              )}
            </>
          )}
        </div>
      </Form>
    </>
  );
};

export default CreateOrUpdateView;
