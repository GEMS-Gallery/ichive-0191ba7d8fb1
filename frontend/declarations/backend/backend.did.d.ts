import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category {
  'id' : CategoryId,
  'name' : string,
  'description' : [] | [string],
}
export type CategoryId = bigint;
export interface Post {
  'id' : PostId,
  'content' : string,
  'createdAt' : Time,
  'author' : string,
  'threadId' : ThreadId,
}
export type PostId = bigint;
export type Result = { 'ok' : ThreadId } |
  { 'err' : string };
export type Result_1 = { 'ok' : PostId } |
  { 'err' : string };
export interface Thread {
  'id' : ThreadId,
  'categoryId' : CategoryId,
  'title' : string,
  'createdAt' : Time,
  'author' : string,
  'lastPost' : [] | [Post],
}
export type ThreadId = bigint;
export type Time = bigint;
export interface _SERVICE {
  'createPost' : ActorMethod<[ThreadId, string, string], Result_1>,
  'createThread' : ActorMethod<[CategoryId, string, string, string], Result>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getPosts' : ActorMethod<[ThreadId], Array<Post>>,
  'getThreads' : ActorMethod<[CategoryId], Array<Thread>>,
  'initialize' : ActorMethod<[], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
