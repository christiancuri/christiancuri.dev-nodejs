import { IPost, Post, PostArchive, PostCounter, User } from "@models";

import { Doc, HTTP400Error, parsePagination, Populate } from "@utils";

type IPostPopulated = Doc<Populate<IPost, "author">>;

export async function getPosts(pagination: {
  skip?: string;
  limit?: string;
}): Promise<{
  total: number;
  hasMore: boolean;
  pagination: {
    skip: number;
    limit: number;
  };
  data: IPostPopulated[];
}> {
  const pages = parsePagination(pagination, 10);

  const [posts, totalPosts]: [IPostPopulated[], number] = await Promise.all([
    Post.find()
      .skip(pages.skip)
      .limit(pages.limit)
      .populateTs(["author"])
      .select("-body")
      .sort({ _id: -1 })
      .lean(),
    Post.estimatedDocumentCount(),
  ]);

  return {
    total: totalPosts,
    hasMore: pages.skip + pages.limit < totalPosts,
    pagination: {
      skip: pages.skip + pages.limit,
      limit: pages.limit,
    },
    data: posts,
  };
}

export async function getPost(uri: string): Promise<IPostPopulated> {
  const post = await Post.findOne({
    uri,
  })
    .populateTs(["author"])
    .lean();

  return post;
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
    },
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

export async function archivePost(postId: string): Promise<void> {
  const post = await Post.findOne({
    _id: postId,
  }).lean();

  if (!post) throw new HTTP400Error("Post not exists");

  delete post._id;

  await Promise.all([
    Post.findOneAndDelete({
      _id: postId,
    }),
    PostArchive.create({
      ...post,
      archivedAt: new Date().toISOString(),
    }),
  ]);
}
