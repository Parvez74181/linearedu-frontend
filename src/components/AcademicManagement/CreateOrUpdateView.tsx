"use client";

import showToast from "@/lib/toast";
import {
  Autocomplete,
  AutocompleteItem,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Form,
  Input,
  Select,
  Selection,
  SelectItem,
} from "@heroui/react";
import Link from "next/link";
import { Key, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { AlertModal } from "@/components/alert-modal";
import { addInstances, deleteInstances, updateInstances } from "@/actions";
import UploadPhoto from "@/components/UploadPhoto";

type Props = {
  fromPage: string;
  action: "Create" | "Update";
  data?: any;
  classes?: any[];
  programs?: any[];
  subjects?: any[];
  chapters?: any[];
  role?: string;
};
const CreateOrUpdateView = ({
  fromPage,
  action,
  data,
  classes,
  programs,
  subjects,
  chapters,
  role,
}: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [actionType, setActionType] = useState<"save" | "save_and_create">(
    "save"
  );
  const [selectedClass, setSelectedClass] = useState<Key | null>("");
  const [selectedSubject, setSelectedSubject] = useState<Key | null>("");
  const [selectedChapter, setSelectedChapter] = useState<Key | null>("");
  const [selectedPrograms, setSelectedPrograms] = useState<Selection>(
    new Set([])
  );

  const [icon, setIcon] = useState("");

  const alertRef = useRef<any>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    let fileUploadResData;
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;

    formData.append("fromPage", fromPage);

    // icon upload
    if (icon) {
      formData.append("image", icon);

      if (action === "Update") {
        if (icon === data?.icon) formData.delete("image");
        if (icon !== data?.icon) formData.append("prevFile", data.icon);
      }
      const image = formData.get("image") as any;

      if (image) {
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
      name,
      classId: selectedClass,
      subjectId: selectedSubject,
      chapterId: selectedChapter,
      programs: Array.from(selectedPrograms).map((course) => course.toString()),
      icon: fileUploadResData?.imageUrl,
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
      const resUpdate = await updateInstances(
        JSON.stringify({ id: data?.id || data?.subject?.id, ...bodyData }),
        fromPage
      );

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
      router.push(
        `/dashboard/${fromPage.toLowerCase().replaceAll(" ", "-")}/create`
      );

      // reset all states
      setActionType("save");
      setSelectedClass("");
      setSelectedSubject("");
      setSelectedChapter("");
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
      if (data?.icon) setIcon(data?.icon || "");

      setSelectedClass(
        data?.classId?.toString() || data?.subject?.classId?.toString() || ""
      );
      setSelectedSubject(data?.subjectId?.toString() || "");
      setSelectedChapter(data?.chapterId?.toString() || "");
      setSelectedPrograms(
        new Set(data?.programs?.map((course: any) => course?.toString()) || [])
      );
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
          <Link
            href={`/dashboard/${fromPage.toLowerCase().replaceAll(" ", "-")}`}
          >
            {fromPage}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrent>{action}</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="text-xl md:text-3xl lg:text-5xl my-5">
        {action} {fromPage}
      </h1>

      <Form
        validationBehavior="native"
        onSubmit={handleSubmit}
        className="w-full space-y-5"
      >
        {!["Topic", "Chapter"].includes(fromPage) && (
          <UploadPhoto
            image={icon}
            setImage={setIcon}
            title={`Upload ${fromPage} Icon`}
          />
        )}

        <div className="flex items-center gap-5  flex-col w-full">
          {/* name */}
          <Input
            classNames={{
              inputWrapper: "border-default-300",
              mainWrapper: "w-full",
            }}
            name="name"
            label={`Enter ${fromPage.toLowerCase()} name`}
            radius="sm"
            size="lg"
            required
            labelPlacement="outside"
            variant="bordered"
            isRequired
            defaultValue={data?.name || data?.subject?.name || ""}
          />

          {fromPage === "Subject" && (
            <div className="flex flex-col lg:flex-row gap-5 w-full">
              {/* Class */}
              <Autocomplete
                classNames={{
                  base: "*:*:*:border-default-300",
                }}
                items={classes}
                label={`Choose class`}
                labelPlacement="outside"
                radius="sm"
                size="lg"
                isRequired
                variant="bordered"
                selectedKey={selectedClass as any}
                onSelectionChange={setSelectedClass}
              >
                {(classes) => (
                  <AutocompleteItem key={classes.id}>
                    {classes.name}
                  </AutocompleteItem>
                )}
              </Autocomplete>

              <Select
                classNames={{
                  base: "*:*:*:border-default-300",
                }}
                className="w-full"
                label="Choose programs"
                variant="bordered"
                labelPlacement="outside"
                radius="sm"
                size="lg"
                selectedKeys={selectedPrograms}
                onSelectionChange={setSelectedPrograms}
                selectionMode="multiple"
              >
                {programs!.map((course) => (
                  <SelectItem key={course.id}>{course.name}</SelectItem>
                ))}
              </Select>
            </div>
          )}

          {fromPage === "Chapter" && (
            <>
              {/* subject */}
              <Autocomplete
                classNames={{
                  base: "*:*:*:border-default-300",
                }}
                items={subjects}
                label={`Choose subject`}
                labelPlacement="outside"
                radius="sm"
                size="lg"
                isRequired
                variant="bordered"
                selectedKey={selectedSubject as any}
                onSelectionChange={setSelectedSubject}
              >
                {(subjects) => (
                  <AutocompleteItem
                    key={subjects.id}
                  >{`${subjects.class.name} -> ${subjects.name}`}</AutocompleteItem>
                )}
              </Autocomplete>
            </>
          )}

          {fromPage === "Topic" && (
            <>
              {/* chapters */}
              <Autocomplete
                classNames={{
                  base: "*:*:*:border-default-300",
                }}
                items={chapters}
                label={`Choose chapter`}
                labelPlacement="outside"
                radius="sm"
                size="lg"
                isRequired
                variant="bordered"
                selectedKey={selectedChapter as any}
                onSelectionChange={setSelectedChapter}
              >
                {(chapters) => (
                  <AutocompleteItem
                    key={chapters.id}
                  >{`${chapters.subject.class.name} -> ${chapters.subject.name} -> ${chapters.name}`}</AutocompleteItem>
                )}
              </Autocomplete>
            </>
          )}
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

          {/* <Button
            isLoading={loading}
            type="submit"
            radius="sm"
            color="success"
            startContent={action == "Create" ? <Plus /> : <RefreshCw />}
            onPress={() => setActionType("save_and_create")}
          >
            Save and Create a New {fromPage}
          </Button> */}

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
                <Button
                  isLoading={loading}
                  onPress={handleDelete}
                  radius="sm"
                  color="danger"
                  startContent={<Trash2 />}
                >
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
