"use client";
import showToast from "@/lib/toast";

import {
  Autocomplete,
  AutocompleteItem,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Checkbox,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import Link from "next/link";
import { Key, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import { deleteUserManagement } from "@/actions";
import { CirclePlus, Eye, EyeClosed, File, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Class, Group } from "@/types";
import { AlertModal } from "../alert-modal";
import UploadPhoto from "../UploadPhoto";
import UploadFile from "../UploadFile";
import StaffsAccessCheckbox from "../StaffsAccessCheckbox";

type Props = {
  fromPage: string;
  action: "Create" | "Update";
  data?: any;
  classes?: Class[];
  groups?: Group[];
  payload?: any;
};
const CreateOrUpdateView = ({ fromPage, action, data, classes, groups, payload }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [updatedPassword, setUpdatedPassword] = useState("");
  const [actionType, setActionType] = useState<"save" | "save_and_create">("save");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isActive, setIsActive] = useState("false");
  const [cv, setCv] = useState<any>();
  const [nid, setNid] = useState<any>();
  const [universityCard, setUniversityCard] = useState<any>();
  const [pairs, setPairs] = useState<any[]>([{ id: crypto.randomUUID(), subject: "", amount: "" }]);
  const [accesses, setAccesses] = useState<any>();
  const [isStackHolder, setIsStackHolder] = useState<boolean>(false);

  const alertRef = useRef<any>(null);
  const router = useRouter();

  // Add new subject/mark pair
  const addNewPair = () => {
    setPairs([...pairs, { id: crypto.randomUUID(), subject: "", amount: "" }]);
  };

  // Update specific pair
  const updatePair = (id: string, field: keyof any, value: string) => {
    setPairs(pairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair)));
  };

  // Remove specific pair
  const removePair = (id: string) => {
    if (pairs.length > 1) {
      setPairs(pairs.filter((pair) => pair.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append("role", fromPage.toLowerCase().slice(0, fromPage.length - 1));

    if (avatar) formData.append("image", avatar);
    if (cv !== data?.cv) formData.append("cv", cv);
    if (nid !== data?.nid) formData.append("nid", nid);
    if (universityCard !== data?.universityCard) formData.append("universityCard", universityCard);
    formData.append("staffsAccess", JSON.stringify(accesses));
    formData.append("isStackHolder", `${isStackHolder}`);

    if (isActive) {
      formData.append("isActive", isActive);
    }

    if (fromPage === "Teachers") {
      const teachersMetadata = pairs.map((pair) => ({
        subject: pair.subject,
        amount: pair.amount,
      }));
      formData.append("teachersMetadata", JSON.stringify(teachersMetadata));
    }

    if (action == "Create") {
      try {
        const res = await fetch("/api/create-user", {
          method: "POST",
          body: formData,
        });
        const resData = await res.json();

        if (resData?.success) {
          showToast("Success", "success", `${fromPage} successfully created`);
          handleFormAction();
        } else {
          showToast(resData!.message, "danger");
          console.log(resData);
          setLoading(false);
        }
      } catch (error) {
        showToast("Something went wrong", "danger");
        console.log(error);
        setLoading(false);
      }
    }
    if (action == "Update") {
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;

      if (data.email.trim() === email.trim()) formData.delete("email");
      if (data.phone.trim() === phone.trim()) formData.delete("phone");
      if (avatar === data.image) formData.delete("image");
      if (avatar !== data.image) formData.append("prevFile", data.image);

      if (updatedPassword) formData.append("password", updatedPassword);

      formData.append("id", data.id);

      try {
        const res = await fetch("/api/update-user", {
          method: "POST",
          body: formData,
        });
        const resData = await res.json();

        if (resData?.success) {
          showToast("Success", "success", `${fromPage} successfully updated`);
          handleFormAction();
        } else {
          showToast(resData!.message, "danger");
          console.log(resData);
          setLoading(false);
        }
      } catch (error) {
        showToast("Something went wrong", "danger");
        console.log(error);
        setLoading(false);
      }
    }

    setLoading(false);
  };

  const handleFormAction = () => {
    if (actionType === "save") router.push(`/dashboard/${fromPage.toLowerCase().replace(" ", "-")}`);
    else if (actionType === "save_and_create") {
      router.push(`/dashboard/${fromPage.toLowerCase().replace(" ", "-")}/create`);

      // reset all states
      setActionType("save");
    }
  };

  const handleDelete = () => {
    alertRef.current?.showAlert({
      title: "Confirm Action",
      message: "Are you sure you want to delete this data?",
      onConfirm: async () => {
        const resDelete = await deleteUserManagement(+data!.id);

        if (resDelete.success) {
          showToast(resDelete.message, "success");
          router.replace(`/dashboard/${fromPage.toLowerCase().replace(" ", "-")}/create`);
          router.push(`/dashboard/${fromPage.toLowerCase().replace(" ", "-")}`);
        } else {
          showToast(resDelete.message, "danger");
          console.log(resDelete);
        }
      },
    });
  };

  useEffect(() => {
    if (data) {
      setAvatar(data.image);
      setCv(data.cv);
      setNid(data.nid);
      setUniversityCard(data.universityCard);
      setAccesses(data.staffsAccess);
      setIsStackHolder(data.isStackHolder);

      setIsActive(data.isActive ? "true" : "false");
      if (fromPage === "Teachers") {
        setPairs([]);
        data.teachersMetadata?.forEach((item: any) => {
          setPairs((prevPairs) => [
            ...prevPairs,
            { id: crypto.randomUUID(), subject: item.subject, amount: item.amount },
          ]);
        });
      }
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
          <Link href={`/dashboard/${fromPage.toLowerCase()}`}>{fromPage}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrent>{action}</BreadcrumbItem>
      </Breadcrumbs>

      <h1 className="text-xl md:text-3xl lg:text-5xl my-5">
        {action} {fromPage}
      </h1>

      <Form validationBehavior="native" onSubmit={handleSubmit} className="w-full space-y-5">
        <UploadPhoto avatar={avatar} setAvatar={setAvatar} />
        <div className="flex items-center md:flex-row flex-col gap-5 w-full">
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
            isRequired
            variant="bordered"
            defaultValue={data?.name}
          />

          {/* email */}
          <Input
            classNames={{
              inputWrapper: "border-default-300",
              mainWrapper: "w-full",
            }}
            name="email"
            label={`Enter ${fromPage.toLowerCase()} email`}
            radius="sm"
            size="lg"
            variant="bordered"
            defaultValue={data?.email}
          />

          {/* stakeHolderTitle */}

          {payload?.role === "admin" && (
            <>
              <Input
                classNames={{
                  inputWrapper: "border-default-300",
                  mainWrapper: "w-full",
                }}
                name="stackHolderTitle" // this name should be as it is
                label={`Enter stake holder title`}
                radius="sm"
                size="lg"
                variant="bordered"
                isDisabled={!isStackHolder}
                defaultValue={data?.stackHolderTitle}
              />

              <Checkbox isSelected={isStackHolder} onValueChange={setIsStackHolder} className="w-full md:w-xl">
                Is Stake Holder
              </Checkbox>
            </>
          )}
        </div>

        <div className="flex items-center md:flex-row flex-col gap-5 w-full">
          {/* phone */}
          <Input
            classNames={{
              inputWrapper: "border-default-300",
              mainWrapper: "w-full",
            }}
            name="phone"
            type="tel"
            label={`Enter ${fromPage.toLowerCase()} phone`}
            radius="sm"
            size="lg"
            isRequired
            variant="bordered"
            className="md:w-1/2 w-full"
            defaultValue={data?.phone}
          />

          <Input
            classNames={{
              inputWrapper: "border-default-300",
              mainWrapper: "w-full",
            }}
            name="userId"
            label={`Enter userId`}
            radius="sm"
            size="lg"
            isRequired
            labelPlacement="inside"
            variant="bordered"
            defaultValue={data?.userId}
          />

          {/* password */}

          {action == "Create" ? (
            <Input
              classNames={{
                inputWrapper: "border-default-300",
                mainWrapper: "w-full",
              }}
              name="password"
              label={`Enter ${fromPage.toLowerCase()} password`}
              radius="sm"
              size="lg"
              isRequired
              endContent={
                showPassword ? (
                  <EyeClosed onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" />
                ) : (
                  <Eye onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" />
                )
              }
              variant="bordered"
              className="md:w-1/2 w-full"
              defaultValue={data?.password}
            />
          ) : (
            <Button onPress={onOpen} className="md:w-1/2 w-full h-16" radius="sm" variant="solid">
              Change Password
            </Button>
          )}
        </div>

        {/* salary */}
        {fromPage === "Staffs" && (
          <div className="flex items-center md:flex-row flex-col gap-5 w-full">
            <Input
              classNames={{
                inputWrapper: "border-default-300",
                mainWrapper: "w-full",
              }}
              name="salary"
              label={`Enter salary`}
              radius="sm"
              size="lg"
              isRequired
              labelPlacement="inside"
              variant="bordered"
              type="number"
              defaultValue={data?.salary}
            />

            {payload?.role === "admin" && (
              <Autocomplete
                classNames={{
                  base: "*:*:border-default-300",
                }}
                variant="bordered"
                radius="sm"
                label="Choose Status"
                selectedKey={isActive}
                onSelectionChange={(e) => setIsActive(e as any)}
                defaultSelectedKey={data?.isActive ? "true" : "false"}
              >
                <AutocompleteItem key={"true"}>Mark as active</AutocompleteItem>
                <AutocompleteItem key={"false"}>Mark as inactive</AutocompleteItem>
              </Autocomplete>
            )}
          </div>
        )}

        <div className="flex items-center md:flex-row flex-col gap-5 w-full">
          {/* presentAddress */}
          <Textarea
            classNames={{
              inputWrapper: "border-default-300",
              mainWrapper: "w-full",
            }}
            name="presentAddress"
            label={`Enter ${fromPage.toLowerCase()} present address`}
            radius="sm"
            size="lg"
            variant="bordered"
            defaultValue={data?.presentAddress}
          />

          {/* permanentAddress */}
          <Textarea
            classNames={{
              inputWrapper: "border-default-300",
              mainWrapper: "w-full",
            }}
            name="permanentAddress"
            label={`Enter ${fromPage.toLowerCase()} permanent address`}
            radius="sm"
            size="lg"
            variant="bordered"
            defaultValue={data?.permanentAddress}
          />
        </div>

        <div className="flex gap-5 items-center md:flex-row flex-col">
          <UploadFile action={action} title={"Upload CV"} file={cv} setFile={setCv} />
          <UploadFile action={action} title={"Upload NID"} file={nid} setFile={setNid} />
          <UploadFile
            action={action}
            title={"Upload University Card"}
            file={universityCard}
            setFile={setUniversityCard}
          />
        </div>

        {fromPage === "Staffs" && payload.role === "admin" && (
          <StaffsAccessCheckbox accesses={accesses} setAccesses={setAccesses}></StaffsAccessCheckbox>
        )}

        {/* Render all subject/amount pairs for Teachers */}
        {fromPage === "Teachers" && (
          <>
            {pairs.map((pair, index) => (
              <div key={pair.id} className="w-full flex items-center lg:flex-row flex-col gap-5">
                <Input
                  classNames={{ base: "*:border-default-300 " }}
                  className="w-full"
                  value={pair.subject}
                  onValueChange={(value) => updatePair(pair.id, "subject", value)}
                  variant="bordered"
                  radius="sm"
                  label={`Subject ${index + 1}`}
                />
                <Input
                  classNames={{ base: "*:border-default-300" }}
                  className="w-full"
                  value={pair.amount}
                  onValueChange={(value) => updatePair(pair.id, "amount", value)}
                  variant="bordered"
                  radius="sm"
                  type="number"
                  label={`Amount ${index + 1}`}
                />

                {/* Show remove button for all but first pair */}
                {index > 0 && (
                  <Button radius="sm" className="w-1/3 h-14" onPress={() => removePair(pair.id)} color="danger">
                    Remove {index + 1}
                  </Button>
                )}
              </div>
            ))}

            {/* Add Another button */}
            <Button radius="sm" className="w-1/3 h-14" onPress={addNewPair} startContent={<CirclePlus />}>
              Add Another Field
            </Button>
          </>
        )}

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
                href={`/dashboard/${fromPage.toLowerCase().replace(" ", "-")}/create`}
                isLoading={loading}
                type="submit"
                radius="sm"
                color="warning"
                startContent={<Plus />}
              >
                Create a New {fromPage}
              </Button>

              {payload?.role === "admin" && (
                <Button isLoading={loading} onPress={handleDelete} radius="sm" color="danger" startContent={<Trash2 />}>
                  Delete {fromPage}
                </Button>
              )}
            </>
          )}
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Change Password</ModalHeader>
                <ModalBody>
                  <Input
                    classNames={{
                      inputWrapper: "border-default-300",
                      mainWrapper: "w-full",
                    }}
                    name="password"
                    label={`Enter ${fromPage.toLowerCase()} password`}
                    radius="sm"
                    size="lg"
                    isRequired
                    endContent={
                      showPassword ? (
                        <EyeClosed onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" />
                      ) : (
                        <Eye onClick={() => setShowPassword(!showPassword)} className="cursor-pointer" />
                      )
                    }
                    variant="bordered"
                    className="w-full"
                    type={showPassword ? "text" : "password"}
                    value={updatedPassword}
                    onChange={(e) => setUpdatedPassword(e.target.value)}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button radius="sm" color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button radius="sm" color="primary" onPress={onClose}>
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </Form>
    </>
  );
};

export default CreateOrUpdateView;
