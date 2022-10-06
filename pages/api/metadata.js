import getMetaData from "metadata-scraper";

export default async function handler(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL not found" });
  }

  try {
    const data = await getMetaData(url);
    res.status(200).json({
      title: data.title,
      description: data.description,
      language: data.language,
      url: data.url,
      provider: data.provider,
      published: data.published?.toString(),
      modified: data.modified?.toString(),
      twitter: data.twitter?.toString(),
      image: data.image,
      icon: data.icon,
    });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: `This URL cannot be parsed: ${error.message}` });
    }
  }
}
