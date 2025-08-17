import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const formData = await req.formData();
  const data: any = Object.fromEntries(formData.entries());
  const prevFile = data.prevFile as string;

  try {
    if (data?.image) {
      const fileName = `${data?.name?.replaceAll(" ", "-") || ""}-${nanoid()}.webp`;
      const uploadFileUrl = new URL(
        `/${process.env.BUNNYCDN_STORAGE_ZONE}/LINEAREDU/${data?.fromPage || ""}-img/${fileName}`,
        `https://${process.env.BUNNY_STORAGE_API_HOST}`
      );

      if (prevFile) {
        const deleteFileUrl = new URL(
          `/${process.env.BUNNYCDN_STORAGE_ZONE}/LINEAREDU/${data?.fromPage || ""}-img/${prevFile.split("/")[5]}`,
          `https://${process.env.BUNNY_STORAGE_API_HOST}`
        );

        const fileDeleteRes = await fetch(deleteFileUrl, {
          method: "DELETE",
          headers: {
            AccessKey: process.env.BUNNYCDN_API_KEY,
          },
        });
        if (!fileDeleteRes.ok) {
          console.log(`file delete error in ${data?.fromPage} update: `, fileDeleteRes);
        }
      }

      const imageUploadRes = await fetch(uploadFileUrl, {
        method: "PUT",
        headers: {
          AccessKey: process.env.BUNNYCDN_API_KEY!,
          "Content-Type": "image/webp",
        },
        body: data?.image,
      });

      if (!imageUploadRes.ok) {
        return Response.json(
          {
            message: "Failed to upload image",
            success: false,
            error: imageUploadRes.statusText,
          },
          { status: imageUploadRes.status }
        );
      }

      const imageUrl = `https://${process.env.BUNNY_PULL_ZONE_URL}/LINEAREDU/${data?.fromPage || ""}-img/${fileName}`;

      return Response.json({ message: `Image uploaded success`, imageUrl, success: true }, { status: 201 });
    } else {
      throw new Error("Image not provided");
    }
  } catch (error) {
    console.error("Error in image save:", error);
    return Response.json({ message: "Error in image save. Internal server error", success: false }, { status: 500 });
  }
}
