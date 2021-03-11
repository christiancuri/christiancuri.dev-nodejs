import atob from "atob";
import btoa from "btoa";

import { IPost, Post, PostArchive, PostCounter, User } from "@models";

import { clone, Doc, HTTP400Error, parsePagination, Populate } from "@utils";

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

export async function getPostsPaths(): Promise<{ uri: string }[]> {
  const posts = await Post.find().select("uri").lean();
  return posts as { uri: string }[];
}

export async function getPost(uri: string): Promise<IPostPopulated> {
  const post = await Post.findOne({
    uri,
  })
    .populateTs(["author"])
    .lean();

  post.body = atob(post.body);

  return post;
}

export async function getPostById(id: string): Promise<IPostPopulated> {
  const post = await Post.findById(id).populateTs(["author"]).lean();

  post.body = atob(post.body);

  return post;
}

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

type CreatePostProps = {
  title: string;
  picture: string;
  description: string;
  body: string;
};

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
      body: btoa(body),
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

export async function updatePost({
  _id,
  title,
  picture,
  description,
  body,
}: Doc<IPost>): Promise<IPostPopulated> {
  if (!_id) throw new HTTP400Error("Missing post id");

  const payload = clone({ title, description, body, picture });

  if (!Object.keys(payload).length)
    throw new HTTP400Error("Missing updated fields");

  const updatedPost = await Post.findByIdAndUpdate(_id, payload, { new: true })
    .populateTs(["author"])
    .lean();

  return updatedPost;
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
