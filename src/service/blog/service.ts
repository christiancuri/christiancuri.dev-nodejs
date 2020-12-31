import { IPost, Post, PostCounter, User } from "@models";

import { Doc, parsePagination, Populate } from "@utils";

type IPostPopulated = Doc<Populate<IPost, "author">>;

export async function getPosts(pagination: {
  skip?: string;
  limit?: string;
}): Promise<IPostPopulated[]> {
  const pages = parsePagination(pagination, 10);

  const posts: IPostPopulated[] = await Post.find()
    .skip(pages.skip)
    .limit(pages.limit)
    .populate("author")
    .sort({ _id: -1 })
    .lean();

  return posts;
}

type CreatePostProps = {
  title: string;
  picture: string;
  description: string;
  body: string;
};

function sanitizePostTitle(title: string): string {
  return title.replace(/[^a-zA-Z0-9]/g, "_");
}

async function getPostId(): Promise<number> {
  const { counter } = await PostCounter.findOneAndUpdate(
    {},
    {
      $inc: {
        counter: 1,
      },
    } as any,
    {
      upsert: true,
      new: true,
    },
  ).lean();
  return counter;
}

export async function createPost(
  { title, picture, description, body }: CreatePostProps,
  { userId }: { userId: string },
): Promise<IPostPopulated> {
  const postId = await getPostId();

  const uri = `${sanitizePostTitle(title)}-${postId}`.toLowerCase();

  const [newPost, user] = await Promise.all([
    Post.create({
      title,
      picture,
      description,
      body,
      uri,
      author: userId,
    }),
    User.findOne({ _id: userId }).lean(),
  ]);

  return {
    ...newPost.toObject(),
    author: user,
  };
}
