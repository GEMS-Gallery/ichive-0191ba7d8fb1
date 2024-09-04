export const idlFactory = ({ IDL }) => {
  const ThreadId = IDL.Nat;
  const PostId = IDL.Nat;
  const Result_1 = IDL.Variant({ 'ok' : PostId, 'err' : IDL.Text });
  const CategoryId = IDL.Nat;
  const Result = IDL.Variant({ 'ok' : ThreadId, 'err' : IDL.Text });
  const Category = IDL.Record({
    'id' : CategoryId,
    'name' : IDL.Text,
    'description' : IDL.Opt(IDL.Text),
  });
  const Time = IDL.Int;
  const Post = IDL.Record({
    'id' : PostId,
    'content' : IDL.Text,
    'createdAt' : Time,
    'author' : IDL.Text,
    'threadId' : ThreadId,
  });
  const Thread = IDL.Record({
    'id' : ThreadId,
    'categoryId' : CategoryId,
    'title' : IDL.Text,
    'createdAt' : Time,
    'author' : IDL.Text,
    'lastPost' : IDL.Opt(Post),
  });
  return IDL.Service({
    'createPost' : IDL.Func([ThreadId, IDL.Text, IDL.Text], [Result_1], []),
    'createThread' : IDL.Func(
        [CategoryId, IDL.Text, IDL.Text, IDL.Text],
        [Result],
        [],
      ),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getPosts' : IDL.Func([ThreadId], [IDL.Vec(Post)], ['query']),
    'getThreads' : IDL.Func([CategoryId], [IDL.Vec(Thread)], ['query']),
    'initialize' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
