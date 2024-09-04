import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
  // Types
  type CategoryId = Nat;
  type ThreadId = Nat;
  type PostId = Nat;

  type Category = {
    id: CategoryId;
    name: Text;
    description: ?Text;
  };

  type Thread = {
    id: ThreadId;
    categoryId: CategoryId;
    title: Text;
    author: Text;
    createdAt: Time.Time;
    lastPost: ?Post;
  };

  type Post = {
    id: PostId;
    threadId: ThreadId;
    author: Text;
    content: Text;
    createdAt: Time.Time;
  };

  // Stable storage
  stable var categoryCounter : Nat = 0;
  stable var threadCounter : Nat = 0;
  stable var postCounter : Nat = 0;

  let categories = HashMap.HashMap<CategoryId, Category>(10, Nat.equal, Hash.hash);
  let threads = HashMap.HashMap<ThreadId, Thread>(100, Nat.equal, Hash.hash);
  let posts = HashMap.HashMap<PostId, Post>(1000, Nat.equal, Hash.hash);

  // Helper functions
  func generateId(counter: Nat) : Nat {
    counter + 1
  };

  // API methods
  public query func getCategories() : async [Category] {
    Iter.toArray(categories.vals())
  };

  public query func getThreads(categoryId: CategoryId) : async [Thread] {
    let categoryThreads = Buffer.Buffer<Thread>(10);
    for (thread in threads.vals()) {
      if (thread.categoryId == categoryId) {
        categoryThreads.add(thread);
      };
    };
    Buffer.toArray(categoryThreads)
  };

  public query func getPosts(threadId: ThreadId) : async [Post] {
    let threadPosts = Buffer.Buffer<Post>(20);
    for (post in posts.vals()) {
      if (post.threadId == threadId) {
        threadPosts.add(post);
      };
    };
    Buffer.toArray(threadPosts)
  };

  public func createThread(categoryId: CategoryId, title: Text, content: Text, author: Text) : async Result.Result<ThreadId, Text> {
    switch (categories.get(categoryId)) {
      case null {
        #err("Category not found")
      };
      case (?_) {
        threadCounter += 1;
        let threadId = threadCounter;
        let now = Time.now();
        let newPost : Post = {
          id = postCounter + 1;
          threadId = threadId;
          author = author;
          content = content;
          createdAt = now;
        };
        let newThread : Thread = {
          id = threadId;
          categoryId = categoryId;
          title = title;
          author = author;
          createdAt = now;
          lastPost = ?newPost;
        };
        threads.put(threadId, newThread);
        posts.put(newPost.id, newPost);
        postCounter += 1;
        #ok(threadId)
      };
    }
  };

  public func createPost(threadId: ThreadId, content: Text, author: Text) : async Result.Result<PostId, Text> {
    switch (threads.get(threadId)) {
      case null {
        #err("Thread not found")
      };
      case (?thread) {
        postCounter += 1;
        let postId = postCounter;
        let now = Time.now();
        let newPost : Post = {
          id = postId;
          threadId = threadId;
          author = author;
          content = content;
          createdAt = now;
        };
        posts.put(postId, newPost);
        let updatedThread = {
          thread with
          lastPost = ?newPost;
        };
        threads.put(threadId, updatedThread);
        #ok(postId)
      };
    }
  };

  // Initialize some sample data
  public func initialize() : async () {
    let sampleCategories = [
      { id = 1; name = "General Discussion"; description = ?"A place for general topics" },
      { id = 2; name = "Technology"; description = ?"Discuss the latest in tech" },
      { id = 3; name = "Sports"; description = ?"All things sports-related" },
    ];

    for (category in sampleCategories.vals()) {
      categories.put(category.id, category);
      categoryCounter += 1;
    };
  };
}
