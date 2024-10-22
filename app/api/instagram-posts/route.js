export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch Instagram posts");
    }

    const data = await response.json();

    const posts = data.data.map((post) => ({
      id: post.id,
      image_url: post.media_url,
      title: post.caption || "Instagram Post",
      description: post.caption || "",
      permalink: post.permalink,
    }));

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch Instagram posts" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
