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
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { AlertModal } from "@/components/alert-modal";
import { addAcademicStructure, deleteAcademicStructure, updatedAcademicStructure } from "@/actions";
import UploadPhoto from "@/components/UploadPhoto";
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

const correctAnswerOptions = [
  { key: 1, value: "option1" },
  { key: 2, value: "option2" },
  { key: 3, value: "option3" },
  { key: 4, value: "option4" },
];
const CreateOrUpdateView = ({ fromPage, action, data, chapters, role }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [actionType, setActionType] = useState<"save" | "save_and_create">("save");
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Key | null>("");
  const [selectedTopic, setSelectedTopic] = useState<Key | null>("");
  const [question, setQuestion] = useState<any>();
  const [option1, setOption1] = useState<any>();
  const [option2, setOption2] = useState<any>();
  const [option3, setOption3] = useState<any>();
  const [option4, setOption4] = useState<any>();
  const [selectedCorrectAnswer, setSelectedCorrectAnswer] = useState<Key | null>("");
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

    if (!option1 && !option2 && !option3 && !option4) {
      showToast("Error", "danger", "All options are required");
      setLoading(false);
      return;
    }
    const bodyData = {
      question,
      topicId: selectedTopic,
      option1,
      option2,
      option3,
      option4,
      correctAns: selectedCorrectAnswer,
      questionType: searchParams.get("type") || "normal",
      solution,
    };

    if (action == "Create") {
      const resAdd = await addAcademicStructure(JSON.stringify(bodyData), fromPage);
      if (resAdd?.success) {
        showToast("Success", "success", resAdd?.message);
        handleFormAction();
      } else {
        showToast("Error", "danger", resAdd!.message);
        console.log(resAdd);
      }
    }
    if (action == "Update") {
      const resUpdate = await updatedAcademicStructure(JSON.stringify({ id: data?.id, ...bodyData }), fromPage);

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
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
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
        const resDelete = await deleteAcademicStructure(data.id, fromPage);

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
      setSelectedCorrectAnswer(data.correctAns?.toString());
      setSelectedChapter(data?.chapterId?.toString() || "");
      setQuestion(data.question);
      setOption1(data.option1);
      setOption2(data.option2);
      setOption3(data.option3);
      setOption4(data.option4);
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
          <div className="w-full flex flex-col my-5">
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
            >
              {(topic) => <AutocompleteItem key={topic.id}>{topic.name}</AutocompleteItem>}
            </Autocomplete>
          </div>

          <h2 className="font-semibold text-2xl text-start opacity-75">Question Writing</h2>
          {/* question */}
          {searchParams.get("type") === "math" ? (
            <div className="w-full">
              <label className="pb-1">{`Enter ${fromPage.toLowerCase()} question`}</label>
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

          <div className="flex items-center gap-5 md:flex-row flex-col w-full">
            {/* option1 */}
            {searchParams.get("type") === "math" ? (
              <div className="w-full">
                <label className="pb-1">{`Enter ${fromPage.toLowerCase()} option1`}</label>
                {/* @ts-ignore */}
                <math-field
                  style={{ width: "100%", padding: "5px 10px", borderRadius: "0.375rem" }}
                  onInput={(e: any) => setOption1((e.target as MathfieldElement).value)}
                >
                  {option1}
                  {/* @ts-ignore */}
                </math-field>
              </div>
            ) : (
              <Input
                classNames={{
                  inputWrapper: "border-default-300",
                  mainWrapper: "w-full",
                }}
                label={`Enter ${fromPage.toLowerCase()} option1`}
                radius="sm"
                size="lg"
                labelPlacement="outside"
                variant="bordered"
                isRequired
                value={option1 || ""}
                onChange={(e) => setOption1(e.target.value)}
              />
            )}

            {/* option2 */}
            {searchParams.get("type") === "math" ? (
              <div className="w-full">
                <label className="pb-1">{`Enter ${fromPage.toLowerCase()} option2`}</label>
                {/* @ts-ignore */}
                <math-field
                  style={{ width: "100%", padding: "5px 10px", borderRadius: "0.375rem" }}
                  onInput={(e: any) => setOption2((e.target as MathfieldElement).value)}
                >
                  {option2}
                  {/* @ts-ignore */}
                </math-field>
              </div>
            ) : (
              <Input
                classNames={{
                  inputWrapper: "border-default-300",
                  mainWrapper: "w-full",
                }}
                label={`Enter ${fromPage.toLowerCase()} option2`}
                radius="sm"
                size="lg"
                labelPlacement="outside"
                variant="bordered"
                isRequired
                value={option2 || ""}
                onChange={(e) => setOption2(e.target.value)}
              />
            )}
          </div>

          <div className="flex items-center gap-5 md:flex-row flex-col w-full">
            {/* option3 */}
            {searchParams.get("type") === "math" ? (
              <div className="w-full">
                <label className="pb-1">{`Enter ${fromPage.toLowerCase()} option3`}</label>
                {/* @ts-ignore */}
                <math-field
                  style={{ width: "100%", padding: "5px 10px", borderRadius: "0.375rem" }}
                  onInput={(e: any) => setOption3((e.target as MathfieldElement).value)}
                >
                  {option3}
                  {/* @ts-ignore */}
                </math-field>
              </div>
            ) : (
              <Input
                classNames={{
                  inputWrapper: "border-default-300",
                  mainWrapper: "w-full",
                }}
                label={`Enter ${fromPage.toLowerCase()} option3`}
                radius="sm"
                size="lg"
                labelPlacement="outside"
                variant="bordered"
                isRequired
                value={option3 || ""}
                onChange={(e) => setOption3(e.target.value)}
              />
            )}

            {/* option4 */}
            {searchParams.get("type") === "math" ? (
              <div className="w-full ">
                <label className="pb-1">{`Enter ${fromPage.toLowerCase()} option4`}</label>

                {/* @ts-ignore */}
                <math-field
                  style={{ width: "100%", padding: "5px 10px", borderRadius: "0.375rem" }}
                  onInput={(e: any) => setOption4((e.target as MathfieldElement).value)}
                >
                  {option4}
                  {/* @ts-ignore */}
                </math-field>
              </div>
            ) : (
              <Input
                classNames={{
                  inputWrapper: "border-default-300",
                  mainWrapper: "w-full",
                }}
                label={`Enter ${fromPage.toLowerCase()} option4`}
                radius="sm"
                size="lg"
                labelPlacement="outside"
                variant="bordered"
                isRequired
                value={option4 || ""}
                onChange={(e) => setOption4(e.target.value)}
              />
            )}
          </div>

          {/* correct answer */}
          <Autocomplete
            classNames={{
              base: "*:*:*:border-default-300",
            }}
            items={correctAnswerOptions}
            label={`Choose correct answer for ${fromPage.toLowerCase()}`}
            labelPlacement="outside"
            radius="sm"
            size="lg"
            isRequired
            variant="bordered"
            selectedKey={selectedCorrectAnswer as any}
            onSelectionChange={setSelectedCorrectAnswer}
          >
            {(correctAnswerOptions) => (
              <AutocompleteItem key={correctAnswerOptions.key}>{correctAnswerOptions.value}</AutocompleteItem>
            )}
          </Autocomplete>

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
