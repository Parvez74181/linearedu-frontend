"use client";

import showToast from "@/lib/toast";
import "mathlive";

import {
  Autocomplete,
  AutocompleteItem,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Form,
  Input,
  Textarea,
} from "@heroui/react";
import Link from "next/link";
import { Key, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpenText, Image, Notebook, Plus, RefreshCw, Text, Trash2, Video } from "lucide-react";
import { AlertModal } from "@/components/alert-modal";
import { addInstances, deleteInstances, updateInstances } from "@/actions";

import { MathfieldElement } from "mathlive";
import { capitalizeFirstLetter } from "@/lib/utils";

type Props = {
  fromPage: string;
  action: "Create" | "Update";
  data?: any;
  classes?: any[];
  subjects?: any[];
  chapters?: any[];
  role?: string;
};

const CreateOrUpdateView = ({ fromPage, action, data, chapters, role }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [actionType, setActionType] = useState<"save" | "save_and_create">("save");
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Key | null>("");
  const [selectedTopic, setSelectedTopic] = useState<Key | null>("");
  const [question, setQuestion] = useState<any>();
  const [questionA, setQuestionA] = useState<any>("");
  const [questionB, setQuestionB] = useState<any>("");
  const [questionC, setQuestionC] = useState<any>("");
  const [questionD, setQuestionD] = useState<any>("");
  const [solution, setSolution] = useState({
    text: "",
    image: "",
    video: "",
  });

  const alertRef = useRef<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    if (!question && !questionA && !questionB && !questionC && !questionD) {
      showToast("Error", "danger", "All questions(A,B,C,D) are required");
      setLoading(false);
      return;
    }
    const bodyData = {
      question,
      topicId: selectedTopic,
      questionA,
      questionB,
      questionC,
      questionD,
      questionType: searchParams.get("type") || "normal",
      solution,
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
      setSelectedChapter("");
      setSelectedTopic("");
      setQuestion("");
      setQuestionA("");
      setQuestionB("");
      setQuestionC("");
      setQuestionD("");

      setSolution({
        text: "",
        image: "",
        video: "",
      });
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
      setSelectedChapter(data?.chapterId?.toString() || "");
      setQuestion(data.question);
      setQuestionA(data.questionA);
      setQuestionB(data.questionB);
      setQuestionC(data.questionC);
      setQuestionD(data.questionD);
      setSolution({
        text: data.solution?.text || "",
        image: data.solution?.image || "",
        video: data.solution?.video || "",
      });
      setSelectedChapter(data?.topic?.chapter?.id?.toString() || "");
      setSelectedTopic(data?.topic?.id?.toString() || "");
    }
  }, [data]);

  useEffect(() => {
    if (selectedChapter) {
      fetch(`${process.env.NEXT_PUBLIC_API_V1}/topic/get-by-chapter?chapterId=${selectedChapter}`, {
        next: { revalidate: 0 },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setTopics(res.data);
          } else {
            showToast("Error", "danger", res.message);
          }
        })
        .catch((err) => {
          console.error(err);
          showToast("Error", "danger", "Failed to fetch topics");
        });
    } else {
      setTopics([]);
    }
  }, [selectedChapter]);

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
        {action} {capitalizeFirstLetter(searchParams.get("type") || "")} {fromPage}
      </h1>

      <Form validationBehavior="native" onSubmit={handleSubmit} className="w-full space-y-5">
        {/* <UploadPhoto image={icon} setImage={setIcon} title={`Upload ${fromPage} question image`} /> */}

        <div className="flex  gap-5  flex-col w-full">
          <div className="w-full flex  flex-col gap-5 my-5">
            <h2 className="font-semibold text-2xl text-start opacity-75">Chapter & Topic Selection</h2>
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
              startContent={<Notebook opacity={0.5} />}
            >
              {(chapters) => (
                <AutocompleteItem
                  key={chapters.id}
                >{`${chapters.subject.class.name} -> ${chapters.subject.name} -> ${chapters.name}`}</AutocompleteItem>
              )}
            </Autocomplete>

            {/* topic */}
            <Autocomplete
              classNames={{
                base: "*:*:*:border-default-300",
              }}
              items={topics}
              label={`Choose topic`}
              labelPlacement="outside"
              radius="sm"
              size="lg"
              isRequired
              variant="bordered"
              selectedKey={selectedTopic as any}
              onSelectionChange={setSelectedTopic}
              isDisabled={!selectedChapter}
              startContent={<BookOpenText opacity={0.5} />}
            >
              {(topic) => <AutocompleteItem key={topic.id}>{topic.name}</AutocompleteItem>}
            </Autocomplete>
          </div>

          <h2 className="font-semibold text-2xl text-start opacity-75">Question Writing</h2>
          {/* question */}
          {searchParams.get("type") === "math" ? (
            <div className="w-full">
              <label className="pb-1">
                {`Enter ${fromPage.toLowerCase()} question`} <span className="text-sm text-red-500 ms-0.5">*</span>
              </label>
              {/* @ts-ignore */}
              <math-field
                style={{ width: "100%", padding: "5px 10px", borderRadius: "0.375rem" }}
                onInput={(e: any) => setQuestion((e.target as MathfieldElement).value)}
              >
                {question}
                {/* @ts-ignore */}
              </math-field>
            </div>
          ) : (
            <Textarea
              classNames={{
                inputWrapper: "border-default-300",
              }}
              label={`Enter ${fromPage.toLowerCase()} question`}
              radius="sm"
              size="lg"
              variant="bordered"
              isRequired
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          )}

          <div className="flex items-center gap-5  flex-col w-full">
            {/* questionA */}
            {searchParams.get("type") === "math" ? (
              <div className="w-full">
                <label className="pb-1">
                  {`Enter ${fromPage.toLowerCase()} question A`} <span className="text-sm text-red-500 ms-0.5">*</span>
                </label>
                {/* @ts-ignore */}
                <math-field
                  style={{ width: "100%", padding: "5px 10px", borderRadius: "0.375rem" }}
                  onInput={(e: any) => setQuestionA((e.target as MathfieldElement).value)}
                >
                  {questionA}
                  {/* @ts-ignore */}
                </math-field>
              </div>
            ) : (
              <Textarea
                classNames={{
                  inputWrapper: "border-default-300",
                  mainWrapper: "w-full",
                }}
                label={`Enter ${fromPage.toLowerCase()} question A`}
                radius="sm"
                size="lg"
                variant="bordered"
                isRequired
                value={questionA || ""}
                minRows={1}
                onChange={(e) => setQuestionA(e.target.value)}
              />
            )}

            {/* questionB */}
            {searchParams.get("type") === "math" ? (
              <div className="w-full">
                <label className="pb-1">
                  {`Enter ${fromPage.toLowerCase()} question B`} <span className="text-sm text-red-500 ms-0.5">*</span>
                </label>
                {/* @ts-ignore */}
                <math-field
                  style={{ width: "100%", padding: "5px 10px", borderRadius: "0.375rem" }}
                  onInput={(e: any) => setQuestionB((e.target as MathfieldElement).value)}
                >
                  {questionB}
                  {/* @ts-ignore */}
                </math-field>
              </div>
            ) : (
              <Textarea
                classNames={{
                  inputWrapper: "border-default-300",
                  mainWrapper: "w-full",
                }}
                label={`Enter ${fromPage.toLowerCase()} question B`}
                radius="sm"
                size="lg"
                variant="bordered"
                isRequired
                value={questionB || ""}
                minRows={1}
                onChange={(e) => setQuestionB(e.target.value)}
              />
            )}
          </div>

          <div className="flex items-center gap-5  flex-col w-full">
            {/* questionC */}
            {searchParams.get("type") === "math" ? (
              <div className="w-full">
                <label className="pb-1">
                  {`Enter ${fromPage.toLowerCase()} question C`} <span className="text-sm text-red-500 ms-0.5">*</span>
                </label>
                {/* @ts-ignore */}
                <math-field
                  style={{ width: "100%", padding: "5px 10px", borderRadius: "0.375rem" }}
                  onInput={(e: any) => setQuestionC((e.target as MathfieldElement).value)}
                >
                  {questionC}
                  {/* @ts-ignore */}
                </math-field>
              </div>
            ) : (
              <Textarea
                classNames={{
                  inputWrapper: "border-default-300",
                  mainWrapper: "w-full",
                }}
                label={`Enter ${fromPage.toLowerCase()} question C`}
                radius="sm"
                size="lg"
                variant="bordered"
                isRequired
                value={questionC || ""}
                minRows={1}
                onChange={(e) => setQuestionC(e.target.value)}
              />
            )}

            {/* questionD */}
            {searchParams.get("type") === "math" ? (
              <div className="w-full ">
                <label className="pb-1">
                  {`Enter ${fromPage.toLowerCase()} question D`} <span className="text-sm text-red-500 ms-0.5">*</span>
                </label>

                {/* @ts-ignore */}
                <math-field
                  style={{ width: "100%", padding: "5px 10px", borderRadius: "0.375rem" }}
                  onInput={(e: any) => setQuestionD((e.target as MathfieldElement).value)}
                >
                  {questionD}
                  {/* @ts-ignore */}
                </math-field>
              </div>
            ) : (
              <Textarea
                classNames={{
                  inputWrapper: "border-default-300",
                  mainWrapper: "w-full",
                }}
                label={`Enter ${fromPage.toLowerCase()} question D`}
                radius="sm"
                size="lg"
                variant="bordered"
                isRequired
                value={questionD || ""}
                minRows={1}
                onChange={(e) => setQuestionD(e.target.value)}
              />
            )}
          </div>

          {/* solutions */}
          <div className="flex gap-5 mt-5 flex-col w-full">
            <h2 className="font-semibold text-2xl text-start opacity-75">Solution Writing</h2>
            <Textarea
              classNames={{
                inputWrapper: "border-default-300",
                mainWrapper: "w-full",
              }}
              label={`Enter ${fromPage.toLowerCase()} solution (text):`}
              radius="sm"
              size="lg"
              variant="bordered"
              value={solution.text}
              onChange={(e) => setSolution({ ...solution, text: e.target.value })}
              startContent={<Text opacity={0.5} />}
            />
            <Input
              classNames={{
                inputWrapper: "border-default-300",
                mainWrapper: "w-full",
              }}
              label={`Enter ${fromPage.toLowerCase()} solution (image link):`}
              radius="sm"
              size="lg"
              labelPlacement="outside"
              variant="bordered"
              value={solution.image}
              onChange={(e) => setSolution({ ...solution, image: e.target.value })}
              startContent={<Image opacity={0.5} />}
            />{" "}
            <Input
              classNames={{
                inputWrapper: "border-default-300",
                mainWrapper: "w-full",
              }}
              label={`Enter ${fromPage.toLowerCase()} solution (video link):`}
              radius="sm"
              size="lg"
              labelPlacement="outside"
              variant="bordered"
              value={solution.video}
              onChange={(e) => setSolution({ ...solution, video: e.target.value })}
              startContent={<Video opacity={0.5} />}
            />
          </div>
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
                href={`/dashboard/${fromPage.toLowerCase()}/create?fromPage=${fromPage.toLowerCase()}`}
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
