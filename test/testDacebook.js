const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dacebook", function () {
  let Dacebook, dacebook, owner, user1, user2, user3;
  
  beforeEach(async function () {
    [owner, user1, user2, user3] = await ethers.getSigners();
    Dacebook = await ethers.getContractFactory("Dacebook");
    dacebook = await Dacebook.deploy();
  });

  it("Should register users correctly", async function () {
    await expect(
      dacebook.connect(user1).register("Alice", "ipfs://profile1", "Bio1", "password1")
    ).to.emit(dacebook, "UserRegistered").withArgs(user1.address, "Alice");

    await expect(
      dacebook.connect(user2).register("Bob", "ipfs://profile2", "Bio2", "password2")
    ).to.emit(dacebook, "UserRegistered").withArgs(user2.address, "Bob");
  });

  it("Should not allow duplicate registration", async function () {
    await dacebook.connect(user1).register("Alice", "ipfs://profile1", "Bio1", "password1");
    await expect(
      dacebook.connect(user1).register("Alice", "ipfs://profile1", "Bio1", "password1")
    ).to.be.revertedWith("User already registered");
  });

  it("Should create posts correctly", async function () {
    await dacebook.connect(user1).register("Alice", "ipfs://profile1", "Bio1", "password1");
    await expect(
      dacebook.connect(user1).createPost("Hello World", ["ipfs://file1"])
    ).to.emit(dacebook, "NewPost").withArgs(user1.address, 0);
  });

  it("Should not allow unregistered users to create posts", async function () {
    await expect(
      dacebook.connect(user1).createPost("Hello World", [])
    ).to.be.revertedWith("User not registered");
  });

  it("Should allow users to like and unlike posts", async function () {
    await dacebook.connect(user1).register("Alice", "ipfs://profile1", "Bio1", "password1");
    await dacebook.connect(user2).register("Bob", "ipfs://profile2", "Bio2", "password2");
    await dacebook.connect(user1).createPost("Hello World", []);

    await dacebook.connect(user2).toggleLikeonPost(user1.address, 0);
    let posts = await dacebook.getUserPosts(user1.address);
    expect(posts[0].likes).to.equal(1);

    await dacebook.connect(user2).toggleLikeonPost(user1.address, 0);
    posts = await dacebook.getUserPosts(user1.address);
    expect(posts[0].likes).to.equal(0);
  });

  it("Should allow users to comment on posts", async function () {
    await dacebook.connect(user1).register("Alice", "ipfs://profile1", "Bio1", "password1");
    await dacebook.connect(user2).register("Bob", "ipfs://profile2", "Bio2", "password2");
    await dacebook.connect(user1).createPost("Hello World", []);

    await dacebook.connect(user2).commentOnPost(user1.address, 0, "Nice post!", user2.address);
    let posts = await dacebook.getUserPosts(user1.address);
    expect(posts[0].comments.length).to.equal(1);
    expect(posts[0].comments[0].text).to.equal("Nice post!");
  });

  it("Should allow users to add and remove friends", async function () {
    await dacebook.connect(user1).register("Alice", "ipfs://profile1", "Bio1", "password1");
    await dacebook.connect(user2).register("Bob", "ipfs://profile2", "Bio2", "password2");
    
    await dacebook.connect(user1).toggleFriend(user2.address);
    expect(await dacebook.areFriends(user1.address, user2.address)).to.equal(true);

    await dacebook.connect(user1).toggleFriend(user2.address);
    expect(await dacebook.areFriends(user1.address, user2.address)).to.equal(false);
  });

  it("Should return correct friend list", async function () {
    await dacebook.connect(user1).register("Alice", "ipfs://profile1", "Bio1", "password1");
    await dacebook.connect(user2).register("Bob", "ipfs://profile2", "Bio2", "password2");
    await dacebook.connect(user3).register("Charlie", "ipfs://profile3", "Bio3", "password3");
    
    await dacebook.connect(user1).toggleFriend(user2.address);
    await dacebook.connect(user1).toggleFriend(user3.address);
    await dacebook.connect(user1).toggleFriend(user3.address);

    const friends = await dacebook.connect(user1).getFriends();
    expect(friends.length).to.equal(1);
    expect(friends[0]).to.equal(user2.address);
  });

  it("Should return correct user profiles", async function () {
    await dacebook.connect(user1).register("Alice", "ipfs://profile1", "Bio1", "password1");
    const profile = await dacebook.getUserProfile(user1.address);
    expect(profile.name).to.equal("Alice");
    expect(profile.profilePic).to.equal("ipfs://profile1");
    expect(profile.bio).to.equal("Bio1");
  });
  it("Should return a feed containing user's and friends' posts in descending order of timestamp", async function () {
    await dacebook.connect(user1).register("Alice", "ipfs://profile1", "Bio1", "password1");
    await dacebook.connect(user2).register("Bob", "ipfs://profile2", "Bio2", "password2");
    await dacebook.connect(user3).register("Charlie", "ipfs://profile3", "Bio3", "password3");

    // User1 and User2 create posts
    await dacebook.connect(user1).createPost("Alice's First Post", []);
    await dacebook.connect(user2).createPost("Bob's First Post", []);

    // User1 adds User2 as a friend
    await dacebook.connect(user1).toggleFriend(user2.address);

    // Fetch the feed
    const feed = await dacebook.connect(user1).getFeed();
    
    // Ensure the feed contains both posts
    expect(feed.length).to.equal(2);
    
    // Check if the most recent post appears first
    expect(feed[0].timestamp).to.be.greaterThanOrEqual(feed[1].timestamp);
  });
});
